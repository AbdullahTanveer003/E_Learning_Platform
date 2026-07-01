const express = require('express');
const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Section = require('../models/Section');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// Helper: verify teacher owns the lesson's parent course
async function verifyTeacherOwnsLesson(lessonId, userId) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return { error: 'Lesson not found', status: 404 };
  const section = await Section.findById(lesson.section);
  if (!section) return { error: 'Section not found', status: 404 };
  const course = await Course.findById(section.course);
  if (!course) return { error: 'Course not found', status: 404 };
  if (course.teacher.toString() !== userId) return { error: 'Not authorized', status: 403 };
  return { ok: true };
}

// POST /api/quizzes  — create a quiz for a lesson (teacher only)
router.post('/', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const { lessonId, title, questions } = req.body;
    if (!lessonId || !title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'lessonId, title, and questions array are required' });
    }

    const check = await verifyTeacherOwnsLesson(lessonId, req.userId);
    if (check.error) return res.status(check.status).json({ error: check.error });

    // Validate question structure
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || q.correct === undefined) {
        return res.status(400).json({
          error: 'Each question must have: question (string), options (array, min 2), correct (index number)'
        });
      }
    }

    const existing = await Quiz.findOne({ lesson: lessonId });
    if (existing) {
      return res.status(400).json({ error: 'A quiz already exists for this lesson. Use PUT to update it.' });
    }

    const quiz = new Quiz({ lesson: lessonId, title, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/quizzes/lesson/:lessonId — get quiz for a lesson
router.get('/lesson/:lessonId', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
    if (!quiz) return res.status(404).json({ error: 'No quiz found for this lesson' });

    // If student, hide correct answers
    if (req.userRole === 'student') {
      const safeQuiz = {
        _id: quiz._id,
        lesson: quiz.lesson,
        title: quiz.title,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          // correct is intentionally omitted for students
        })),
      };
      return res.json(safeQuiz);
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/quizzes/:id — update a quiz (teacher only)
router.put('/:id', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const check = await verifyTeacherOwnsLesson(quiz.lesson.toString(), req.userId);
    if (check.error) return res.status(check.status).json({ error: check.error });

    if (req.body.title) quiz.title = req.body.title;
    if (req.body.questions && Array.isArray(req.body.questions)) {
      quiz.questions = req.body.questions;
    }

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/quizzes/:id — delete a quiz (teacher only)
router.delete('/:id', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const check = await verifyTeacherOwnsLesson(quiz.lesson.toString(), req.userId);
    if (check.error) return res.status(check.status).json({ error: check.error });

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/quizzes/:id/submit — student submits answers, gets scored
router.post('/:id/submit', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const { answers } = req.body; // expected: [{ questionIndex: 0, answer: 2 }, ...]
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers array is required' });
    }

    let correct = 0;
    const results = quiz.questions.map((q, index) => {
      const studentAnswer = answers.find(a => a.questionIndex === index);
      const isCorrect = studentAnswer && studentAnswer.answer === q.correct;
      if (isCorrect) correct++;
      return {
        question: q.question,
        yourAnswer: studentAnswer ? studentAnswer.answer : null,
        correctAnswer: q.correct,
        isCorrect: !!isCorrect,
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= 70; // pass threshold: 70%

    res.json({
      score,
      passed,
      correctCount: correct,
      totalQuestions: quiz.questions.length,
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
