const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  type: {
    type: String,
    enum: ['project', 'skill', 'profile', 'auth'],
    default: 'project'
  },
  icon: { type: String, default: '📝' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
