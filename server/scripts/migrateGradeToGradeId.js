const mongoose = require('mongoose');
const Grade = require('../models/Grade');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lich-su-so');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function main() {
  await connectDB();

  const grades = await Grade.find().sort({ order: 1, name: 1 }).lean();
  if (!grades.length) {
    console.log('No grades found');
    process.exit(0);
  }

  const gradeNameMap = new Map(
    grades.map((g) => [String(g.name).trim().toLowerCase(), g._id])
  );

  let count = 0;
  const cursor = User.find().cursor();

  for await (const user of cursor) {
    const raw = user.grade;

    if (raw === undefined || raw === null || raw === '') continue;

    let targetGradeId = null;

    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const mapped = gradeNameMap.get(trimmed.toLowerCase());
      if (!mapped) continue;
      targetGradeId = mapped;
    } else if (raw && typeof raw === 'object' && raw._id) {
      targetGradeId = raw._id;
    }

    if (!targetGradeId) continue;

    const currentStr = (() => {
      try { return user.grade?.toString?.(); } catch (e) { return undefined; }
    })();

    if (currentStr === String(targetGradeId)) continue;

    try {
      user.grade = targetGradeId;
      await user.save();
      console.log('Migrated', user._id, '->', targetGradeId);
      count++;
    } catch (e) {
      console.error('Failed to migrate', user._id, e.message);
    }
  }

  console.log('Done. Updated users:', count);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
