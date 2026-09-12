const Class = require('../models/Class');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (_req, res) => {
  const items = await Class.find().populate('classTeacher subjects').sort({ name: 1, section: 1 });
  sendSuccess(res, { data: items });
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Class.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Class created', data: item });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error('Class not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Class updated', data: item });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await Class.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error('Class not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Class deleted' });
});
