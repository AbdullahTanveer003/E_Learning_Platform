const express = require('express');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// POST /api/certificates/issue — auto-issue certificate if student has 100% progress
router.post('/issue', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    if (!enrollmentId) {
      return res.status(400).json({ error: 'enrollmentId is required' });
    }

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: req.userId });
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (enrollment.progress < 100) {
      return res.status(400).json({
        error: `Course not yet complete. Current progress: ${enrollment.progress}%`
      });
    }

    // Check if certificate already issued
    const existing = await Certificate.findOne({ student: req.userId, course: enrollment.course });
    if (existing) {
      return res.status(200).json({ message: 'Certificate already issued', certificate: existing });
    }

    // Generate a unique verification code
    const uniqueCode = crypto.randomBytes(12).toString('hex').toUpperCase();

    const certificate = new Certificate({
      student: req.userId,
      course: enrollment.course,
      uniqueCode,
    });

    await certificate.save();
    await certificate.populate([
      { path: 'student', select: 'name email' },
      { path: 'course', select: 'title' },
    ]);

    res.status(201).json({ message: 'Certificate issued successfully!', certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/certificates/my — get all certificates for logged-in student
router.get('/my', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.userId })
      .populate('course', 'title category')
      .populate('student', 'name email')
      .sort({ issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/certificates/verify/:code — public endpoint to verify a certificate by unique code
router.get('/verify/:code', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ uniqueCode: req.params.code })
      .populate('student', 'name')
      .populate('course', 'title category');

    if (!certificate) {
      return res.status(404).json({ valid: false, error: 'Certificate not found or invalid code' });
    }

    res.json({
      valid: true,
      certificate: {
        studentName: certificate.student.name,
        courseTitle: certificate.course.title,
        courseCategory: certificate.course.category,
        issueDate: certificate.issueDate,
        uniqueCode: certificate.uniqueCode,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/certificates/download/:code — generate and stream PDF
router.get('/download/:code', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ uniqueCode: req.params.code })
      .populate('student', 'name')
      .populate('course', 'title');

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Certificate_${certificate.uniqueCode}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f9fafb');

    // Add border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(5)
       .stroke('#3b82f6'); // Tailwind blue-500

    doc.fillColor('#1e40af') // Tailwind blue-800
       .fontSize(40)
       .text('Certificate of Completion', { align: 'center', margin: 50 });

    doc.moveDown();
    doc.fillColor('#374151')
       .fontSize(20)
       .text('This is to certify that', { align: 'center' });

    doc.moveDown();
    doc.fillColor('#111827')
       .fontSize(30)
       .text(certificate.student.name, { align: 'center' });

    doc.moveDown();
    doc.fillColor('#374151')
       .fontSize(20)
       .text('has successfully completed the course', { align: 'center' });

    doc.moveDown();
    doc.fillColor('#1e40af')
       .fontSize(25)
       .text(certificate.course.title, { align: 'center' });

    doc.moveDown(2);
    doc.fillColor('#6b7280')
       .fontSize(14)
       .text(`Issued on: ${new Date(certificate.issueDate).toLocaleDateString()}`, { align: 'center' });
    
    doc.text(`Certificate ID: ${certificate.uniqueCode}`, { align: 'center' });
    
    doc.moveDown();
    doc.text('Verify at: https://yourdomain.com/verify-certificate/' + certificate.uniqueCode, { align: 'center' });

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
