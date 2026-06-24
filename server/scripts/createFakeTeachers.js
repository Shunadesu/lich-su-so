const mongoose = require('mongoose');
const User = require('../models/User');
const Grade = require('../models/Grade');
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

const fakeTeachers = [
  { phone: '0901000001', fullName: 'Lê Văn Lài', email: 'lv.lai@gv.edu.vn', school: 'Trường THPT Trần Văn Hoài' },
  { phone: '0901000002', fullName: 'Đào Kim Thanh', email: 'dk.thanh@gv.edu.vn', school: 'Trường THPT Trần Văn Hoài' },
  { phone: '0901000003', fullName: 'Phan Thị Kim Ngân', email: 'ptk.ngan@gv.edu.vn', school: 'Trường THPT Trần Văn Hoài' },
  { phone: '0901000004', fullName: 'Nguyễn Công Hậu', email: 'nc.hau@gv.edu.vn', school: 'Trường THPT Tân Hiệp' },
  { phone: '0901000005', fullName: 'Lê Trung Hậu', email: 'lt.hau@gv.edu.vn', school: 'Trường THPT Tân Hiệp' },
  { phone: '0901000006', fullName: 'Phạm Châu Toàn', email: 'pc.toan@gv.edu.vn', school: 'Trường THPT Tân Hiệp' },
  { phone: '0901000007', fullName: 'Lê Thị Trang', email: 'lt.trang@gv.edu.vn', school: 'Trường THPT Tân Hiệp' },
  { phone: '0901000008', fullName: 'Nguyễn Ánh Hồng', email: 'na.hong@gv.edu.vn', school: 'Trường THPT Chợ Gạo' },
  { phone: '0901000009', fullName: 'Đào Công Sơn', email: 'dc.son@gv.edu.vn', school: 'Trường THPT Chợ Gạo' },
  { phone: '0901000010', fullName: 'Nguyễn Hoàng Kha', email: 'nh.kha@gv.edu.vn', school: 'Trường THPT Chợ Gạo' },
  { phone: '0901000011', fullName: 'Huỳnh Thanh Phương', email: 'ht.phuong@gv.edu.vn', school: 'Trường THPT Chợ Gạo' },
  { phone: '0901000012', fullName: 'Nguyễn Thị Kiều Diễm', email: 'ntk.diem@gv.edu.vn', school: 'Trường THPT Nam Kỳ Khởi Nghĩa' },
  { phone: '0901000013', fullName: 'Đỗ Kim Huệ', email: 'dk.hue@gv.edu.vn', school: 'Trường THPT Nam Kỳ Khởi Nghĩa' },
  { phone: '0901000014', fullName: 'Lê Duy Hựu', email: 'ld.huu@gv.edu.vn', school: 'Trường THPT Nam Kỳ Khởi Nghĩa' },
  { phone: '0901000015', fullName: 'Nguyễn Quốc Thuần', email: 'nq.thuan@gv.edu.vn', school: 'Trường THPT Trần Văn Hoài' },
  { phone: '0901000016', fullName: 'Ngô Quang Triết', email: 'nq.triet@gv.edu.vn', school: 'Trường THPT Chợ Gạo' },
];

async function main() {
  try {
    await connectDB();

    let created = 0;
    let skipped = 0;

    for (const teacher of fakeTeachers) {
      const existing = await User.findOne({ phone: teacher.phone });
      if (existing) {
        console.log(`⏭️  Bỏ qua (đã tồn tại): ${teacher.phone} - ${teacher.fullName}`);
        skipped++;
        continue;
      }

      const newTeacher = new User({
        phone: teacher.phone,
        password: 'teacher123',
        fullName: teacher.fullName,
        role: 'teacher',
        email: teacher.email,
        school: teacher.school,
        isActive: true,
      });

      await newTeacher.save();
      console.log(`✅ Tạo tài khoản giáo viên: ${teacher.fullName}`);
      console.log(`   SĐT: ${teacher.phone}`);
      console.log(`   Mật khẩu: teacher123`);
      console.log(`   Trường: ${teacher.school}\n`);
      created++;
    }

    console.log('--------------------------------------------------');
    console.log(`📊 Tổng kết: Tạo mới ${created} giáo viên, bỏ qua ${skipped} (đã tồn tại).`);
    console.log('--------------------------------------------------');
    console.log('\n🔑 Thông tin đăng nhập giáo viên:');
    console.log('   Tất cả tài khoản đều dùng chung mật khẩu: teacher123');
    console.log('   Đăng nhập bằng số điện thoại từ 0901000001 đến 0901000016');
    console.log('\n🎉 Hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
