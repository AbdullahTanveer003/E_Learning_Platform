const express = require('express');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// Create course (teacher only)
router.post('/', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    
    const course = new Course({
      title,
      description,
      category,
      price,
      teacher: req.userId,
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all published courses (with optional search & category filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    const courses = await Course.find(filter).populate('teacher', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get teacher's own courses
router.get('/my-courses', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.userId }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⚠️ IMPORTANT: /enrolled/me MUST be before /:id so Express doesn't treat 'enrolled' as a course ID
// Import Enrollment model at top scope
const Enrollment = require('../models/Enrollment');

// Get student's enrolled courses (student only)
router.get('/enrolled/me', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.userId })
      .populate({
        path: 'course',
        populate: { path: 'teacher', select: 'name' }
      })
      .lean();

    // Manually fetch sections and lessons for each course
    for (let i = 0; i < enrollments.length; i++) {
      if (enrollments[i].course) {
        const sections = await Section.find({ course: enrollments[i].course._id }).sort({ order: 1 }).lean();
        for (let j = 0; j < sections.length; j++) {
          const lessons = await Lesson.find({ section: sections[j]._id }).sort({ order: 1 }).lean();
          sections[j].lessons = lessons;
        }
        enrollments[i].course.sections = sections;
      }
    }

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name').lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    // Fetch sections for this course (field name is 'course' in Section model)
    const sections = await Section.find({ course: course._id }).sort({ order: 1 }).lean();
    
    // Fetch lessons for each section (field name is 'section' in Lesson model)
    for (let i = 0; i < sections.length; i++) {
      const lessons = await Lesson.find({ section: sections[i]._id }).sort({ order: 1 }).lean();
      sections[i].lessons = lessons;
    }
    
    course.sections = sections;
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course (teacher only) — only whitelisted fields allowed
router.put('/:id', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // ✅ Whitelist: only allow safe fields to be updated
    const allowedFields = ['title', 'description', 'category', 'price', 'status', 'thumbnail'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a course and all its sections + lessons (teacher only)
router.delete('/:id', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Cascade delete: sections → lessons
    const sections = await Section.find({ course: course._id });
    for (const section of sections) {
      await Lesson.deleteMany({ section: section._id });
    }
    await Section.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course and all its content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a section and its lessons (teacher only)
router.delete('/:courseId/sections/:sectionId', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Lesson.deleteMany({ section: req.params.sectionId });
    await Section.findByIdAndDelete(req.params.sectionId);

    res.json({ message: 'Section and its lessons deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a single lesson (teacher only)
router.delete('/sections/:sectionId/lessons/:lessonId', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const course = await Course.findById(section.course);
    if (!course || course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a section for a course (teacher only)
router.post('/:id/sections', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const section = new Section({
      course: req.params.id,
      title: req.body.title,
      order: req.body.order || 0
    });
    
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a lesson for a section (teacher only)
router.post('/sections/:sectionId/lessons', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });
    
    // 'course' is the field name in Section model
    const course = await Course.findById(section.course);
    if (!course || course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Get count of existing lessons for ordering
    const lessonCount = await Lesson.countDocuments({ section: req.params.sectionId });
    
    const lesson = new Lesson({
      section: req.params.sectionId,
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      duration: req.body.duration || 0,
      order: req.body.order !== undefined ? req.body.order : lessonCount
    });
    
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in a course (student only)
router.post('/:id/enroll', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.userId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });

    await enrollment.save();
    res.status(201).json({ message: 'Successfully enrolled in course', enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Save or update video playback position
router.post('/enrolled/:id/playback', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const { lessonId, positionSeconds } = req.body;
    const enrollment = await Enrollment.findOne({ _id: req.params.id, student: req.userId });
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment record not found' });
    }

    const positionIndex = enrollment.playbackPositions.findIndex(
      pos => pos.lessonId.toString() === lessonId
    );

    if (positionIndex > -1) {
      enrollment.playbackPositions[positionIndex].positionSeconds = positionSeconds;
    } else {
      enrollment.playbackPositions.push({ lessonId, positionSeconds });
    }

    await enrollment.save();
    res.json({ message: 'Playback position saved', playbackPositions: enrollment.playbackPositions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark lesson as completed and recalculate course progress percentage
router.post('/enrolled/:id/lessons/:lessonId/complete', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: req.params.id, student: req.userId })
      .populate({
        path: 'course',
        populate: {
          path: 'sections',
          populate: { path: 'lessons' }
        }
      });
      
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment record not found' });
    }

    const lessonId = req.params.lessonId;

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Calculate total lessons in this course
    let totalLessonsCount = 0;
    for (const section of enrollment.course.sections) {
      totalLessonsCount += section.lessons.length;
    }

    if (totalLessonsCount > 0) {
      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100);
    } else {
      enrollment.progress = 0;
    }

    await enrollment.save();
    res.json({ 
      message: 'Lesson marked as completed', 
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
