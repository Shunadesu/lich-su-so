const mongoose = require('mongoose');
const Content = require('../models/Content');
require('dotenv').config();

// Dán toàn bộ JSON documents cũ vào đây
const OLD_CONTENTS = [
  {
    "_id": { "$oid": "694be6e5514aea3f3eeeb408" },
    "title": "Vai trò của sử học",
    "description": "",
    "category": "lop-10",
    "subCategory": "ke-hoach-bai-day",
    "contentType": "file",
    "fileType": "pdf",
    "fileUrl": "https://res.cloudinary.com/dph9wlfzd/raw/upload/v1766581989/lich-su-so/q0wpbpsc5zrxnuf9ueud",
    "fileName": "b2_vtro_cua_su_hoc_su10_ctst.pdf",
    "fileSize": 373681,
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "topic": { "$oid": "694903bfdf062d3400c244f9" },
    "section": { "$oid": "694903bfdf062d3400c24503" },
    "author": { "$oid": "69452b2798426d3cce26142a" },
    "tags": [],
    "isPublic": true,
    "downloadCount": 1,
    "viewCount": 15,
    "isApproved": true,
    "approvedBy": { "$oid": "69452b2798426d3cce26142a" },
    "approvedAt": { "$date": "2025-12-24T13:13:09.858Z" }
  },
  {
    "_id": { "$oid": "69527f0f514aea3f3eeeb4a5" },
    "title": "Đời Sống Của Cư Dân Văn Lang Âu Lạc",
    "description": "",
    "category": "lop-10",
    "subCategory": "video-phim-tu-lieu",
    "contentType": "youtube",
    "youtubeUrl": "https://youtu.be/lkwZ-NQxen0?si=c1fXn9zd6B7Xk8K0",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "topic": { "$oid": "694903c0df062d3400c24539" },
    "section": { "$oid": "694903c0df062d3400c2453d" },
    "author": { "$oid": "69452b2798426d3cce26142a" },
    "tags": [],
    "isPublic": true,
    "downloadCount": 0,
    "viewCount": 10,
    "isApproved": true,
    "approvedBy": { "$oid": "69452b2798426d3cce26142a" },
    "approvedAt": { "$date": "2025-12-29T13:15:59.849Z" }
  },
  {
    "_id": { "$oid": "697858c6514aea3f3eeeb6f5" },
    "title": "Thành tựu của cuộc CÁCH MẠNG CONG NGHIEP 4.0",
    "description": "Cách mạng Công nghiệp 4.0 (CMCN 4.0) là sự bùng nổ của trí tuệ nhân tạo (AI), vạn vật kết nối (IoT), dữ liệu lớn (Big Data), robot tự động và công nghệ sinh học. Đặc trưng bởi sự kết hợp sâu sắc giữa vật lý, kỹ thuật số và sinh học, các thành tựu này tạo ra nhà máy thông minh, tối ưu hóa sản xuất và thay đổi toàn diện cách con người làm việc, sống và kết nối.",
    "category": "lop-10",
    "subCategory": "video-phim-tu-lieu",
    "contentType": "youtube",
    "youtubeUrl": "https://youtu.be/0ZuVWRMvcTA?si=v4zleTf-GKUdc8lU",
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "topic": { "$oid": "694903bfdf062d3400c24519" },
    "section": { "$oid": "694903c0df062d3400c2451d" },
    "author": { "$oid": "69452b2798426d3cce26142a" },
    "tags": [],
    "isPublic": true,
    "downloadCount": 0,
    "viewCount": 1,
    "isApproved": true,
    "approvedBy": { "$oid": "69452b2798426d3cce26142a" },
    "approvedAt": { "$date": "2026-01-27T06:18:46.956Z" },
    "bannerImage": "https://res.cloudinary.com/dph9wlfzd/image/upload/v1769494726/lich-su-so/banners/lpteloh2xj7ajvk2zhkd.jpg"
  },
  {
    "_id": { "$oid": "69785dca514aea3f3eeeb701" },
    "title": "CÁCH MẠNG CÔNG NGHIỆP 4.0",
    "description": "",
    "category": "lop-10",
    "subCategory": "tu-lieu-lich-su-goc",
    "contentType": "file",
    "fileType": "pdf",
    "fileUrl": "https://res.cloudinary.com/dph9wlfzd/raw/upload/v1769496010/lich-su-so/ntuh9tjl5gmnunegqnhq",
    "fileName": "CÁCH MẠNG CÔNG NGHIỆP 4.pdf",
    "fileSize": 108443,
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "topic": { "$oid": "694903bfdf062d3400c24519" },
    "section": { "$oid": "694903bfdf062d3400c2451b" },
    "author": { "$oid": "69452b2798426d3cce26142a" },
    "tags": [],
    "isPublic": true,
    "downloadCount": 0,
    "viewCount": 1,
    "isApproved": true,
    "approvedBy": { "$oid": "69452b2798426d3cce26142a" },
    "approvedAt": { "$date": "2026-01-27T06:40:10.718Z" },
    "bannerImage": "https://res.cloudinary.com/dph9wlfzd/image/upload/v1769496009/lich-su-so/banners/lktlh5w4tekupro8rzso.jpg"
  },
  {
    "_id": { "$oid": "69785fb7514aea3f3eeeb713" },
    "title": "Thanh toán online",
    "description": "Thanh toán online (trực tuyến) là phương thức chuyển tiền không dùng tiền mặt, thực hiện các giao dịch mua sắm, hóa đơn qua Internet, ứng dụng di động hoặc ví điện tử. Quy trình này kết nối tài khoản ngân hàng với cổng thanh toán để hoàn tất giao dịch nhanh chóng, bảo mật cao.",
    "category": "lop-10",
    "subCategory": "hinh-anh",
    "contentType": "file",
    "fileType": "png",
    "fileUrl": "https://res.cloudinary.com/dph9wlfzd/image/upload/v1769496502/lich-su-so/ti84gnavcewjhsr55cn5.jpg",
    "fileName": "6-hinh-thuc-thanh-toan-truc-tuyen-o-viet-nam2.png",
    "fileSize": 77449,
    "grade": { "$oid": "694903bedf062d3400c244e7" },
    "topic": { "$oid": "694903bfdf062d3400c24519" },
    "section": { "$oid": "694903c0df062d3400c24521" },
    "author": { "$oid": "69452b2798426d3cce26142a" },
    "tags": [],
    "isPublic": true,
    "downloadCount": 0,
    "viewCount": 1,
    "isApproved": true,
    "approvedBy": { "$oid": "69452b2798426d3cce26142a" },
    "approvedAt": { "$date": "2026-01-27T06:48:23.815Z" }
  }
];

