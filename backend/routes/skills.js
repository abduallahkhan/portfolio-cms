const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Skill = require('../models/Skill');
const Activity = require('../models/Activity');

// GET /api/skills
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ category: 1, proficiency: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/skills
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, proficiency, icon } = req.body;
    if (!name || proficiency === undefined)
      return res.status(400).json({ message: 'Name and proficiency are required' });

    const skill = new Skill({ user: req.user.id, name, category, proficiency, icon });
    await skill.save();

    await Activity.create({ user: req.user.id, action: `Added skill "${name}"`, type: 'skill', icon: '💡' });

    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/skills/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    await Activity.create({ user: req.user.id, action: `Updated skill "${skill.name}"`, type: 'skill', icon: '✏️' });

    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/skills/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    await Activity.create({ user: req.user.id, action: `Deleted skill "${skill.name}"`, type: 'skill', icon: '🗑️' });

    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
