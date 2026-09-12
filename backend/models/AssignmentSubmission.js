const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    file: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['submitted', 'late', 'reviewed'], default: 'submitted' },
    grade: { type: String },
    feedback: { type: String },
  },
  { timestamps: true }
);

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('AssignmentSubmission', submissionSchema);
