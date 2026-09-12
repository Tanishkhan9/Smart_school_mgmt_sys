const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    applyingClass: { type: String, required: true },
    parentName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    previousSchool: { type: String },
    additionalInfo: { type: String },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admission', admissionSchema);
