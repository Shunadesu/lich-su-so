const mongoose = require('mongoose');
const User = require('../models/User');
const Content = require('../models/Content');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lich-su-so');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

async function main() {
  try {
    await connectDB();

    const fakeStudents = await User.find({ email: { $regex: /@gmail\.com$/ } }).lean();
    const fakeIds = fakeStudents.map(s => s._id);

    if (fakeIds.length === 0) {
      console.log('ℹ️  Không tìm thấy học sinh ảo nào.');
      process.exit(0);
    }

    console.log(`🔎 Tìm thấy ${fakeIds.length} học sinh ảo.`);

    const deleteContentResult = await Content.deleteMany({
      author: { $in: fakeIds }
    });
    console.log(`🗑️  Đã xóa ${deleteContentResult.deletedCount} bài đăng ảo.`);

    console.log('\n🎉 Hoàn tất xóa bài đăng ảo!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
