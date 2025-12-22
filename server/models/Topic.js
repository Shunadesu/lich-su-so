const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

topicSchema.index({ slug: 1 }, { unique: true });
topicSchema.index({ grade: 1, order: 1 });

module.exports = mongoose.model('Topic', topicSchema);

