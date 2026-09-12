const Admission = require('../models/Admission');
const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, paginate } = require('../utils/apiResponse');

exports.create = asyncHandler(async (req, res) => {
  const required = ['studentName', 'dateOfBirth', 'applyingClass', 'parentName', 'phone', 'email', 'address'];
  for (const field of required) {
    if (!req.body[field]) {
      const error = new Error(`${field} is required`);
      error.statusCode = 400;
      throw error;
    }
  }
  const application = await Admission.create(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Application submitted',
    data: { id: application._id, status: application.status },
  });
});

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { studentName: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') },
      { phone: new RegExp(req.query.search, 'i') },
    ];
  }
  const [items, total] = await Promise.all([
    Admission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Admission.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, meta: { page, limit, total } });
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = await Admission.findById(req.params.id);
  if (!item) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }
  sendSuccess(res, { data: item });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'under_review', 'approved', 'rejected'];
  if (!allowed.includes(status)) {
    const error = new Error('Invalid status');
    error.statusCode = 400;
    throw error;
  }

  const application = await Admission.findById(req.params.id);
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  application.status = status;
  application.reviewedBy = req.user._id;
  await application.save();

  let student = null;
  if (status === 'approved') {
    const klass = await Class.findOne({ name: application.applyingClass });
    const password = process.env.SEED_PASSWORD || 'SmartSchool@123';
    const email = application.email.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: application.studentName,
        email,
        password,
        role: 'student',
      });
    }
    const count = await Student.countDocuments();
    student = await Student.findOne({ userId: user._id });
    if (!student) {
      student = await Student.create({
        userId: user._id,
        studentId: `STU${String(count + 1).padStart(4, '0')}`,
        name: application.studentName,
        classId: klass?._id,
        section: klass?.section,
        dateOfBirth: application.dateOfBirth,
        phone: application.phone,
        parentName: application.parentName,
        parentPhone: application.phone,
        address: application.address,
      });
    }
  }

  sendSuccess(res, { message: 'Admission status updated', data: { application, student } });
});
