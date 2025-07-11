const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, teacherAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Lấy danh sách tất cả người dùng (chỉ giáo viên)
// @access  Private (Teacher only)
router.get('/', [auth, teacherAuth], async (req, res) => {
  try {
    const { search, role, isActive, page = 1, limit = 50 } = req.query;
    
    // Build query
    let query = {};
    
    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }
    
    // Filter by status
    if (isActive !== undefined && isActive !== 'all') {
      query.isActive = isActive === 'true' || isActive === true;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Lấy thông tin người dùng theo ID (chỉ giáo viên)
// @access  Private (Teacher only)
router.get('/:id', [auth, teacherAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/users
// @desc    Tạo người dùng mới (chỉ giáo viên)
// @access  Private (Teacher only)
router.post('/', [
  auth,
  teacherAuth,
  body('phone')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('fullName')
    .notEmpty()
    .withMessage('Họ tên là bắt buộc'),
  body('role')
    .isIn(['teacher', 'student'])
    .withMessage('Vai trò không hợp lệ')
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

    const { phone, password, fullName, role, email, school, grade, isActive = true } = req.body;

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
      grade,
      isActive
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Tạo người dùng thành công',
      data: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        school: user.school,
        grade: user.grade,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Cập nhật thông tin người dùng (chỉ giáo viên)
// @access  Private (Teacher only)
router.put('/:id', [
  auth,
  teacherAuth,
  body('fullName')
    .notEmpty()
    .withMessage('Họ tên là bắt buộc'),
  body('role')
    .isIn(['teacher', 'student'])
    .withMessage('Vai trò không hợp lệ')
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

    const { fullName, role, email, school, grade, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Update user
    user.fullName = fullName;
    user.role = role;
    user.email = email;
    user.school = school;
    user.grade = grade;
    user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật người dùng thành công',
      data: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        school: user.school,
        grade: user.grade,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Cập nhật trạng thái người dùng (chỉ giáo viên)
// @access  Private (Teacher only)
router.put('/:id/status', [auth, teacherAuth], async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Prevent deactivating own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Không thể khóa tài khoản của chính mình'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `Đã ${isActive ? 'kích hoạt' : 'khóa'} người dùng thành công`,
      data: {
        id: user._id,
        fullName: user.fullName,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   PUT /api/users/:id/password
// @desc    Đổi mật khẩu người dùng (chỉ giáo viên)
// @access  Private (Teacher only)
router.put('/:id/password', [
  auth,
  teacherAuth,
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
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

    const { password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    user.password = password;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Xóa người dùng (chỉ giáo viên)
// @access  Private (Teacher only)
router.delete('/:id', [auth, teacherAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản của chính mình'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Xóa người dùng thành công'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router; 