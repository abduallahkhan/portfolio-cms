const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const Activity = require('../models/Activity');

// GET /api/categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/categories
router.post('/', auth, async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const category = new Category({ user: req.user.id, name, color, icon, description });
    await category.save();

    await Activity.create({
      user: req.user.id,
      action: `Added new category "${name}"`,
      type: 'project',
      icon: '📁'
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await Activity.create({
      user: req.user.id,
      action: `Updated category "${category.name}"`,
      type: 'project',
      icon: '✏️'
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await Activity.create({
      user: req.user.id,
      action: `Deleted category "${category.name}"`,
      type: 'project',
      icon: '🗑️'
    });

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
