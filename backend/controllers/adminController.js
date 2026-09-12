const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Admission = require('../models/Admission');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.dashboard = asyncHandler(async (_req, res) => {
  const [students, teachers, classes, pendingAdmissions] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Class.countDocuments(),
    Admission.countDocuments({ status: 'pending' }),
  ]);

  const classGroups = await Student.aggregate([
    { $group: { _id: '$classId', count: { $sum: 1 } } },
  ]);

  const populatedClasses = await Class.populate(classGroups, { path: '_id', select: 'name section' });

  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const count = await Admission.countDocuments({ createdAt: { $gte: start, $lt: end } });
    months.push({
      month: start.toLocaleString('en-US', { month: 'short' }),
      applications: count,
    });
  }

  const attendance = await Attendance.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const examPerformance = await Result.aggregate([
    { $match: { published: true } },
    { $group: { _id: '$grade', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  sendSuccess(res, {
    data: {
      counts: { students, teachers, classes, pendingAdmissions },
      studentsByClass: populatedClasses.map((row) => ({
        className: row._id ? `${row._id.name}-${row._id.section}` : 'Unassigned',
        count: row.count,
      })),
      admissionsByMonth: months,
      attendanceOverview: attendance,
      examPerformance,
    },
  });
});
