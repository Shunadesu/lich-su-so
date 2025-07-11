const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const { auth, isTeacher, isStudent } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|ppt|pptx|doc|docx|mp4|jpg|jpeg|png|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Loại file không được hỗ trợ'));
    }
  }
});

// @route   GET /api/content
// @desc    Lấy danh sách nội dung theo category và subCategory
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, search, page = 1, limit = 10, author, authorRole, isApproved } = req.query;
    
    const query = { isPublic: true };
    
    // Only filter by isApproved if explicitly provided, otherwise default to approved content
    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    } else {
      query.isApproved = true; // Default to approved content for public access
    }
    
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (author) query.author = author;
    
    if (search) {
      query.$text = { $search: search };
    }
    
    console.log('Content query:', query);
    console.log('Query params:', { category, subCategory, search, page, limit, author, authorRole });
    
    const skip = (page - 1) * limit;
    
    // First get all contents
    const contents = await Content.find(query)
      .populate('author', 'fullName school role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Filter by author role if specified
    let filteredContents = contents;
    if (authorRole) {
      filteredContents = contents.filter(content => content.author?.role === authorRole);
    }
    
    // Get total count for pagination (without role filter for accurate count)
    const total = await Content.countDocuments(query);
    
    console.log('Found contents:', filteredContents.length, 'Total:', total);
    console.log('Contents:', filteredContents.map(c => ({ id: c._id, title: c.title, category: c.category, authorRole: c.author?.role, isApproved: c.isApproved, isPublic: c.isPublic })));
    
    res.json({
      success: true,
      data: filteredContents,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + filteredContents.length < total,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Get contents error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   GET /api/content/my-content
// @desc    Lấy nội dung của user hiện tại (cho dashboard)
// @access  Private
router.get('/my-content', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const query = { author: req.user.id };
    
    const skip = (page - 1) * limit;
    
    const contents = await Content.find(query)
      .populate('author', 'fullName school')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Content.countDocuments(query);
    
    res.json({
      success: true,
      data: contents,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + contents.length < total,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Get my content error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   GET /api/content/recent-activities
// @desc    Lấy hoạt động gần đây
// @access  Public
router.get('/recent-activities', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    // Lấy nội dung mới nhất
    const recentUploads = await Content.find({ isApproved: true })
      .populate('author', 'fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);
    
    // Lấy nội dung có lượt tải cao nhất gần đây
    const popularDownloads = await Content.find({ isApproved: true })
      .populate('author', 'fullName')
      .sort({ downloadCount: -1, updatedAt: -1 })
      .limit(parseInt(limit) / 2);
    
    // Kết hợp và sắp xếp theo thời gian
    const allActivities = [...recentUploads, ...popularDownloads]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, parseInt(limit));
    
    const activities = allActivities.map(content => ({
      id: content._id,
      type: 'upload',
      title: content.title,
      author: content.author?.fullName || 'Không xác định',
      time: content.createdAt,
      category: content.category,
      subCategory: content.subCategory,
      downloadCount: content.downloadCount,
      viewCount: content.viewCount
    }));
    
    res.json({
      success: true,
      data: activities
    });
    
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   GET /api/content/:id
// @desc    Lấy chi tiết nội dung
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('author', 'fullName school')
      .populate('approvedBy', 'fullName');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    // Increment view count
    content.viewCount += 1;
    await content.save();
    
    res.json({
      success: true,
      data: content
    });
    
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/content/:id/download
// @desc    Tăng lượt tải nội dung
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    // Tăng lượt tải
    content.downloadCount += 1;
    await content.save();
    
    res.json({
      success: true,
      message: 'Đã ghi nhận lượt tải',
      downloadCount: content.downloadCount
    });
    
  } catch (error) {
    console.error('Download count error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/content
// @desc    Tạo nội dung mới (Giáo viên có thể tạo tất cả, học sinh chỉ tạo sản phẩm học tập)
// @access  Private
router.post('/', auth, upload.single('file'), [
  body('title').notEmpty().withMessage('Tiêu đề là bắt buộc'),
  body('category').isIn(['lich-su-10', 'lich-su-11', 'lich-su-12', 'lich-su-dia-phuong'])
    .withMessage('Danh mục không hợp lệ'),
  body('subCategory').custom((value, { req }) => {
    const validSubCategories = {
      'lich-su-10': ['bai-giang-dien-tu', 'ke-hoach-bai-day', 'tu-lieu-lich-su-goc', 'video', 'hinh-anh', 'bai-kiem-tra'],
      'lich-su-11': ['bai-giang-dien-tu', 'ke-hoach-bai-day', 'tu-lieu-lich-su-goc', 'video', 'hinh-anh', 'bai-kiem-tra'],
      'lich-su-12': ['bai-giang-dien-tu', 'ke-hoach-bai-day', 'tu-lieu-lich-su-goc', 'video', 'hinh-anh', 'bai-kiem-tra', 'on-thi-tnthpt'],
      'lich-su-dia-phuong': [
        'tu-lieu-lich-su-goc', 
        'video', 
        'hinh-anh', 
        'san-pham-hoc-tap',
        'tai-lieu-hoc-tap',
        'hinh-anh-hoc-tap',
        'video-hoc-tap',
        'bai-tap-hoc-sinh',
        'du-an-hoc-tap'
      ]
    };
    
    const category = req.body.category;
    const allowedSubCategories = validSubCategories[category] || [];
    
    if (!allowedSubCategories.includes(value)) {
      throw new Error(`Thư mục con không hợp lệ cho danh mục ${category}`);
    }
    return true;
  })
], async (req, res) => {
  try {
    console.log('Content creation request:', {
      body: req.body,
      file: req.file,
      user: req.user
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Check file upload (only required for new content, not for editing)
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'File là bắt buộc khi tạo nội dung mới'
      });
    }
    
    const { title, description, category, subCategory, tags } = req.body;
    
    console.log('Processing content data:', {
      title,
      description,
      category,
      subCategory,
      tags,
      userRole: req.user.role
    });
    
    // Check permissions for students
    if (req.user.role === 'student') {
      const allowedStudentSubCategories = [
        'san-pham-hoc-tap',
        'tai-lieu-hoc-tap',
        'hinh-anh-hoc-tap',
        'video-hoc-tap',
        'bai-tap-hoc-sinh',
        'du-an-hoc-tap'
      ];
      
      if (!allowedStudentSubCategories.includes(subCategory)) {
        console.log('Student trying to upload restricted content type:', subCategory);
        return res.status(403).json({
          success: false,
          message: 'Học sinh chỉ được đăng tải tài liệu học tập, sản phẩm học tập, hình ảnh và video học tập'
        });
      }
    }
    
    // Determine file type
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'other';
    if (['.pdf'].includes(fileExt)) fileType = 'pdf';
    else if (['.ppt', '.pptx'].includes(fileExt)) fileType = 'ppt';
    else if (['.doc', '.docx'].includes(fileExt)) fileType = 'doc';
    else if (['.mp4'].includes(fileExt)) fileType = 'mp4';
    else if (['.jpg', '.jpeg'].includes(fileExt)) fileType = 'jpg';
    else if (['.png'].includes(fileExt)) fileType = 'png';
    else if (['.txt'].includes(fileExt)) fileType = 'txt';
    
    const content = new Content({
      title,
      description,
      category,
      subCategory,
      fileType,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      author: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: true,
      isApproved: req.user.role === 'teacher', // Auto approve for teachers
      approvedBy: req.user.role === 'teacher' ? req.user.id : undefined,
      approvedAt: req.user.role === 'teacher' ? new Date() : undefined
    });
    
    await content.save();
    
    console.log('Content created successfully:', {
      id: content._id,
      title: content.title,
      category: content.category,
      isPublic: content.isPublic,
      isApproved: content.isApproved,
      author: content.author
    });
    
    res.status(201).json({
      success: true,
      message: 'Tạo nội dung thành công',
      data: content
    });
    
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   PUT /api/content/:id
// @desc    Cập nhật nội dung (Chỉ tác giả hoặc giáo viên)
// @access  Private
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    // Check permissions
    if (content.author.toString() !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền chỉnh sửa nội dung này'
      });
    }
    
    const updateData = { ...req.body };
    
    // Handle file upload if provided
    if (req.file) {
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      let fileType = 'other';
      if (['.pdf'].includes(fileExt)) fileType = 'pdf';
      else if (['.ppt', '.pptx'].includes(fileExt)) fileType = 'ppt';
      else if (['.doc', '.docx'].includes(fileExt)) fileType = 'doc';
      else if (['.mp4'].includes(fileExt)) fileType = 'mp4';
      else if (['.jpg', '.jpeg'].includes(fileExt)) fileType = 'jpg';
      else if (['.png'].includes(fileExt)) fileType = 'png';
      else if (['.txt'].includes(fileExt)) fileType = 'txt';
      
      updateData.fileType = fileType;
      updateData.fileUrl = `/uploads/${req.file.filename}`;
      updateData.fileName = req.file.originalname;
      updateData.fileSize = req.file.size;
    }
    
    // Handle tags
    if (req.body.tags) {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('author', 'fullName school');
    
    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: updatedContent
    });
    
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   DELETE /api/content/:id
// @desc    Xóa nội dung (Chỉ tác giả hoặc giáo viên)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    // Check permissions
    if (content.author.toString() !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa nội dung này'
      });
    }
    
    await Content.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Xóa nội dung thành công'
    });
    
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/content/:id/approve
// @desc    Phê duyệt nội dung (Chỉ giáo viên)
// @access  Private
router.post('/:id/approve', auth, isTeacher, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    content.isApproved = true;
    content.approvedBy = req.user.id;
    content.approvedAt = new Date();
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Phê duyệt nội dung thành công',
      data: content
    });
    
  } catch (error) {
    console.error('Approve content error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   POST /api/content/:id/download
// @desc    Tăng số lượt tải
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    content.downloadCount += 1;
    await content.save();
    
    res.json({
      success: true,
      message: 'Cập nhật lượt tải thành công'
    });
    
  } catch (error) {
    console.error('Download count error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @route   GET /api/content/debug/all
// @desc    Debug route - Lấy tất cả nội dung (không filter)
// @access  Public (chỉ cho development)
router.get('/debug/all', async (req, res) => {
  try {
    const allContents = await Content.find({})
      .populate('author', 'fullName school')
      .sort({ createdAt: -1 });
    
    console.log('All contents in database:', allContents.map(c => ({
      id: c._id,
      title: c.title,
      category: c.category,
      isPublic: c.isPublic,
      isApproved: c.isApproved,
      author: c.author?.fullName
    })));
    
    res.json({
      success: true,
      data: allContents,
      count: allContents.length
    });
    
  } catch (error) {
    console.error('Debug all contents error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router; 