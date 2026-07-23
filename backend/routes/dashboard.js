const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const mongoose = require('mongoose');

router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const totalProjects = await Project.countDocuments({ user: userId });
    const totalSkills = await Skill.countDocuments({ user: userId });
    const completedProjects = await Project.countDocuments({ user: userId, status: 'Completed' });
    const inProgressProjects = await Project.countDocuments({ user: userId, status: 'In Progress' });
    
    const categoryCounts = await Project.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const skillCategories = await Skill.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgProficiency: { $avg: '$proficiency' } } },
      { $sort: { count: -1 } }
    ]);

    const recentProjects = await Project.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category status createdAt');

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
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;