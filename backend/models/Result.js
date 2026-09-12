const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    examinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Examination', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marks: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, default: 100 },
    percentage: { type: Number },
    grade: { type: String },
    remarks: { type: String },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, examinationId: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
