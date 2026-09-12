const Result = require('../models/Result');
const Student = require('../models/Student');
const Examination = require('../models/Examination');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { calculatePercentage, calculateGrade } = require('../utils/gradeCalculator');

const applyScores = (payload) => {
  const percentage = calculatePercentage(payload.marks, payload.maxMarks || 100);
  return {
    ...payload,
    percentage,
    grade: calculateGrade(percentage),
  };
};

exports.listForStudent = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    const me = await Student.findOne({ userId: req.user._id });
    if (!me || String(me._id) !== String(req.params.studentId)) {
      const error = new Error('You can only view your own results');
      error.statusCode = 403;
      throw error;
    }
  }

  const filter = { studentId: req.params.studentId };
  if (req.user.role === 'student') filter.published = true;

  const items = await Result.find(filter).populate('examinationId subjectId').sort({ createdAt: -1 });
  sendSuccess(res, { data: items });
});

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.examinationId) filter.examinationId = req.query.examinationId;
  if (req.query.classId) {
    const students = await Student.find({ classId: req.query.classId }).select('_id');
    filter.studentId = { $in: students.map((s) => s._id) };
  }
  const items = await Result.find(filter).populate('studentId examinationId subjectId');
  sendSuccess(res, { data: items });
});

exports.upsert = asyncHandler(async (req, res) => {
  const { studentId, examinationId, marks, maxMarks = 100, remarks } = req.body;
  const exam = await Examination.findById(examinationId);
  if (!exam) {
    const error = new Error('Examination not found');
    error.statusCode = 404;
    throw error;
  }
  if (Number(marks) < 0 || Number(marks) > Number(maxMarks)) {
    const error = new Error('Marks must be between 0 and maximum marks');
    error.statusCode = 400;
    throw error;
  }

  const scored = applyScores({
    studentId,
    examinationId,
    subjectId: exam.subjectId,
    marks,
    maxMarks,
    remarks,
  });

  const item = await Result.findOneAndUpdate(
    { studentId, examinationId },
    scored,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { message: 'Result saved', data: item });
});

exports.update = asyncHandler(async (req, res) => {
  const current = await Result.findById(req.params.id);
  if (!current) {
    const error = new Error('Result not found');
    error.statusCode = 404;
    throw error;
  }
  const payload = { ...current.toObject(), ...req.body };
  const scored = req.body.marks !== undefined || req.body.maxMarks !== undefined ? applyScores(payload) : payload;
  const item = await Result.findByIdAndUpdate(req.params.id, scored, { new: true, runValidators: true });
  sendSuccess(res, { message: 'Result updated', data: item });
});

exports.publishMany = asyncHandler(async (req, res) => {
  const { examinationId, published = true } = req.body;
  if (!examinationId) {
    const error = new Error('examinationId is required');
    error.statusCode = 400;
    throw error;
  }
  await Result.updateMany({ examinationId }, { published });
  sendSuccess(res, { message: published ? 'Results published' : 'Results unpublished' });
});
