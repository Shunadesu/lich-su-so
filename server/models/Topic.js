const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Unique per grade to allow cùng slug giữa các lớp
topicSchema.index({ grade: 1, slug: 1 }, { unique: true });
topicSchema.index({ grade: 1, order: 1 });
topicSchema.index({ slug: 1 }); // non-unique helper index

// Drop legacy unique index on slug if it exists (causes duplicate errors across grades)
const dropLegacyUniqueIndex = async () => {
  const collection = mongoose.connection.collections['topics'];
  if (!collection) return;
  try {
    const indexes = await collection.indexes();
    const legacy = indexes.find((idx) => idx.name === 'slug_1' && idx.unique);
    if (legacy) {
      await collection.dropIndex('slug_1');
      // Recreate non-unique helper index
      await collection.createIndex({ slug: 1 });
    }
  } catch (err) {
    // Swallow errors to avoid crashing app; logged for awareness
    console.error('Warning: unable to drop legacy topic slug_1 index:', err.message);
  }
};

if (mongoose.connection.readyState === 1) {
  dropLegacyUniqueIndex();
} else {
  mongoose.connection.on('connected', dropLegacyUniqueIndex);
}

module.exports = mongoose.model('Topic', topicSchema);

