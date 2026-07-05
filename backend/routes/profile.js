const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

// Multer storage for profile image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profiles';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/profile — get my profile
router.get('/', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) profile = await Profile.create({ user: req.user.id });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/profile — update profile info
router.put('/', auth, async (req, res) => {
  try {
    const { name, title, bio, email, phone, location, website, social } = req.body;
    const update = { name, title, bio, email, phone, location, website, social, updatedAt: Date.now() };
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/profile/image — upload profile picture
router.post('/image', auth, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imagePath = `/${req.file.path}`;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { profileImage: imagePath } },
      { new: true, upsert: true }
    );
    res.json({ profileImage: imagePath, profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
