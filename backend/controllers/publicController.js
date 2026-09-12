const Contact = require('../models/Contact');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.contact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    const error = new Error('Name, email, and message are required');
    error.statusCode = 400;
    throw error;
  }
  const item = await Contact.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Message received. We will get back to you shortly.', data: { id: item._id } });
});

exports.featuredTeachers = asyncHandler(async (_req, res) => {
  const items = await Teacher.find().populate('subjects').limit(8).sort({ createdAt: 1 });
  sendSuccess(res, { data: items });
});
