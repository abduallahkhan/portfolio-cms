const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

// GET /api/activities — get recent 20 activities
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
