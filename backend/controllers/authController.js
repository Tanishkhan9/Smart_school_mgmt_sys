const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const attachProfile = async (user) => {
  const payload = user.toObject();
  if (user.role === 'student') {
    payload.profile = await Student.findOne({ userId: user._id }).populate('classId');
  }
  if (user.role === 'teacher') {
    payload.profile = await Teacher.findOne({ userId: user._id }).populate('subjects classes');
  }
  return payload;
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }
  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const allowedRole = req.user?.role === 'admin' ? role || 'student' : 'student';
  if (!['admin', 'teacher', 'student'].includes(allowedRole)) {
    const error = new Error('Invalid role');
    error.statusCode = 400;
    throw error;
  }
  if (allowedRole === 'admin' && req.user?.role !== 'admin') {
    const error = new Error('Cannot create an admin account');
    error.statusCode = 403;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: allowedRole,
    lastLogin: new Date(),
  });

  if (allowedRole === 'student') {
    const count = await Student.countDocuments();
    await Student.create({
      userId: user._id,
      studentId: `ALZ${String(count + 1).padStart(4, '0')}`,
      name: user.name,
      email: user.email,
    });
  }

  const token = generateToken(user);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user: await attachProfile(user), token },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  if (!user.isActive) {
    const error = new Error('Account is deactivated');
    error.statusCode = 403;
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);
  user.password = undefined;
  sendSuccess(res, {
    message: 'Logged in successfully',
    data: { user: await attachProfile(user), token },
  });
});

exports.logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token');
  sendSuccess(res, { message: 'Logged out', data: null });
});

exports.me = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { user: await attachProfile(req.user) } });
});
