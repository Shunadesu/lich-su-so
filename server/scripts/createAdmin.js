const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

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

// Create admin user
const createAdmin = async () => {
  try {
    await connectDB();

    const adminPhone = '0123456789';
    const adminPassword = 'admin123';
    const adminData = {
      phone: adminPhone,
      password: adminPassword,
      fullName: 'Administrator',
      role: 'teacher',
      email: 'admin@lichsuso.online', // Admin email
      school: 'UBND TỈNH ĐỒNG THÁP - SỞ GIÁO DỤC & ĐÀO TẠO',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ phone: adminPhone });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Updating admin user...');
      
      // Update existing admin
      existingAdmin.password = adminPassword; // Will be hashed by pre-save hook
      existingAdmin.fullName = adminData.fullName;
      existingAdmin.role = adminData.role;
      existingAdmin.email = adminData.email;
      existingAdmin.school = adminData.school;
      existingAdmin.isActive = adminData.isActive;
      
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully!');
      console.log('📱 Phone:', adminPhone);
      console.log('🔑 Password:', adminPassword);
    } else {
      // Create new admin
      const admin = new User(adminData);
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📱 Phone:', adminPhone);
      console.log('🔑 Password:', adminPassword);
    }

    // Display admin info
    const adminUser = await User.findOne({ phone: adminPhone });
    console.log('\n📋 Admin User Info:');
    console.log('   ID:', adminUser._id);
    console.log('   Phone:', adminUser.phone);
    console.log('   Full Name:', adminUser.fullName);
    console.log('   Role:', adminUser.role);
    console.log('   Email:', adminUser.email);
    console.log('   School:', adminUser.school);
    console.log('   Active:', adminUser.isActive);
    console.log('   Created:', adminUser.createdAt);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

// Run script
createAdmin();

