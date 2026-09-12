require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Examination = require('../models/Examination');
const Result = require('../models/Result');
const Assignment = require('../models/Assignment');
const Notice = require('../models/Notice');
const Admission = require('../models/Admission');
const { calculatePercentage, calculateGrade } = require('../utils/gradeCalculator');

const password = process.env.SEED_PASSWORD || 'SmartSchool@123';

const reset = async () => {
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    Class.deleteMany({}),
    Subject.deleteMany({}),
    Attendance.deleteMany({}),
    Examination.deleteMany({}),
    Result.deleteMany({}),
    Assignment.deleteMany({}),
    Notice.deleteMany({}),
    Admission.deleteMany({}),
  ]);
};

const seed = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await reset();

  const admin = await User.create({
    name: 'Aisha Rahman',
    email: 'admin@smartschool.test',
    password,
    role: 'admin',
  });

  const adminAlpha = await User.create({
    name: 'Mr. Mobin & Mr. Gautam',
    email: 'admin@alphalearningzone.com',
    password,
    role: 'admin',
  });

  const teacherUser = await User.create({
    name: 'Daniel Okonkwo',
    email: 'teacher@smartschool.test',
    password,
    role: 'teacher',
  });

  const studentUser = await User.create({
    name: 'Maya Chen',
    email: 'student@smartschool.test',
    password,
    role: 'student',
  });

  const extraStudents = await User.create([
    { name: 'Rahul Mehta', email: 'rahul@smartschool.test', password, role: 'student' },
    { name: 'Priya Nair', email: 'priya@smartschool.test', password, role: 'student' },
    { name: 'Aman Joshi', email: 'aman@smartschool.test', password, role: 'student' },
  ]);

  const teacher = await Teacher.create({
    userId: teacherUser._id,
    employeeId: 'TCH0001',
    name: teacherUser.name,
    email: teacherUser.email,
    phone: '+91 98765 11111',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    bio: 'Senior mathematics faculty with a focus on conceptual clarity and exam readiness.',
  });

  const class10A = await Class.create({
    name: '10',
    section: 'A',
    classTeacher: teacher._id,
    academicYear: '2026-2027',
  });
  const class10B = await Class.create({
    name: '10',
    section: 'B',
    academicYear: '2026-2027',
  });
  const class9A = await Class.create({
    name: '9',
    section: 'A',
    academicYear: '2026-2027',
  });

  const math = await Subject.create({
    name: 'Mathematics',
    code: 'MATH10',
    classId: class10A._id,
    teacherId: teacher._id,
    description: 'Algebra, geometry, and introductory trigonometry.',
  });
  const science = await Subject.create({
    name: 'Science',
    code: 'SCI10',
    classId: class10A._id,
    teacherId: teacher._id,
    description: 'Physics, chemistry, and biology foundations.',
  });
  const english = await Subject.create({
    name: 'English',
    code: 'ENG10',
    classId: class10A._id,
    description: 'Literature, grammar, and academic writing.',
  });

  teacher.subjects = [math._id, science._id];
  teacher.classes = [class10A._id, class10B._id];
  await teacher.save();

  class10A.subjects = [math._id, science._id, english._id];
  await class10A.save();

  const maya = await Student.create({
    userId: studentUser._id,
    studentId: 'STU0001',
    name: studentUser.name,
    classId: class10A._id,
    section: 'A',
    rollNumber: '12',
    dateOfBirth: new Date('2010-04-18'),
    phone: '+91 90000 22222',
    parentName: 'Wei Chen',
    parentPhone: '+91 90000 33333',
    address: '14 Lakeview Road, Pune',
  });

  const classmates = await Student.create([
    {
      userId: extraStudents[0]._id,
      studentId: 'STU0002',
      name: extraStudents[0].name,
      classId: class10A._id,
      section: 'A',
      rollNumber: '08',
      dateOfBirth: new Date('2010-01-09'),
      parentName: 'Sanjay Mehta',
      phone: '+91 90000 44444',
      address: 'Kothrud, Pune',
    },
    {
      userId: extraStudents[1]._id,
      studentId: 'STU0003',
      name: extraStudents[1].name,
      classId: class10A._id,
      section: 'A',
      rollNumber: '21',
      dateOfBirth: new Date('2010-07-22'),
      parentName: 'Anjali Nair',
      phone: '+91 90000 55555',
      address: 'Baner, Pune',
    },
    {
      userId: extraStudents[2]._id,
      studentId: 'STU0004',
      name: extraStudents[2].name,
      classId: class10B._id,
      section: 'B',
      rollNumber: '03',
      dateOfBirth: new Date('2010-11-02'),
      parentName: 'Ravi Joshi',
      phone: '+91 90000 66666',
      address: 'Viman Nagar, Pune',
    },
  ]);

  const students = [maya, ...classmates];
  const statuses = ['present', 'present', 'late', 'absent', 'present'];
  for (let i = 0; i < 12; i += 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    for (const student of students.filter((s) => String(s.classId) === String(class10A._id))) {
      await Attendance.create({
        studentId: student._id,
        classId: class10A._id,
        date,
        status: statuses[(i + Number(student.rollNumber)) % statuses.length],
        markedBy: teacherUser._id,
      });
    }
  }

  const midterm = await Examination.create({
    name: 'Mid-Term Examination',
    classId: class10A._id,
    subjectId: math._id,
    date: new Date('2026-10-20'),
    startTime: '09:00',
    duration: 180,
    room: 'Hall 2',
    instructions: 'Bring admit card. Calculators are not allowed.',
    status: 'scheduled',
  });
  const scienceExam = await Examination.create({
    name: 'Mid-Term Examination',
    classId: class10A._id,
    subjectId: science._id,
    date: new Date('2026-10-22'),
    startTime: '09:00',
    duration: 180,
    room: 'Lab 1',
    status: 'scheduled',
  });

  const marksMap = [
    [maya, 87],
    [classmates[0], 92],
    [classmates[1], 78],
  ];
  for (const [student, marks] of marksMap) {
    const percentage = calculatePercentage(marks, 100);
    await Result.create({
      studentId: student._id,
      examinationId: midterm._id,
      subjectId: math._id,
      marks,
      maxMarks: 100,
      percentage,
      grade: calculateGrade(percentage),
      published: true,
    });
  }

  await Assignment.create({
    title: 'Quadratic Equations Worksheet',
    description: 'Solve the attached problem set and show working for each question.',
    classId: class10A._id,
    subjectId: math._id,
    teacherId: teacher._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await Notice.create([
    {
      title: 'Annual Day rehearsals begin Monday',
      content: 'All Class 10 students should report to the auditorium at 3:00 PM.',
      audience: 'students',
      classId: class10A._id,
      createdBy: admin._id,
      priority: 'high',
    },
    {
      title: 'Mid-term timetable published',
      content: 'The October mid-term schedule is now available in the examinations section.',
      audience: 'all',
      createdBy: teacherUser._id,
      priority: 'normal',
    },
    {
      title: 'Admissions open for 2026-27',
      content: 'Applications are now being accepted for Classes 1 through 11.',
      audience: 'public',
      createdBy: admin._id,
      priority: 'high',
    },
  ]);

  await Admission.create([
    {
      studentName: 'Neha Kapoor',
      dateOfBirth: new Date('2011-03-14'),
      applyingClass: '9',
      parentName: 'Rohit Kapoor',
      phone: '+91 98888 12121',
      email: 'neha.kapoor@example.com',
      address: 'Kalyani Nagar, Pune',
      previousSchool: 'Riverdale Public School',
      status: 'pending',
    },
    {
      studentName: 'Ishaan Patel',
      dateOfBirth: new Date('2010-09-01'),
      applyingClass: '10',
      parentName: 'Meera Patel',
      phone: '+91 98888 34343',
      email: 'ishaan.patel@example.com',
      address: 'Wakad, Pune',
      status: 'under_review',
    },
  ]);

  console.log('Seed complete.');
  console.log('Demo password:', password);
  console.log('Admin   admin@smartschool.test');
  console.log('Teacher teacher@smartschool.test');
  console.log('Student student@smartschool.test');
};

const runSeed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await seed();
  await mongoose.disconnect();
};

if (require.main === module) {
  runSeed().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  });
}

module.exports = { seed, reset };
