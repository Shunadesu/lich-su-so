const mongoose = require('mongoose');
const Grade = require('../models/Grade');
require('dotenv').config();

const OLD_GRADES = [
  {
    "_id": { "$oid": "694903bedf062d3400c244e7" },
    "name": "Lớp 10",
    "slug": "lop-10",
    "order": 1,
    "createdAt": { "$date": "2025-12-22T08:39:26.744Z" },
    "updatedAt": { "$date": "2025-12-22T10:18:08.905Z" }
  },
  {
    "_id": { "$oid": "694903c1df062d3400c24559" },
    "name": "Lớp 11",
    "slug": "lop-11",
    "order": 2,
    "createdAt": { "$date": "2025-12-22T08:39:29.416Z" },
    "updatedAt": { "$date": "2025-12-22T10:18:13.750Z" }
  },
  {
    "_id": { "$oid": "694903c3df062d3400c245bb" },
    "name": "Lớp 12",
    "slug": "lop-12",
    "order": 3,
    "createdAt": { "$date": "2025-12-22T08:39:31.790Z" },
    "updatedAt": { "$date": "2025-12-22T10:18:18.070Z" }
  },
  {
    "_id": { "$oid": "6949184ddafa276d76abf181" },
    "name": "địa phương",
    "slug": "dia-phuong",
    "order": 3,
    "createdAt": { "$date": "2025-12-22T10:07:09.622Z" },
    "updatedAt": { "$date": "2025-12-22T10:18:01.632Z" }
  }
];

function convertMongoDoc(doc) {
  const converted = { ...doc };
  delete converted._id;

  for (const key in converted) {
    if (converted[key] && typeof converted[key] === 'object') {
      if (converted[key].$date) {
        converted[key] = new Date(converted[key].$date);
      }
    }
  }

  return converted;
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://namp280918_db_user:xTU0jXEh7zqKcc3o@cluster0.yx58qbd.mongodb.net/?appName=Cluster0');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

async function main() {
  try {
    await connectDB();

    const existingCount = await Grade.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Đã có ${existingCount} grades. Xóa trước...`);
      await Grade.deleteMany({});
      console.log('   ✅ Đã xóa');
    }

    const documents = OLD_GRADES.map(convertMongoDoc);
    console.log(`\n📚 Insert ${documents.length} grades...`);

    await Grade.insertMany(documents);

    console.log('\n🎉 Hoàn tất tạo grades!');
    console.log(`Tổng cộng: ${await Grade.countDocuments()} grades`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
