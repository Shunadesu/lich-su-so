const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, isTeacher } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Lấy danh sách người dùng (Chỉ giáo viên)
// @access  Private
router.get('/', auth, isTeacher, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
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
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + users.length < total,
        hasPrev: page > 1
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
// @desc    Lấy thông tin người dùng
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Users can only view their own profile or teachers can view any profile
    if (req.params.id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xem thông tin người dùng này'
      });
    }
    
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

// @route   PUT /api/users/:id
// @desc    Cập nhật thông tin người dùng
// @access  Private
router.put('/:id', auth, [
  body('fullName').optional().notEmpty().withMessage('Họ tên không được để trống'),
  body('email').optional().isEmail().withMessage('Email không hợp lệ'),
  body('school').optional().notEmpty().withMessage('Trường học không được để trống'),
  body('grade').optional().notEmpty().withMessage('Lớp không được để trống')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Users can only update their own profile or teachers can update any profile
    if (req.params.id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật thông tin người dùng này'
      });
    }
    
    const { fullName, email, school, grade } = req.body;
    const updateData = {};
    
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (school) updateData.school = school;
    if (grade) updateData.grade = grade;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: user
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   PUT /api/users/:id/password
// @desc    Đổi mật khẩu
// @access  Private
router.put('/:id/password', auth, [
  body('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Users can only change their own password
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền đổi mật khẩu của người dùng khác'
      });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }
    
    // Update password
    user.password = newPassword;
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

// @route   PUT /api/users/:id/status
// @desc    Thay đổi trạng thái người dùng (Chỉ giáo viên)
// @access  Private
router.put('/:id/status', auth, isTeacher, [
  body('isActive').isBoolean().withMessage('Trạng thái không hợp lệ')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    res.json({
      success: true,
      message: `Đã ${isActive ? 'kích hoạt' : 'khóa'} tài khoản thành công`,
      data: user
    });
    
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Xóa người dùng (Chỉ giáo viên)
// @access  Private
router.delete('/:id', auth, isTeacher, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    // Prevent deleting own account
    if (req.params.id === req.user.id) {
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