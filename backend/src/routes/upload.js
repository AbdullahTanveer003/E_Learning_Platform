const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// --- Shared memory storage ---
const storage = multer.memoryStorage();

// --- Video uploader (150MB, video/* only) ---
const videoUpload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// --- Image uploader (10MB, image/* only) ---
const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST /api/upload/video
router.post('/video', authMiddleware, roleMiddleware(['teacher', 'admin']), videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'elearning_videos',
            resource_type: 'video',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadStream();

    res.status(200).json({
      message: 'Video uploaded successfully',
      url: result.secure_url,
      duration: Math.round(result.duration / 60 || 0),
      public_id: result.public_id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/thumbnail
router.post('/thumbnail', authMiddleware, roleMiddleware(['teacher', 'admin']), imageUpload.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'elearning_thumbnails',
            resource_type: 'image',
            transformation: [
              { width: 800, height: 450, crop: 'fill', gravity: 'auto' },
              { quality: 'auto', fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadStream();

    res.status(200).json({
      message: 'Thumbnail uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

