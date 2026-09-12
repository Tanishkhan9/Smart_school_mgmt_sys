const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const dayRange = (value) => {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
};

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.studentId) filter.studentId = req.query.studentId;
  if (req.query.date) {
    const { start, end } = dayRange(req.query.date);
    filter.date = { $gte: start, $lt: end };
  }
  const items = await Attendance.find(filter)
    .populate('studentId classId markedBy', '-password')
    .sort({ date: -1 });
  sendSuccess(res, { data: items });
});

exports.forStudent = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    const me = await Student.findOne({ userId: req.user._id });
    if (!me || String(me._id) !== String(req.params.studentId)) {
      const error = new Error('You can only view your own attendance');
      error.statusCode = 403;
      throw error;
    }
  }

  const items = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
  const present = items.filter((i) => i.status === 'present').length;
  const absent = items.filter((i) => i.status === 'absent').length;
  const late = items.filter((i) => i.status === 'late').length;
  const percentage = items.length ? Math.round(((present + late * 0.5) / items.length) * 100) : 0;
  sendSuccess(res, { data: items, meta: { present, absent, late, total: items.length, percentage } });
});

exports.bulkSave = asyncHandler(async (req, res) => {
  const { classId, date, records } = req.body;
  if (!classId || !date || !Array.isArray(records)) {
    const error = new Error('classId, date, and records are required');
    error.statusCode = 400;
    throw error;
  }

  if (req.user.role === 'teacher') {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    const allowed = (teacher?.classes || []).map(String);
    if (!allowed.includes(String(classId))) {
      const error = new Error('You are not assigned to this class');
      error.statusCode = 403;
      throw error;
    }
  }

  const { start } = dayRange(date);
  const saved = [];
  for (const row of records) {
    const doc = await Attendance.findOneAndUpdate(
      { studentId: row.studentId, date: start },
      {
        studentId: row.studentId,
        classId,
        date: start,
        status: row.status,
        markedBy: req.user._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    saved.push(doc);
  }

  sendSuccess(res, { message: 'Attendance saved', data: saved });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    const error = new Error('Attendance record not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Attendance updated', data: item });
});
