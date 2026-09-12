const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    audience: {
      type: String,
      enum: ['all', 'students', 'teachers', 'class', 'public'],
      default: 'all',
    },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
