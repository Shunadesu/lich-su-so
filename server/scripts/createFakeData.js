const mongoose = require('mongoose');
const User = require('../models/User');
const Content = require('../models/Content');
const Grade = require('../models/Grade');
const Topic = require('../models/Topic');
const Section = require('../models/Section');
require('dotenv').config();

// Configuration
const CONFIG = {
  STUDENT_COUNT: 200,
  CONTENT_PER_STUDENT: 3,
  PASSWORD: 'demo123'
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lich-su-so');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Vietnamese name data
const vietnameseFirstNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Trương', 'Bùi', 'Đặng',
  'Ngô', 'Dương', 'Lý', 'Hồ', 'Đỗ', 'Trịnh', 'Vũ', 'Võ', 'Đinh', 'Lương',
  'Phùng', 'Đoàn', 'Lưu', 'Bạch', 'Diệp', 'Châu', 'Tô', 'Hà', 'Kiều', 'Mai'
];

const vietnameseMiddleNames = [
  'Văn', 'Thị', 'Hữu', 'Đức', 'Minh', 'Hoài', 'Quang', 'Phương', 'Lan',
  'Hải', 'Nam', 'Thảo', 'Mai', 'Ly', 'Kim', 'Thu', 'Hương', 'Anh',
  'Trung', 'Công', 'Thanh', 'Xuân', 'Ngọc', 'Thúy', 'Bích', 'Loan', 'Oanh', 'Tuyết'
];

const vietnameseLastNames = [
  'Nam', 'Hùng', 'Hoàng', 'Huy', 'Khánh', 'Long', 'Minh', 'Phú', 'Quân', 'Sơn',
  'Thắng', 'Thanh', 'Tiến', 'Trung', 'Việt', 'An', 'Bảo', 'Cường', 'Dũng', 'Duy',
  'Đạt', 'Hiếu', 'Khang', 'Khoa', 'Lâm', 'Lộc', 'Lực', 'Nghĩa', 'Nhân', 'Phong',
  'Phúc', 'Quang', 'Sang', 'Tài', 'Tâm', 'Thành', 'Thịnh', 'Tú', 'Vinh', 'Vũ',
  'Hà', 'Hoa', 'Hồng', 'Lan', 'Liên', 'Linh', 'Mai', 'My', 'Ngọc', 'Nhung',
  'Phương', 'Quỳnh', 'Thảo', 'Thủy', 'Trang', 'Tú', 'Uyên', 'Vy', 'Yến', 'Ánh'
];

// THPT thật tại TP.HCM
const hcmcHighSchools = [
  'THPT Gia Định',
  'THPT Nguyễn Thị Minh Khai',
  'THPT Lê Quý Đôn',
  'THPT Nguyễn Trãi',
  'THPT Phan Đăng Lưu',
  'THPT Hùng Vương',
  'THPT Võ Thị Sáu',
  'THPT Nguyễn Huệ',
  'THPT Nguyễn Du',
  'THPT Chu Văn An',
  'THPT Lý Tự Trọng',
  'THPT Trần Hưng Đạo',
  'THPT Bạch Đằng',
  'THPT Ngô Quyền',
  'THPT Hai Bà Trưng',
  'THPT Nguyễn Bỉnh Khiêm',
  'THPT Võ Văn Kiệt',
  'THPT Trần Phú',
  'THPT Hồ Chí Minh',
  'THPT Nguyễn Chí Thanh',
  'THPT Lê Hồng Phong',
  'THPT Nguyễn Thị Định',
  'THPT Trần Đại Nghĩa',
  'THPT Nguyễn Văn Cừ',
  'THPT Nguyễn Văn Linh',
  'THPT Lê Văn Việt',
  'THPT Nguyễn Hữu Cảnh',
  'THPT Trường Chinh',
  'THPT Nguyễn Văn Trỗi',
  'THPT Phạm Hùng'
];

// Content titles
const contentTitles = [
  'Bài tập ôn tập lịch sử',
  'Tìm hiểu về các sự kiện lịch sử',
  'Phiếu học tập môn Lịch sử',
  'Đề cương ôn thi',
  'Ghi chép bài giảng',
  'Tóm tắt chương trình',
  'Câu hỏi trắc nghiệm',
  'Bài thực hành',
  'Sơ đồ tư duy',
  'Tư liệu lịch sử',
  'Phân tích sự kiện',
  'So sánh các thời kỳ',
  'Tìm hiểu nhân vật lịch sử',
  'Nguồn sử liệu',
  'Bài tập nhóm',
  'Slide bài giảng',
  'Video bài học',
  'Đọc hiểu tài liệu',
  'Viết đoạn văn nghị luận',
  'Phân tích bản đồ'
];

const contentDescriptions = [
  'Tài liệu học tập dành cho học sinh',
  'Bài tập được biên soạn theo chương trình mới',
  'Ôn tập kiến thức lịch sử cơ bản',
  'Tài liệu tham khảo hữu ích',
  'Nội dung phù hợp với chương trình GDPT 2018',
  'Bài học được thiết kế sinh động',
  'Tài liệu ôn thi học kỳ',
  'Bài tập nâng cao'
];

