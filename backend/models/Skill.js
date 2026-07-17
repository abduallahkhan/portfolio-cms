const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Mobile', 'Database', 'DevOps', 'Design', 'Other'],
    default: 'Other'
  },
  proficiency: { type: Number, min: 0, max: 100, required: true },
  icon: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', SkillSchema);
