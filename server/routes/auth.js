const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Đăng ký tài khoản mới
// @access  Public
router.post('/register', [
  body('phone')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('fullName')
    .notEmpty()
    .withMessage('Họ tên là bắt buộc')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { phone, password, fullName, email, school, grade } = req.body;
    
    // Public registration only allows student role
    const role = 'student';

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    // Create new user
    const user = new User({
      phone,
      password,
      fullName,
      role,
      email,
      school,
      grade
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        school: user.school,
        grade: user.grade
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', [
  body('phone')
    .custom((value) => {
      // Allow admin phone or valid Vietnamese phone number
      if (value === '0123456789') {
        return true;
      }
      // Check if it's a valid Vietnamese phone number
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(value)) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      return true;
    })
    .withMessage('Số điện thoại không hợp lệ'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { phone, password } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        school: user.school,
        grade: user.grade
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/auth/create-teacher
// @desc    Tạo tài khoản giáo viên mới (chỉ giáo viên mới tạo được)
// @access  Private (Teacher only)
router.post('/create-teacher', [
  auth,
  body('phone')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('fullName')
    .notEmpty()
    .withMessage('Họ tên là bắt buộc'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('school')
    .notEmpty()
    .withMessage('Trường học là bắt buộc')
], async (req, res) => {
  try {
    // Check if current user is a teacher OR if this is the first teacher account
    const currentUser = await User.findById(req.user.id);
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    
    if (!currentUser || (currentUser.role !== 'teacher' && teacherCount > 0)) {
      return res.status(403).json({
        success: false,
        message: 'Chỉ giáo viên mới có quyền tạo tài khoản giáo viên'
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { phone, password, fullName, email, school } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    // Create new teacher account
    const newTeacher = new User({
      phone,
      password,
      fullName,
      role: 'teacher', // Always set as teacher
      email,
      school,
      isActive: true
    });

    await newTeacher.save();

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản giáo viên thành công',
      teacher: {
        id: newTeacher._id,
        phone: newTeacher.phone,
        fullName: newTeacher.fullName,
        role: newTeacher.role,
        email: newTeacher.email,
        school: newTeacher.school,
        createdAt: newTeacher.createdAt
      }
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/auth/create-first-teacher
// @desc    Tạo tài khoản giáo viên đầu tiên (không cần auth)
// @access  Public (only if no teachers exist)
router.post('/create-first-teacher', [
  body('phone')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('fullName')
    .notEmpty()
    .withMessage('Họ tên là bắt buộc'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('school')
    .notEmpty()
    .withMessage('Trường học là bắt buộc')
], async (req, res) => {
  try {
    // Check if any teacher already exists
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    if (teacherCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Đã có giáo viên trong hệ thống. Chỉ giáo viên mới có quyền tạo tài khoản giáo viên.'
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { phone, password, fullName, email, school } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    // Create first teacher account
    const newTeacher = new User({
      phone,
      password,
      fullName,
      role: 'teacher',
      email,
      school,
      isActive: true
    });

    await newTeacher.save();

    // Generate token
    const token = generateToken(newTeacher._id);

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản giáo viên đầu tiên thành công',
      token,
      teacher: {
        id: newTeacher._id,
        phone: newTeacher.phone,
        fullName: newTeacher.fullName,
        role: newTeacher.role,
        email: newTeacher.email,
        school: newTeacher.school,
        createdAt: newTeacher.createdAt
      }
    });

  } catch (error) {
    console.error('Create first teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router; 