const mongoose = require('mongoose');
const Content = require('../models/Content');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Topic = require('../models/Topic');
const Section = require('../models/Section');
require('dotenv').config();

// Cấu trúc subCategory giống dữ liệu thật bạn đưa
const SUBCATEGORIES = [
  'ke-hoach-bai-day',
  'video-phim-tu-lieu',
  'hinh-anh',
  'tu-lieu-lich-su-goc',
  'bai-giang-dien-tu',
  'bai-kiem-tra'
];

const CONTENT_TYPES = ['file', 'youtube'];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lich-su-so');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const TITLE_TEMPLATES = [
  'Vai trò của sử học',
  'Đời sống của cư dân Văn Lang - Âu Lạc',
  'Cách mạng công nghiệp 4.0',
  'Thành tựu của cuộc cách mạng công nghiệp 4.0',
  'Hình thức thanh toán trực tuyến ở Việt Nam',
  'Bài giảng điện tử: Nhà nước phong kiến',
  'Đề kiểm tra 15 phút lịch sử 10',
  'Kế hoạch bài dạy chương trình mới',
  'Tư liệu lịch sử gốc về chiến tranh',
  'Phim tư liệu về lịch sử Việt Nam',
  'Hình ảnh tư liệu thời Lý - Trần',
  'Bài tập nhóm về cách mạng công nghiệp',
  'Đọc hiểu tài liệu lịch sử',
  'Tóm tắt chương 4 sử 10',
  'Câu hỏi trắc nghiệm lịch sử',
  'Slide bài giảng kết cấu bài',
  'Đề cương ôn thi giữa kỳ',
  'Sơ đồ tư duy chủ đề lịch sử'
];

const DESCRIPTIONS = [
  '',
  '',
  'Nội dung ôn tập theo chương trình GDPT 2018.',
  'Tài liệu được biên soạn bởi giáo viên phụ trách bộ môn.',
  'Sử dụng cho bài giảng, phân nhóm, thảo luận và kiểm tra đôi.',
  'Tư liệu gốc được sưu tầm, biên soạn phù hợp với yêu cầu kiến thức và năng lực.',
  'Hình ảnh minh họa thuộc bộ tư liệu lịch sử được dùng trong giờ học.'
];

const SAMPLE_FILE_NAMES = [
  'b2_vtro_cua_su_hoc_su10_ctst.pdf',
  'ke_hoach_bai_day_chuong_moi.docx',
  'bai_giang_dien_tu_11.pdf',
  'de_kiem_tra_trai_diem_lich_su_10.docx',
  'hinh_anh_tu_lieu_dinh_son_that.jpg',
  'so_do_tu_duy_nha_phong_kiem.png',
  'phim_tu_lieu_lich_su_viet_nam.mp4',
  'CÁCH MẠNG CÔNG NGHIỆP 4.pdf'
];

const SAMPLE_YOUTUBE_URLS = [
  'https://youtu.be/lkwZ-NQxen0',
  'https://youtu.be/0ZuVWRMvcTA',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  'https://www.youtube.com/watch?v=JGwWNGJdvx8'
];

async function getSeedData() {
  const grades = await Grade.find().lean();
  const topics = await Topic.find().lean();
  const sections = await Section.find().lean();
  const teacher = await User.findOne({ role: 'teacher' }).lean();

  const topicsByGrade = {};
  for (const topic of topics) {
    const gradeId = topic.grade.toString();
    if (!topicsByGrade[gradeId]) topicsByGrade[gradeId] = [];
    topicsByGrade[gradeId].push(topic);
  }

  const sectionsByTopic = {};
  for (const section of sections) {
    const topicId = section.topic.toString();
    if (!sectionsByTopic[topicId]) sectionsByTopic[topicId] = [];
    sectionsByTopic[topicId].push(section);
  }

  return { grades, topicsByGrade, sectionsByTopic, teacher };
}

function buildContentDoc({ grade, topic, section, teacher }, index) {
  const contentType = getRandomItem(CONTENT_TYPES);
  const subCategory = getRandomItem(SUBCATEGORIES);
  const gradeDoc = grade;
  const gradeId = gradeDoc._id;
  const gradeTopics = topicsByGrade[gradeId.toString()] || [];

  const base = {
    category: 'lop-10',
    subCategory,
    contentType,
    isPublic: true,
    downloadCount: getRandomInt(0, 20),
    viewCount: getRandomInt(5, 80),
    isApproved: true,
    approvedBy: teacher._id,
    approvedAt: new Date(),
    author: teacher._id,
    tags: []
  };

  const title = getRandomItem(TITLE_TEMPLATES);
  const description = getRandomItem(DESCRIPTIONS);

  if (contentType === 'youtube') {
    const rawUrl = getRandomItem(SAMPLE_YOUTUBE_URLS);
    const match = rawUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return {
      ...base,
      title: `${title}${getRandomInt(1, 5) > 2 ? '' : ` ${getRandomInt(1, 9)}`}`,
      description,
      grade: gradeId,
      topic: topic._id,
      section: section._id,
      youtubeUrl: rawUrl,
      youtubeId: match ? match[1] : undefined
    };
  }

  const fileName = getRandomItem(SAMPLE_FILE_NAMES);
  const fileType = fileName.split('.').pop();
  const fileSize = getRandomInt(20000, 900000);

  const doc = {
    ...base,
    title,
    description,
    grade: gradeId,
    topic: topic._id,
    section: section._id,
    fileType,
    fileName,
    fileUrl: `https://example.com/uploads/${fileName}`,
    fileSize
  };

  // Một số content có bannerImage, giống dữ liệu thật
  if (getRandomInt(0, 100) < 40) {
    doc.bannerImage = `https://res.cloudinary.com/dph9wlfzd/image/upload/v1769${getRandomInt(1000, 9999)}/lich-su-so/banners/${slugify(title)}-${getRandomInt(100, 999)}.jpg`;
  }

  return doc;
}

async function main() {
  try {
    await connectDB();
    const { grades, topicsByGrade, sectionsByTopic, teacher } = await getSeedData();

    if (!grades.length) {
      console.log('❌ Không tìm thấy Grade. Hãy chạy seed taxonomy trước.');
      process.exit(1);
    }

    const contents = [];
    for (const grade of grades) {
      const gradeTopics = topicsByGrade[grade._id.toString()] || [];
      if (!gradeTopics.length) continue;

      for (const topic of gradeTopics) {
        const topicSections = sectionsByTopic[topic._id.toString()] || [];
        if (!topicSections.length) continue;

        for (const section of topicSections) {
          const count = getRandomInt(3, 6);
          for (let i = 0; i < count; i++) {
            contents.push(buildContentDoc({ grade, topic, section, teacher }, i));
          }
        }
      }
    }

    console.log(`\n📚 Chuẩn bị insert ${contents.length} contents...`);
    await Content.deleteMany({});

    const batchSize = 50;
    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize);
      await Content.insertMany(batch);
      console.log(`   ✅ Inserted ${Math.min(i + batchSize, contents.length)}/${contents.length}`);
    }

    console.log('\n🎉 Hoàn tất tạo dữ liệu content.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
