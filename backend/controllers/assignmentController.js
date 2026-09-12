const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.subjectId) filter.subjectId = req.query.subjectId;

  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    if (student?.classId) filter.classId = student.classId;
  }
  if (req.user.role === 'teacher') {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (teacher) filter.teacherId = teacher._id;
  }

  const items = await Assignment.find(filter)
    .populate('classId subjectId teacherId')
    .sort({ dueDate: 1 });

  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    const submissions = await AssignmentSubmission.find({ studentId: student._id });
    const map = new Map(submissions.map((s) => [String(s.assignmentId), s]));
    return sendSuccess(res, {
      data: items.map((item) => ({
        ...item.toObject(),
        submission: map.get(String(item._id)) || null,
      })),
    });
  }

  sendSuccess(res, { data: items });
});

exports.create = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ userId: req.user._id });
  const payload = {
    ...req.body,
    teacherId: req.body.teacherId || teacher?._id,
    attachment: req.file ? `/uploads/${req.file.filename}` : req.body.attachment,
  };
  const item = await Assignment.create(payload);
  sendSuccess(res, { statusCode: 201, message: 'Assignment created', data: item });
});

exports.update = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.attachment = `/uploads/${req.file.filename}`;
  const item = await Assignment.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!item) {
    const error = new Error('Assignment not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Assignment updated', data: item });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await Assignment.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error('Assignment not found');
    error.statusCode = 404;
    throw error;
  }
  await AssignmentSubmission.deleteMany({ assignmentId: item._id });
  sendSuccess(res, { message: 'Assignment deleted' });
});

exports.submit = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const assignment = await Assignment.findById(req.params.id);
  if (!student || !assignment) {
    const error = new Error('Assignment or student profile not found');
    error.statusCode = 404;
    throw error;
  }

  const late = new Date() > new Date(assignment.dueDate);
  const submission = await AssignmentSubmission.findOneAndUpdate(
    { assignmentId: assignment._id, studentId: student._id },
    {
      assignmentId: assignment._id,
      studentId: student._id,
      file: req.file ? `/uploads/${req.file.filename}` : req.body.file,
      notes: req.body.notes,
      status: late ? 'late' : 'submitted',
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { message: 'Assignment submitted', data: submission });
});

exports.submissions = asyncHandler(async (req, res) => {
  const items = await AssignmentSubmission.find({ assignmentId: req.params.id }).populate('studentId');
  sendSuccess(res, { data: items });
});
