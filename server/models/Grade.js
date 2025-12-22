const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

gradeSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Grade', gradeSchema);

