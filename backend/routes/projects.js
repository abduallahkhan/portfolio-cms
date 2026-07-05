const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Multer setup for project images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/projects';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `project_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/projects — get all with search & filter
router.get('/', auth, async (req, res) => {
  try {
    const { search, category, technology, status } = req.query;
    let query = { user: req.user.id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (technology) query.technologies = { $in: [new RegExp(technology, 'i')] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/projects/:id — single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/projects — create project
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, category, liveUrl, githubUrl, status, featured } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required' });

    const project = new Project({
      user: req.user.id,
      title,
      description,
      technologies: technologies ? JSON.parse(technologies) : [],
      category,
      liveUrl,
      githubUrl,
      status,
      featured: featured === 'true',
      image: req.file ? `/${req.file.path}` : ''
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/projects/:id — update project
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.technologies) updates.technologies = JSON.parse(updates.technologies);
    if (req.file) updates.image = `/${req.file.path}`;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/projects/:id — delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
