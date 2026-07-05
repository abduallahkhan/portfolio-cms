const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  category: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'Graphic Design', 'Data Analysis', 'Other'],
    default: 'Web Development'
  },
  image: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  status: { type: String, enum: ['Completed', 'In Progress', 'Planned'], default: 'Completed' },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Text index for search
ProjectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
