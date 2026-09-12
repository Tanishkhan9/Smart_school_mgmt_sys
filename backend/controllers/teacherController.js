const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const Examination = require('../models/Examination');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, paginate } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { employeeId: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') },
    ];
  }
  const [items, total] = await Promise.all([
    Teacher.find(filter).populate('subjects classes').skip(skip).limit(limit).sort({ name: 1 }),
    Teacher.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, meta: { page, limit, total } });
});

exports.getOne = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('subjects classes userId', '-password');
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { data: teacher });
});

exports.create = asyncHandler(async (req, res) => {
  const { name, email, password, ...profile } = req.body;
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }
  const user = await User.create({ name, email, password, role: 'teacher' });
  const count = await Teacher.countDocuments();
  const teacher = await Teacher.create({
    ...profile,
    name,
    email,
    userId: user._id,
    employeeId: profile.employeeId || `TCH${String(count + 1).padStart(4, '0')}`,
  });
  sendSuccess(res, { statusCode: 201, message: 'Teacher created', data: teacher });
});

exports.update = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = 404;
    throw error;
  }
  await User.findByIdAndUpdate(teacher.userId, {
    ...(req.body.name && { name: req.body.name }),
    ...(req.body.email && { email: req.body.email }),
  });
  sendSuccess(res, { message: 'Teacher updated', data: teacher });
});

exports.remove = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = 404;
    throw error;
  }
  await User.findByIdAndUpdate(teacher.userId, { isActive: false });
  await teacher.deleteOne();
  sendSuccess(res, { message: 'Teacher deactivated and removed' });
});

exports.dashboard = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ userId: req.user._id }).populate('classes subjects');
  if (!teacher) {
    const error = new Error('Teacher profile not found');
    error.statusCode = 404;
    throw error;
  }

  const classIds = teacher.classes.map((c) => c._id);
  const studentCount = await Student.countDocuments({ classId: { $in: classIds } });
  const pendingAssignments = await Assignment.find({ teacherId: teacher._id }).sort({ dueDate: 1 }).limit(6);
  const upcomingExams = await Examination.find({
    classId: { $in: classIds },
    date: { $gte: new Date() },
  })
    .populate('subjectId classId')
    .sort({ date: 1 })
    .limit(6);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todayAttendance = await Attendance.find({
    classId: { $in: classIds },
    date: { $gte: today, $lt: tomorrow },
  });

  sendSuccess(res, {
    data: {
      teacher,
      studentCount,
      assignedClasses: teacher.classes,
      pendingAssignments,
      upcomingExams,
      todayAttendance: {
        present: todayAttendance.filter((a) => a.status === 'present').length,
        absent: todayAttendance.filter((a) => a.status === 'absent').length,
        late: todayAttendance.filter((a) => a.status === 'late').length,
      },
    },
  });
});