// Chuyển từ format export MongoDB sang document thật
function convertMongoDoc(doc) {
  const converted = { ...doc };
  
  // Chuyển $oid -> ObjectId
  for (const key in converted) {
    if (converted[key] && typeof converted[key] === 'object') {
      if (converted[key].$oid) {
        converted[key] = new mongoose.Types.ObjectId(converted[key].$oid);
      } else if (converted[key].$date) {
        converted[key] = new Date(converted[key].$date);
      }
    }
  }
  
  // Bỏ _id nếu muốn MongoDB tự tạo mới, giữ lại nếu muốn giữ nguyên ID cũ
  // converted._id = new mongoose.Types.ObjectId(doc._id.$oid);
  
  return converted;
}

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
    
    // Kiểm tra xem đã có data chưa
    const existingCount = await Content.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Đã có ${existingCount} contents trong database.`);
      console.log('   Xóa trước khi restore...');
      await Content.deleteMany({});
      console.log('   ✅ Đã xóa hết contents cũ');
    }
    
    // Convert và insert
    const documents = OLD_CONTENTS.map(convertMongoDoc);
    
    console.log(`\n📚 Đang insert ${documents.length} contents...`);
    
    for (let i = 0; i < documents.length; i++) {
      try {
        await Content.create(documents[i]);
        console.log(`   ✅ [${i + 1}/${documents.length}] "${documents[i].title}"`);
      } catch (error) {
        console.error(`   ❌ [${i + 1}] Lỗi:`, error.message);
      }
    }
    
    console.log('\n🎉 Hoàn tất restore contents!');
    console.log(`\n📊 Tổng cộng: ${await Content.countDocuments()} contents trong database`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
