const mongoose = require('mongoose');
const Topic = require('../models/Topic');
require('dotenv').config();

const OLD_TOPICS = [
  {
    "_id": { "$oid": "694903bedf062d3400c244e9" },
    "name": "Chủ đề 1: Lịch sử và Sử học",
    "slug": "chu-de-1-lich-su-va-su-hoc",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 1,
    "createdAt": { "$date": "2025-12-22T08:39:26.797Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:22.299Z" }
  },
  {
    "_id": { "$oid": "694903bfdf062d3400c244f9" },
    "name": "Chủ đề 2: Vai trò của Sử học",
    "slug": "chu-de-2-vai-tro-cua-su-hoc",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 2,
    "createdAt": { "$date": "2025-12-22T08:39:27.175Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:26.851Z" }
  },
  {
    "_id": { "$oid": "694903bfdf062d3400c24509" },
    "name": "Chủ đề 3: Một số nền văn minh thế giới thời cổ - trung đại",
    "slug": "chu-de-3-van-minh-co-trung-dai",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 3,
    "createdAt": { "$date": "2025-12-22T08:39:27.547Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:30.546Z" }
  },
  {
    "_id": { "$oid": "694903bfdf062d3400c24519" },
    "name": "Chủ đề 4: Các cuộc cách mạng công nghiệp trong lịch sử thế giới",
    "slug": "chu-de-4-cach-mang-cong-nghiep",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 4,
    "createdAt": { "$date": "2025-12-22T08:39:27.923Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:34.834Z" }
  },
  {
    "_id": { "$oid": "694903c0df062d3400c24529" },
    "name": "Chủ đề 5: Văn minh Đông Nam Á thời cổ - trung đại",
    "slug": "chu-de-5-van-minh-dong-nam-a",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 5,
    "createdAt": { "$date": "2025-12-22T08:39:28.297Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:37.685Z" }
  },
  {
    "_id": { "$oid": "694903c0df062d3400c24539" },
    "name": "Chủ đề 6: Một số nền văn minh trên đất nước Việt Nam (trước năm 1858)",
    "slug": "chu-de-6-van-minh-viet-nam-truoc-1858",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 6,
    "createdAt": { "$date": "2025-12-22T08:39:28.669Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:41.242Z" }
  },
  {
    "_id": { "$oid": "694903c1df062d3400c24549" },
    "name": "Chủ đề 7: Cộng đồng các dân tộc Việt Nam",
    "slug": "chu-de-7-cong-dong-cac-dan-toc-viet-nam",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 7,
    "createdAt": { "$date": "2025-12-22T08:39:29.043Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:45.423Z" }
  },
  {
    "_id": { "$oid": "694903c1df062d3400c2455b" },
    "name": "Chủ đề 1: Cách mạng tư sản và sự phát triển của chủ nghĩa tư bản",
    "slug": "chu-de-1-cach-mang-tu-san",
    "grade": { "$oid": "694903c1df062d3400c24559" },
    "order": 0,
    "createdAt": { "$date": "2025-12-22T08:39:29.464Z" },
    "updatedAt": { "$date": "2025-12-22T08:39:29.464Z" }
  },
  {
    "_id": { "$oid": "694903c1df062d3400c2456b" },
    "name": "Chủ đề 2: Chủ nghĩa xã hội từ năm 1917 đến nay",
    "slug": "chu-de-2-chu-nghia-xa-hoi-1917-den-nay",
    "grade": { "$oid": "694903c1df062d3400c24559" },
    "order": 1,
    "createdAt": { "$date": "2025-12-22T08:39:29.839Z" },
    "updatedAt": { "$date": "2025-12-22T08:39:29.839Z" }
  },
  {
    "_id": { "$oid": "694903c2df062d3400c2457b" },
    "name": "Chủ đề 3: Quá trình giành độc lập của các quốc gia Đông Nam Á",
    "slug": "chu-de-3-doc-lap-dong-nam-a",
    "grade": { "$oid": "694903c1df062d3400c24559" },
    "order": 2,
    "createdAt": { "$date": "2025-12-22T08:39:30.259Z" },
    "updatedAt": { "$date": "2025-12-22T08:39:30.259Z" }
  },
  {
    "_id": { "$oid": "694903c2df062d3400c2458b" },
    "name": "Chủ đề 4: Chiến tranh bảo vệ Tổ quốc và chiến tranh giải phóng dân tộc trong lịch sử Việt Nam (trước CMTT 1945)",
    "slug": "chu-de-4-chien-tranh-bao-ve-to-quoc-truoc-1945",
    "grade": { "$oid": "694903c1df062d3400c24559" },
    "order": 3,
    "createdAt": { "$date": "2025-12-22T08:39:30.632Z" },
    "updatedAt": { "$date": "2025-12-22T08:39:30.632Z" }
  },
  {
    "_id": { "$oid": "694903c3df062d3400c2459b" },
    "name": "Chủ đề 5: Một số cuộc cải cách lớn trong lịch sử Việt Nam (trước năm 1858)",
    "slug": "chu-de-5-cai-cach-lon-truoc-1858",
    "grade": { "$oid": "694903c1df062d3400c24559" },
    "order": 4,
    "createdAt": { "$date": "2025-12-22T08:39:31.010Z" },
    "updatedAt": { "$date": "2025-12-22T08:39:31.010Z" }
  },
  {
    "_id": { "$oid": "694903c3df062d3400c245ab" },
    "name": "Chủ đề 6: Lịch sử bảo vệ chủ quyền, quyền và lợi ích hợp pháp của Việt Nam ở Biển Đông",
    "slug": "chu-de-6-chu-quyen-bien-dong",
    "grade": { "$oid": "694903c1df062d3400c24559" },
    "order": 5,
    "createdAt": { "$date": "2025-12-22T08:39:31.408Z" },
    "updatedAt": { "$date": "2025-12-22T08:39:31.408Z" }
  },
  {
    "_id": { "$oid": "694903c3df062d3400c245bd" },
    "name": "Chủ đề 1: Thế giới trong và sau Chiến tranh Lạnh",
    "slug": "chu-de-1-the-gioi-trong-va-sau-ctl",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 1,
    "createdAt": { "$date": "2025-12-22T08:39:31.837Z" },
    "updatedAt": { "$date": "2025-12-23T08:14:56.036Z" }
  },
  {
    "_id": { "$oid": "694903c4df062d3400c245cd" },
    "name": "Chủ đề 2: ASEAN: Những chặng đường lịch sử",
    "slug": "chu-de-2-asean",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 2,
    "createdAt": { "$date": "2025-12-22T08:39:32.226Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:00.336Z" }
  },
  {
    "_id": { "$oid": "694903c4df062d3400c245dd" },
    "name": "Chủ đề 3: Cách mạng tháng Tám 1945, chiến tranh giải phóng dân tộc và chiến tranh bảo vệ Tổ quốc (từ 8/1945 đến nay)",
    "slug": "chu-de-3-cmt8-va-chien-tranh",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 3,
    "createdAt": { "$date": "2025-12-22T08:39:32.629Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:04.344Z" }
  },
  {
    "_id": { "$oid": "694903c5df062d3400c245ed" },
    "name": "Chủ đề 4: Công cuộc đổi mới ở Việt Nam từ 1986 đến nay",
    "slug": "chu-de-4-doi-moi-1986",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 4,
    "createdAt": { "$date": "2025-12-22T08:39:33.009Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:06.895Z" }
  },
  {
    "_id": { "$oid": "694903c5df062d3400c245fd" },
    "name": "Chủ đề 5: Lịch sử đối ngoại của Việt Nam thời cận - hiện đại",
    "slug": "chu-de-5-lich-su-doi-ngoai",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 5,
    "createdAt": { "$date": "2025-12-22T08:39:33.393Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:09.636Z" }
  },
  {
    "_id": { "$oid": "694903c5df062d3400c2460d" },
    "name": "Chủ đề 6: Hồ Chí Minh trong lịch sử Việt Nam",
    "slug": "chu-de-6-ho-chi-minh",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 6,
    "createdAt": { "$date": "2025-12-22T08:39:33.810Z" },
    "updatedAt": { "$date": "2025-12-23T08:15:13.334Z" }
  },
  {
    "_id": { "$oid": "694a4cdd6744f8a62dc9e0b4" },
    "name": "Sản phẩm học tập",
    "slug": "san-pham-hoc-tap",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 0,
    "createdAt": { "$date": "2025-12-23T08:03:41.988Z" },
    "updatedAt": { "$date": "2025-12-23T08:03:41.988Z" }
  },
  {
    "_id": { "$oid": "694a4f4b4ea632173f16fb11" },
    "name": "Sản phẩm học tập",
    "slug": "san-pham-hoc-tap",
    "grade": { "$oid": "694903c1df062d3400c24559" },
    "order": 0,
    "createdAt": { "$date": "2025-12-23T08:14:03.888Z" },
    "updatedAt": { "$date": "2025-12-23T08:14:03.888Z" }
  },
  {
    "_id": { "$oid": "694a4f6b4ea632173f16fb1d" },
    "name": "Sản phẩm học tập",
    "slug": "san-pham-hoc-tap",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 0,
    "createdAt": { "$date": "2025-12-23T08:14:35.053Z" },
    "updatedAt": { "$date": "2025-12-23T08:14:35.053Z" }
  },
  {
    "_id": { "$oid": "694a9600514aea3f3eeeb2f5" },
    "name": "Bài kiểm tra",
    "slug": "bai-kiem-tra",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "order": 0,
    "createdAt": { "$date": "2025-12-23T13:15:44.293Z" },
    "updatedAt": { "$date": "2025-12-23T13:15:44.293Z" }
  },
  {
    "_id": { "$oid": "694a970c514aea3f3eeeb32e" },
    "name": "Ôn thi tốt nghiệp THPT",
    "slug": "on-thi-tot-nghiep-thpt",
    "grade": { "$oid": "694903c3df062d3400c245bb" },
    "order": 0,
    "createdAt": { "$date": "2025-12-23T13:20:12.155Z" },
    "updatedAt": { "$date": "2025-12-23T13:20:12.155Z" }
  },
  {
    "_id": { "$oid": "6983499f514aea3f3eeeb880" },
    "name": "Chiến thắng Rạch Gầm - Xoài Mút",
    "slug": "chien-thang-rach-gam-xoai-mut",
    "grade": { "$oid": "6949184ddafa276d76abf181" },
    "order": 0,
    "createdAt": { "$date": "2026-02-04T13:29:03.103Z" },
    "updatedAt": { "$date": "2026-02-04T13:29:03.103Z" }
  }
];

function convertMongoDoc(doc) {
  const converted = { ...doc };
  delete converted._id;

  for (const key in converted) {
    if (converted[key] && typeof converted[key] === 'object') {
      if (converted[key].$oid) {
        converted[key] = new mongoose.Types.ObjectId(converted[key].$oid);
      } else if (converted[key].$date) {
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

    const existingCount = await Topic.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Đã có ${existingCount} topics. Xóa trước...`);
      await Topic.deleteMany({});
      console.log('   ✅ Đã xóa');
    }

    const documents = OLD_TOPICS.map(convertMongoDoc);
    console.log(`\n📚 Insert ${documents.length} topics...`);

    await Topic.insertMany(documents);

    console.log('\n🎉 Hoàn tất tạo topics!');
    console.log(`Tổng cộng: ${await Topic.countDocuments()} topics`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
