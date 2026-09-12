const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    section: { type: String, trim: true },
    rollNumber: { type: String, trim: true },
    dateOfBirth: { type: Date },
    phone: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    address: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true }
);

studentSchema.index({ classId: 1, section: 1, rollNumber: 1 });
studentSchema.index({ name: 'text', studentId: 'text' });

module.exports = mongoose.model('Student', studentSchema);
