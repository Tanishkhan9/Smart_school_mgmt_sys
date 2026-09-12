const Notice = require('../models/Notice');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const now = new Date();
  const filter = {
    $and: [{ $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gte: now } }] }],
  };

  if (req.user?.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    filter.$and.push({
      $or: [
        { audience: { $in: ['all', 'students', 'public'] } },
        { classId: student?.classId },
      ],
    });
  } else if (req.user?.role === 'teacher') {
    filter.$and.push({ audience: { $in: ['all', 'teachers', 'public'] } });
  } else if (!req.user) {
    filter.$and.push({ audience: 'public' });
  }

  const items = await Notice.find(filter).populate('createdBy classId', 'name role').sort({ createdAt: -1 });
  sendSuccess(res, { data: items });
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Notice.create({ ...req.body, createdBy: req.user._id });
  sendSuccess(res, { statusCode: 201, message: 'Notice published', data: item });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Notice updated', data: item });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await Notice.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { message: 'Notice deleted' });
});
