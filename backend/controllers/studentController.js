const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Examination = require('../models/Examination');
const Assignment = require('../models/Assignment');
const Notice = require('../models/Notice');
const Subject = require('../models/Subject');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, paginate } = require('../utils/apiResponse');

const getOwnStudent = async (user) => {
  const student = await Student.findOne({ userId: user._id }).populate('classId');
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return student;
};

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.section) filter.section = req.query.section;
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { studentId: new RegExp(req.query.search, 'i') },
      { rollNumber: new RegExp(req.query.search, 'i') },
    ];
  }

  if (req.user.role === 'teacher') {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user._id });
    filter.classId = { $in: teacher?.classes || [] };
  }

  const [items, total] = await Promise.all([
    Student.find(filter).populate('classId userId', '-password').skip(skip).limit(limit).sort({ name: 1 }),
    Student.countDocuments(filter),
  ]);

  sendSuccess(res, { data: items, meta: { page, limit, total } });
});

exports.getOne = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('classId userId', '-password');
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { data: student });
});

exports.create = asyncHandler(async (req, res) => {
  const { name, email, password, ...profile } = req.body;
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ name, email, password, role: 'student' });
  const count = await Student.countDocuments();
  const student = await Student.create({
    ...profile,
    name,
    userId: user._id,
    studentId: profile.studentId || `STU${String(count + 1).padStart(4, '0')}`,
  });

  sendSuccess(res, { statusCode: 201, message: 'Student created', data: student });
});

exports.update = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  if (req.body.name || req.body.email || typeof req.body.isActive === 'boolean') {
    await User.findByIdAndUpdate(student.userId, {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.email && { email: req.body.email }),
      ...(typeof req.body.isActive === 'boolean' && { isActive: req.body.isActive }),
    });
  }
  sendSuccess(res, { message: 'Student updated', data: student });
});

exports.remove = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  await User.findByIdAndUpdate(student.userId, { isActive: false });
  await student.deleteOne();
  sendSuccess(res, { message: 'Student deactivated and removed' });
});

exports.dashboard = asyncHandler(async (req, res) => {
  const student = await getOwnStudent(req.user);
  const records = await Attendance.find({ studentId: student._id });
  const present = records.filter((r) => r.status === 'present').length;
  const late = records.filter((r) => r.status === 'late').length;
  const attendancePct = records.length
    ? Math.round(((present + late * 0.5) / records.length) * 100)
    : 0;

  const results = await Result.find({ studentId: student._id, published: true });
  const avgMarks = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;

  const upcomingExams = await Examination.find({
    classId: student.classId,
    date: { $gte: new Date() },
  })
    .populate('subjectId')
    .sort({ date: 1 })
    .limit(5);

  const pendingAssignments = await Assignment.find({
    classId: student.classId,
    dueDate: { $gte: new Date() },
  })
    .populate('subjectId')
    .sort({ dueDate: 1 })
    .limit(5);

  const notices = await Notice.find({
    $and: [
      { $or: [{ audience: { $in: ['all', 'students'] } }, { classId: student.classId }] },
      { $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gte: new Date() } }] },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(5);

  sendSuccess(res, {
    data: {
      student,
      attendancePercentage: attendancePct,
      averageMarks: avgMarks,
      upcomingExams,
      pendingAssignments,
      notices,
      attendanceBreakdown: {
        present,
        absent: records.filter((r) => r.status === 'absent').length,
        late,
        total: records.length,
      },
    },
  });
});

exports.profile = asyncHandler(async (req, res) => {
  const student = await getOwnStudent(req.user);
  const user = await User.findById(req.user._id).select('-password');
  sendSuccess(res, { data: { ...student.toObject(), email: user.email } });
});

exports.mySubjects = asyncHandler(async (req, res) => {
  const student = await getOwnStudent(req.user);
  const subjects = await Subject.find({
    $or: [{ classId: student.classId }, { classId: null }],
  }).populate('teacherId');
  sendSuccess(res, { data: subjects });
});
