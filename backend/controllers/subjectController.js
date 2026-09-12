const Subject = require('../models/Subject');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  const items = await Subject.find(filter).populate('classId teacherId').sort({ name: 1 });
  sendSuccess(res, { data: items });
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Subject.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Subject created', data: item });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Subject updated', data: item });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await Subject.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Subject deleted' });
});
