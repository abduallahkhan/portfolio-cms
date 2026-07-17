const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// GET /api/dashboard/stats — all stats in one call
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalProjects,
      totalSkills,
      completedProjects,
      inProgressProjects,
      categoryCounts,
      skillCategories,
      recentProjects
    ] = await Promise.all([
      Project.countDocuments({ user: userId }),
      Skill.countDocuments({ user: userId }),
      Project.countDocuments({ user: userId, status: 'Completed' }),
      Project.countDocuments({ user: userId, status: 'In Progress' }),
      Project.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Skill.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
        { $group: { _id: '$category', count: { $sum: 1 }, avgProficiency: { $avg: '$proficiency' } } },
        { $sort: { count: -1 } }
      ]),
      Project.find({ user: userId }).sort({ createdAt: -1 }).limit(5).select('title category status createdAt')
    ]);

    res.json({
      totalProjects,
      totalSkills,
      completedProjects,
      inProgressProjects,
      categoryCounts,
      skillCategories,
      recentProjects
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
