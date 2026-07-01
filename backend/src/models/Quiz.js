const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correct: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
