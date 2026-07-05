const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const User = require('../models/User');

// GET /api/preview/:userId — public portfolio preview
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [profile, projects, skills] = await Promise.all([
      Profile.findOne({ user: userId }),
      Project.find({ user: userId }).sort({ createdAt: -1 }),
      Skill.find({ user: userId }).sort({ category: 1, proficiency: -1 })
    ]);

    if (!profile) return res.status(404).json({ message: 'Portfolio not found' });

    res.json({ profile, projects, skills });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
