const Examination = require('../models/Examination');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.user?.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    if (student?.classId) filter.classId = student.classId;
  }
  const items = await Examination.find(filter).populate('classId subjectId').sort({ date: 1 });
  sendSuccess(res, { data: items });
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = await Examination.findById(req.params.id).populate('classId subjectId');
  if (!item) {
    const error = new Error('Examination not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { data: item });
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Examination.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Examination created', data: item });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await Examination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    const error = new Error('Examination not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Examination updated', data: item });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await Examination.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error('Examination not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Examination deleted' });
});
