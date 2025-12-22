const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Cho phép cùng slug (ví dụ 'tu-lieu-lich-su-goc') xuất hiện ở nhiều topic khác nhau
// nhưng đảm bảo duy nhất trong 1 topic
sectionSchema.index({ topic: 1, slug: 1 }, { unique: true });
sectionSchema.index({ topic: 1, order: 1 });

module.exports = mongoose.model('Section', sectionSchema);

