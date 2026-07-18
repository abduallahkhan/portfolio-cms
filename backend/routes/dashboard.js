const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Dashboard stats for user:', userId);

    const [totalProjects, totalSkills, completedProjects, inProgressProjects, recentProjects] = 
    await Promise.all([
      Project.countDocuments({ user: userId }),
      Skill.countDocuments({ user: userId }),
      Project.countDocuments({ user: userId, status: 'Completed' }),
      Project.countDocuments({ user: userId, status: 'In Progress' }),
      Project.find({ user: userId }).sort({ createdAt: -1 }).limit(5).select('title category status createdAt')
    ]);

    console.log('Total projects found:', totalProjects);
    console.log('Total skills found:', totalSkills);

    res.json({
      totalProjects,
      totalSkills,
      completedProjects,
      inProgressProjects,
      categoryCounts: [],
      skillCategories: [],
      recentProjects
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;