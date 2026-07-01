const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  completedLessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  ],
  playbackPositions: [
    {
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
      positionSeconds: {
        type: Number,
        default: 0,
      }
    }
  ],
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
