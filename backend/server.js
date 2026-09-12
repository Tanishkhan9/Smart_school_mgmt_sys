require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorMiddleware, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const isDev = process.env.NODE_ENV !== 'production';
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isDev) return callback(null, true);
      const allowed = (process.env.CLIENT_URL || 'http://localhost:5173')
        .split(',')
        .map((s) => s.trim());
      if (allowed.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.render.com')) {
        return callback(null, true);
      }
      return callback(new Error(`Blocked by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'SmartSchool API is running' });
});

const publicController = require('./controllers/publicController');
app.post('/api/contact', publicController.contact);
app.get('/api/public/teachers', publicController.featuredTeachers);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/examinations', require('./routes/examinationRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`SmartSchool API listening on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server', err);
      process.exit(1);
    });
}