const youtubeUrls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  'https://www.youtube.com/watch?v=JGwWNGJdvx8',
  'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
  'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  'https://www.youtube.com/watch?v=lXMskKTw3Bc',
  'https://www.youtube.com/watch?v=DgPaCWJL7XI',
  'https://www.youtube.com/watch?v=e-ORhEE9VVg',
  'https://www.youtube.com/watch?v=YQHsXMglC9A',
  'https://www.youtube.com/watch?v=hT_nvWreIhg'
];

const fileNames = [
  'Bai_tap_Lich_su.pdf',
  'De_cuong_on_thi.pptx',
  'Tai_lieu_tham_khao.docx',
  'Phieu_bai_tap.pdf',
  'So_do_tu_duy.png',
  'Video_bai_giang.mp4',
  'Hinh_anh_tu_lieu.jpg',
  'Bai_kiem_tra.docx'
];

const tags = [
  ['lịch sử', 'ôn tập'],
  ['lớp 10', 'lịch sử Việt Nam'],
  ['lớp 11', 'cách mạng'],
  ['lớp 12', 'chiến tranh'],
  ['đề thi', 'trắc nghiệm'],
  ['tài liệu', 'giáo dục'],
  ['SGK', 'chương trình mới'],
  ['sử Việt Nam', 'lịch sử thế giới']
];

// Helper functions
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function generateVietnameseName(index) {
  const firstName = getRandomItem(vietnameseFirstNames);
  const middleName = getRandomItem(vietnameseMiddleNames);
  const lastName = getRandomItem(vietnameseLastNames);
  return `${firstName} ${middleName} ${lastName}`;
}

function generatePhone(index) {
  const prefixes = ['03', '05', '07', '08', '09'];
  const prefix = getRandomItem(prefixes);
  const number = String(index).padStart(8, '0');
  return `${prefix}${number}`;
}

function generateEmail(fullName) {
  const parts = fullName.trim().split(' ');
  const last = parts[parts.length - 1];
  const first = parts[0];
  
  const emailFormats = [
    `${removeAccents(last)}${removeAccents(first)}@gmail.com`,
    `${removeAccents(last)}.${removeAccents(first)}@gmail.com`,
    `${removeAccents(first)}${removeAccents(last)}@gmail.com`,
    `${removeAccents(last)}${getRandomInt(10, 99)}@gmail.com`,
  ];
  
  return getRandomItem(emailFormats);
}

// Load taxonomy data
async function loadTaxonomy() {
  const grades = await Grade.find().lean();
  const topics = await Topic.find().lean();
  const sections = await Section.find().lean();
  
  const topicsByGrade = {};
  for (const topic of topics) {
    const gradeId = topic.grade.toString();
    if (!topicsByGrade[gradeId]) {
      topicsByGrade[gradeId] = [];
    }
    topicsByGrade[gradeId].push(topic);
  }
  
  const sectionsByTopic = {};
  for (const section of sections) {
    const topicId = section.topic.toString();
    if (!sectionsByTopic[topicId]) {
      sectionsByTopic[topicId] = [];
    }
    sectionsByTopic[topicId].push(section);
  }
  
  return { grades, topicsByGrade, sectionsByTopic };
}

// Create fake students
async function createFakeStudents(count) {
  console.log(`\n📝 Creating ${count} fake students...`);
  
  const students = [];
  const batchSize = 50;
  const usedPhones = new Set();
  const usedEmails = new Set();
  
  let attempts = 0;
  const maxAttempts = count * 3;
  
  while (students.length < count && attempts < maxAttempts) {
    attempts++;
    const grade = getRandomItem(['Lớp 10', 'Lớp 11', 'Lớp 12']);
    const fullName = generateVietnameseName(students.length);
    const school = getRandomItem(hcmcHighSchools);
    
    let phone;
    let phoneAttempts = 0;
    do {
      phone = generatePhone(students.length + phoneAttempts);
      phoneAttempts++;
    } while (usedPhones.has(phone) && phoneAttempts < 100);
    
    if (usedPhones.has(phone)) continue;
    usedPhones.add(phone);
    
    let email = generateEmail(fullName);
    let emailAttempts = 0;
    while (usedEmails.has(email) && emailAttempts < 10) {
      email = generateEmail(fullName + emailAttempts);
      emailAttempts++;
    }
    
    if (usedEmails.has(email)) continue;
    usedEmails.add(email);
    
    students.push({
      phone,
      password: CONFIG.PASSWORD,
      role: 'student',
      fullName,
      email,
      school,
      grade,
      isActive: true
    });
    
    if (students.length % batchSize === 0) {
      try {
        await User.insertMany(students.slice(-batchSize));
        console.log(`   ✅ Created ${students.length}/${count} students`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`   ⚠️  Skipped duplicates at ${students.length}`);
        } else {
          console.error(`   ❌ Error at ${students.length}:`, error.message);
        }
      }
    }
  }
  
  const createdStudents = await User.find({
    email: { $regex: /@gmail\.com$/ }
  }).select('_id phone fullName grade school').lean();
  
  console.log(`\n✅ Total students created: ${createdStudents.length}`);
  return createdStudents;
}

// Create fake content
async function createFakeContent(students, contentPerStudent, taxonomy) {
  console.log(`\n📚 Creating ${students.length * contentPerStudent} fake content items...`);
  
  const { grades, topicsByGrade, sectionsByTopic } = taxonomy;
  const contents = [];
  let contentIndex = 0;
  
  for (const student of students) {
    const gradeDoc = grades.find(g => g.name === student.grade);
    if (!gradeDoc) continue;
    
    const gradeId = gradeDoc._id;
    const gradeTopics = topicsByGrade[gradeId.toString()] || [];
    
    if (gradeTopics.length === 0) continue;
    
    for (let j = 0; j < contentPerStudent; j++) {
      contentIndex++;
      const isYoutube = Math.random() > 0.5;
      const fileTypes = ['pdf', 'ppt', 'doc', 'mp4', 'jpg', 'png'];
      
      const content = {
        title: `${getRandomItem(contentTitles)} ${student.grade} - Bài ${j + 1}`,
        description: getRandomItem(contentDescriptions),
        category: student.grade,
        subCategory: student.grade,
        contentType: isYoutube ? 'youtube' : 'file',
        fileType: isYoutube ? undefined : getRandomItem(fileTypes),
        fileUrl: isYoutube ? undefined : `https://example.com/uploads/${getRandomItem(fileNames)}`,
        fileName: isYoutube ? undefined : getRandomItem(fileNames),
        fileSize: isYoutube ? undefined : getRandomInt(100000, 5000000),
        youtubeUrl: isYoutube ? getRandomItem(youtubeUrls) : undefined,
        youtubeId: isYoutube ? 'dQw4w9WgXcQ' : undefined,
        grade: gradeId,
        topic: getRandomItem(gradeTopics)._id,
        section: undefined,
        author: student._id,
        tags: getRandomItem(tags),
        isPublic: true,
        downloadCount: getRandomInt(0, 100),
        viewCount: getRandomInt(0, 500),
        isApproved: Math.random() > 0.3,
        bannerImage: undefined
      };
      
      const topic = gradeTopics.find(t => t._id.toString() === content.topic.toString());
      const topicSections = sectionsByTopic[topic?._id.toString()] || [];
      if (topicSections.length > 0) {
        content.section = getRandomItem(topicSections)._id;
      }
      
      contents.push(content);
      
      if (contents.length >= 50) {
        try {
          await Content.insertMany(contents);
          console.log(`   ✅ Created ${contentIndex} content items`);
          contents.length = 0;
        } catch (error) {
          console.error(`   ❌ Error inserting content:`, error.message);
          contents.length = 0;
        }
      }
    }
  }
  
  if (contents.length > 0) {
    try {
      await Content.insertMany(contents);
      console.log(`   ✅ Created remaining content items`);
    } catch (error) {
      console.error(`   ❌ Error inserting remaining content:`, error.message);
    }
  }
  
  console.log(`\n✅ Total content created: ${contentIndex}`);
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting fake data generation...');
    console.log('=' .repeat(50));
    
    await connectDB();
    
    const existingCount = await User.countDocuments({
      email: { $regex: /@gmail\.com$/ }
    });
    
    if (existingCount > 0) {
      console.log(`\n⚠️  Found ${existingCount} existing fake students.`);
      console.log('   Deleting existing fake data first...');
      await Content.deleteMany({
        author: { $in: await User.find({ email: { $regex: /@gmail\.com$/ } }).distinct('_id') }
      });
      await User.deleteMany({ email: { $regex: /@gmail\.com$/ } });
      console.log('   ✅ Existing fake data deleted');
    }
    
    console.log('\n📂 Loading taxonomy data...');
    const taxonomy = await loadTaxonomy();
    console.log(`   Found ${taxonomy.grades.length} grades`);
    
    const students = await createFakeStudents(CONFIG.STUDENT_COUNT);
    await createFakeContent(students, CONFIG.CONTENT_PER_STUDENT, taxonomy);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalContent = await Content.countDocuments();
    const gradeStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$grade', count: { $sum: 1 } } }
    ]);
    
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Total Content: ${totalContent}`);
    console.log('\nStudents by Grade:');
    for (const stat of gradeStats) {
      console.log(`  ${stat._id || 'N/A'}: ${stat.count}`);
    }
    
    console.log('\n🎉 Fake data generation completed!');
    console.log(`\nSample login credentials:`);
    const sampleStudent = await User.findOne({ role: 'student' }).select('phone email school').lean();
    if (sampleStudent) {
      console.log(`  Phone: ${sampleStudent.phone}`);
      console.log(`  Email: ${sampleStudent.email}`);
      console.log(`  School: ${sampleStudent.school}`);
      console.log(`  Password: ${CONFIG.PASSWORD}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
