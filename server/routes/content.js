const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const Grade = require('../models/Grade');
const Topic = require('../models/Topic');
const Section = require('../models/Section');
const { auth, isTeacher, isStudent } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer with Cloudinary storage for content files
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // If it's a banner image, upload to banners folder
    if (file.fieldname === 'bannerImage') {
      return {
        folder: 'lich-su-so/banners',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      };
    }
    
    // Determine resource type based on file extension
    const ext = path.extname(file.originalname).toLowerCase();
    let resourceType = 'auto';
    let allowedFormats = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'mp4', 'jpg', 'jpeg', 'png', 'txt'];
    
    // Office documents (DOC, DOCX, PPT, PPTX) should be uploaded as raw files
    if (['.doc', '.docx', '.ppt', '.pptx'].includes(ext)) {
      resourceType = 'raw';
      allowedFormats = ['doc', 'docx', 'ppt', 'pptx'];
    } else if (['.pdf', '.txt'].includes(ext)) {
      resourceType = 'raw';
      allowedFormats = ['pdf', 'txt'];
    } else if (['.mp4'].includes(ext)) {
      resourceType = 'video';
      allowedFormats = ['mp4'];
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      resourceType = 'image';
      allowedFormats = ['jpg', 'jpeg', 'png'];
    }
    
    // Upload to main folder
    return {
      folder: 'lich-su-so',
      allowed_formats: allowedFormats,
      resource_type: resourceType,
      transformation: resourceType === 'image' ? [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ] : undefined
    };
  }
});

// Multer config for content files
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Banner images
    if (file.fieldname === 'bannerImage') {
      if (file.mimetype.startsWith('image/')) {
        return cb(null, true);
      } else {
        return cb(new Error('Banner phải là file ảnh (JPG, PNG, WEBP)'));
      }
    }
    
    // Content files - check by extension first, then mimetype
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.mp4', '.jpg', '.jpeg', '.png', '.txt'];
    
    // Allowed mimetypes for Office documents and other files
    const allowedMimetypes = [
      // PDF
      'application/pdf',
      // PowerPoint
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Word
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Video
      'video/mp4',
      'video/mpeg',
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      // Text
      'text/plain'
    ];
    
    const extname = allowedExtensions.includes(ext);
    const mimetype = allowedMimetypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      console.error('File upload rejected:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        extension: ext,
        extname,
        mimetypeMatch: mimetype
      });
      cb(new Error(`Loại file không được hỗ trợ. File: ${file.originalname}, MIME type: ${file.mimetype}`));
    }
  }
});

// Multer config for banner images (only images)
const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lich-su-so/banners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

const uploadBanner = multer({
  storage: bannerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('image/');
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)'));
    }
  }
});

// Helper function to delete file from Cloudinary
const deleteCloudinaryFile = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    
    let publicId = fileUrl;
    let resourceType = 'auto'; // Let Cloudinary auto-detect
    
    // Check if it's a full Cloudinary URL
    if (fileUrl.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
      // Or: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{public_id}
      const urlMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      
      if (urlMatch && urlMatch[1]) {
        publicId = urlMatch[1];
        
        // Determine resource type from URL
        if (fileUrl.includes('/video/')) {
          resourceType = 'video';
        } else if (fileUrl.includes('/raw/')) {
          resourceType = 'raw';
        } else if (fileUrl.match(/\.(pdf|doc|docx|ppt|pptx|txt)$/i)) {
          resourceType = 'raw';
        } else {
          resourceType = 'image';
        }
      } else {
        console.warn('Could not extract public_id from URL:', fileUrl);
        return;
      }
    } else {
      // Assume it's already a public_id (from multer-storage-cloudinary)
      // Try to determine resource type from file extension if it's in the public_id
      if (publicId.match(/\.(pdf|doc|docx|ppt|pptx|txt)$/i)) {
        resourceType = 'raw';
      } else if (publicId.match(/\.(mp4|mov|avi)$/i)) {
        resourceType = 'video';
      }
    }
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    // Don't throw error, just log it - we don't want to fail the request if Cloudinary delete fails
  }
};

// @route   GET /api/content
// @desc    Lấy danh sách nội dung theo category và subCategory
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, gradeId, topicId, sectionId, search, page = 1, limit = 10, author, authorRole, isApproved } = req.query;
    
    const query = { isPublic: true };
    
    // Only filter by isApproved if explicitly provided, otherwise default to approved content
    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    } else {
      query.isApproved = true; // Default to approved content for public access
    }
    
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (gradeId) query.grade = gradeId;
    if (topicId) query.topic = topicId;
    if (sectionId) query.section = sectionId;
    if (author) query.author = author;
    
    if (search) {
      query.$text = { $search: search };
    }
    
    
    const skip = (page - 1) * limit;
    
    // First get all contents
    const contents = await Content.find(query)
      .populate('author', 'fullName school role')
      .populate('grade')
      .populate('topic')
      .populate('section')
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
      .populate('grade')
      .populate('topic')
      .populate('section')
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
    const recentUploads = await Content.find({ isApproved: true, isPublic: true })
      .populate('author', 'fullName school role')
      .populate('approvedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);
    
    // Lấy nội dung có lượt tải cao nhất gần đây
    const popularDownloads = await Content.find({ isApproved: true, isPublic: true })
      .populate('author', 'fullName school role')
      .populate('approvedBy', 'fullName')
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
      description: content.description || '',
      category: content.category,
      subCategory: content.subCategory,
      contentType: content.contentType, // 'file' or 'youtube'
      fileType: content.fileType || null,
      fileUrl: content.fileUrl || null,
      fileName: content.fileName || null,
      fileSize: content.fileSize || null,
      youtubeUrl: content.youtubeUrl || null,
      youtubeId: content.youtubeId || null,
      bannerImage: content.bannerImage || null, // Add bannerImage
      tags: content.tags || [],
      author: {
        id: content.author?._id || null,
        fullName: content.author?.fullName || 'Không xác định',
        school: content.author?.school || null,
        role: content.author?.role || null
      },
      approvedBy: content.approvedBy ? {
        id: content.approvedBy._id,
        fullName: content.approvedBy.fullName
      } : null,
      isApproved: content.isApproved,
      isPublic: content.isPublic,
      downloadCount: content.downloadCount || 0,
      viewCount: content.viewCount || 0,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      approvedAt: content.approvedAt || null
    }));
    
    res.json({
      success: true,
      data: activities,
      count: activities.length
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
      .populate('approvedBy', 'fullName')
      .populate('grade')
      .populate('topic')
      .populate('section');
    
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
// Middleware to handle both file and banner uploads
const uploadContent = (req, res, next) => {
  // Use fields to handle both file and banner
  const uploadMiddleware = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 }
  ]);
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // If banner image is uploaded, move it to banner folder
    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      try {
        const bannerFile = req.files.bannerImage[0];
        // Banner is already uploaded to Cloudinary, just use the URL
        // We'll store it as-is, Cloudinary folder structure is just for organization
        req.bannerImageUrl = bannerFile.path; // This is the Cloudinary URL
      } catch (bannerError) {
        console.error('Banner upload error:', bannerError);
        // Continue without banner if upload fails
      }
    }
    
    next();
  });
};

router.post('/', auth, uploadContent, [
  body('title').notEmpty().withMessage('Tiêu đề là bắt buộc'),
  body('gradeId').notEmpty().withMessage('Lớp là bắt buộc'),
  body('topicId').notEmpty().withMessage('Chủ đề là bắt buộc'),
  body('sectionId').notEmpty().withMessage('Mục là bắt buộc'),
  body('contentType').isIn(['file', 'youtube']).withMessage('Loại nội dung không hợp lệ'),
  body('youtubeUrl').optional().isURL().withMessage('Link YouTube không hợp lệ')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { title, description, gradeId, topicId, sectionId, tags, contentType, youtubeUrl } = req.body;

    // Validate taxonomy relationships
    const grade = await Grade.findById(gradeId);
    if (!grade) {
      return res.status(400).json({ success: false, message: 'Lớp không hợp lệ' });
    }

    const topic = await Topic.findOne({ _id: topicId, grade: gradeId });
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Chủ đề không hợp lệ hoặc không thuộc lớp đã chọn' });
    }

    const section = await Section.findOne({ _id: sectionId, topic: topicId });
    if (!section) {
      return res.status(400).json({ success: false, message: 'Mục không hợp lệ hoặc không thuộc chủ đề đã chọn' });
    }

    // Validate content type specific requirements
    const contentFile = req.files && req.files.file ? req.files.file[0] : null;
    
    if (contentType === 'file') {
      if (!contentFile) {
        return res.status(400).json({
          success: false,
          message: 'File là bắt buộc khi chọn loại nội dung là file'
        });
      }
    } else if (contentType === 'youtube') {
      if (!youtubeUrl) {
        return res.status(400).json({
          success: false,
          message: 'Link YouTube là bắt buộc khi chọn loại nội dung là YouTube'
        });
      }
      
      // Validate YouTube URL format
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      if (!youtubeRegex.test(youtubeUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Link YouTube không hợp lệ'
        });
      }
    }
    
    
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
      
      if (!allowedStudentSubCategories.includes(section.slug)) {
        return res.status(403).json({
          success: false,
          message: 'Học sinh chỉ được đăng tải tài liệu học tập, sản phẩm học tập, hình ảnh và video học tập'
        });
      }
    }
    
    const contentData = {
      title,
      description,
      grade: grade._id,
      topic: topic._id,
      section: section._id,
      category: grade.slug, // legacy fields for compatibility
      subCategory: section.slug,
      contentType,
      author: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: true,
      isApproved: req.user.role === 'teacher', // Auto approve for teachers
      approvedBy: req.user.role === 'teacher' ? req.user.id : undefined,
      approvedAt: req.user.role === 'teacher' ? new Date() : undefined
    };

    // Handle banner image
    if (req.bannerImageUrl) {
      contentData.bannerImage = req.bannerImageUrl;
    }
    
    // Add content type specific data
    if (contentType === 'file') {
      // Determine file type
      const fileExt = path.extname(contentFile.originalname).toLowerCase();
      let fileType = 'other';
      if (['.pdf'].includes(fileExt)) fileType = 'pdf';
      else if (['.ppt', '.pptx'].includes(fileExt)) fileType = 'ppt';
      else if (['.doc', '.docx'].includes(fileExt)) fileType = 'doc';
      else if (['.mp4'].includes(fileExt)) fileType = 'mp4';
      else if (['.jpg', '.jpeg'].includes(fileExt)) fileType = 'jpg';
      else if (['.png'].includes(fileExt)) fileType = 'png';
      else if (['.txt'].includes(fileExt)) fileType = 'txt';
      
      contentData.fileType = fileType;
      contentData.fileUrl = contentFile.path; // Cloudinary URL
      contentData.fileName = contentFile.originalname;
      contentData.fileSize = contentFile.size;
    } else if (contentType === 'youtube') {
      contentData.youtubeUrl = youtubeUrl;
      // YouTube ID will be extracted by pre-save middleware
    }
    
    const content = new Content(contentData);
    
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
// Middleware for PUT route to handle file and banner uploads
const updateContentUpload = (req, res, next) => {
  const uploadMiddleware = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 }
  ]);
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // If banner image is uploaded, use the uploaded URL
    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      req.bannerImageUrl = req.files.bannerImage[0].path; // Cloudinary URL
    }
    
    next();
  });
};

router.put('/:id', auth, updateContentUpload, async (req, res) => {
  try {
    console.log('=== UPDATE CONTENT REQUEST ===');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Banner Image URL:', req.bannerImageUrl);
    console.log('User:', req.user?.id);

    // Find content
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
    
    // Determine new contentType
    const newContentType = req.body.contentType || content.contentType;
    const oldContentType = content.contentType;
    const isChangingContentType = req.body.contentType && req.body.contentType !== oldContentType;
    
    console.log('Content type change:', {
      old: oldContentType,
      new: newContentType,
      isChanging: isChangingContentType
    });
    
    // Build update object
    const updateData = {};
    
    // Update basic fields
    if (req.body.title !== undefined && req.body.title !== '') {
      updateData.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description || '';
    }

    // Update taxonomy (require all three ids if changing)
    const { gradeId, topicId, sectionId } = req.body;
    if (gradeId || topicId || sectionId) {
      if (!gradeId || !topicId || !sectionId) {
        return res.status(400).json({ success: false, message: 'Cần đủ gradeId, topicId, sectionId khi thay đổi danh mục' });
      }

      const grade = await Grade.findById(gradeId);
      if (!grade) return res.status(400).json({ success: false, message: 'Lớp không hợp lệ' });

      const topic = await Topic.findOne({ _id: topicId, grade: gradeId });
      if (!topic) return res.status(400).json({ success: false, message: 'Chủ đề không hợp lệ hoặc không thuộc lớp đã chọn' });

      const section = await Section.findOne({ _id: sectionId, topic: topicId });
      if (!section) return res.status(400).json({ success: false, message: 'Mục không hợp lệ hoặc không thuộc chủ đề đã chọn' });

      updateData.grade = grade._id;
      updateData.topic = topic._id;
      updateData.section = section._id;
      updateData.category = grade.slug;
      updateData.subCategory = section.slug;

      if (req.user.role === 'student') {
        const allowedStudentSubCategories = [
          'san-pham-hoc-tap',
          'tai-lieu-hoc-tap',
          'hinh-anh-hoc-tap',
          'video-hoc-tap',
          'bai-tap-hoc-sinh',
          'du-an-hoc-tap'
        ];
        if (!allowedStudentSubCategories.includes(section.slug)) {
          return res.status(403).json({
            success: false,
            message: 'Học sinh chỉ được cập nhật vào các mục học tập được phép'
          });
        }
      }
    }
    
    // Handle content type change - delete old files first
    if (isChangingContentType) {
      // If switching to YouTube, delete old file from Cloudinary
      if (newContentType === 'youtube' && oldContentType === 'file' && content.fileUrl) {
        try {
          await deleteCloudinaryFile(content.fileUrl);
          console.log('Deleted old file from Cloudinary');
        } catch (deleteError) {
          console.error('Error deleting old file:', deleteError);
        }
        // Clear file fields
        updateData.fileUrl = null;
        updateData.fileName = null;
        updateData.fileType = null;
        updateData.fileSize = null;
      }
      
      // If switching to file, clear YouTube data
      if (newContentType === 'file' && oldContentType === 'youtube') {
        updateData.youtubeUrl = null;
        updateData.youtubeId = null;
      }
      
      updateData.contentType = newContentType;
    }
    
    // Handle banner image update
    if (req.bannerImageUrl) {
      // Delete old banner if exists
      if (content.bannerImage) {
        try {
          await deleteCloudinaryFile(content.bannerImage);
        } catch (deleteError) {
          console.error('Error deleting old banner:', deleteError);
        }
      }
      updateData.bannerImage = req.bannerImageUrl;
    }

    // Handle file upload
    const contentFile = req.files && req.files.file ? req.files.file[0] : null;
    if (contentFile) {
      // Delete old file from Cloudinary if exists
      if (oldContentType === 'file' && content.fileUrl) {
        try {
          await deleteCloudinaryFile(content.fileUrl);
          console.log('Deleted old file from Cloudinary');
        } catch (deleteError) {
          console.error('Error deleting old file:', deleteError);
        }
      }
      
      const fileExt = path.extname(contentFile.originalname).toLowerCase();
      let fileType = 'other';
      if (['.pdf'].includes(fileExt)) fileType = 'pdf';
      else if (['.ppt', '.pptx'].includes(fileExt)) fileType = 'ppt';
      else if (['.doc', '.docx'].includes(fileExt)) fileType = 'doc';
      else if (['.mp4'].includes(fileExt)) fileType = 'mp4';
      else if (['.jpg', '.jpeg'].includes(fileExt)) fileType = 'jpg';
      else if (['.png'].includes(fileExt)) fileType = 'png';
      else if (['.txt'].includes(fileExt)) fileType = 'txt';
      
      updateData.fileType = fileType;
      updateData.fileUrl = contentFile.path; // Cloudinary URL
      updateData.fileName = contentFile.originalname;
      updateData.fileSize = contentFile.size;
      updateData.contentType = 'file'; // Ensure contentType is set to file
      
      // Clear YouTube fields if switching from YouTube
      if (oldContentType === 'youtube') {
        updateData.youtubeUrl = null;
        updateData.youtubeId = null;
      }
    }
    
    // Handle YouTube URL
    if (newContentType === 'youtube') {
      if (req.body.youtubeUrl) {
        // Extract YouTube ID (more flexible regex to handle query strings)
        const youtubeIdMatch = req.body.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        
        let youtubeId = null;
        if (youtubeIdMatch && youtubeIdMatch[1]) {
          youtubeId = youtubeIdMatch[1];
        } else {
          // Fallback: try to extract any 11-character alphanumeric string
          const fallbackMatch = req.body.youtubeUrl.match(/([a-zA-Z0-9_-]{11})/);
          if (fallbackMatch && fallbackMatch[1]) {
            youtubeId = fallbackMatch[1];
          }
        }
        
        if (!youtubeId) {
          return res.status(400).json({
            success: false,
            message: 'Không thể trích xuất ID từ link YouTube. Vui lòng kiểm tra lại link.'
          });
        }
        
        updateData.youtubeUrl = req.body.youtubeUrl;
        updateData.youtubeId = youtubeId;
        updateData.contentType = 'youtube';
        
        // Clear file fields if switching from file
        if (oldContentType === 'file') {
          updateData.fileUrl = null;
          updateData.fileName = null;
          updateData.fileType = null;
          updateData.fileSize = null;
        }
      } else if (oldContentType === 'youtube' && content.youtubeUrl) {
        // Keep existing YouTube URL if not provided and content is already YouTube
        // Don't update YouTube fields
      } else if (isChangingContentType && newContentType === 'youtube') {
        // Switching to YouTube but no URL provided
        return res.status(400).json({
          success: false,
          message: 'Link YouTube là bắt buộc khi chọn loại nội dung là YouTube'
        });
      }
    }
    
    // Handle tags
    if (req.body.tags !== undefined) {
      if (req.body.tags && req.body.tags.trim()) {
        updateData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else {
        updateData.tags = [];
      }
    }
    
    // Determine final contentType
    const finalContentType = updateData.contentType || content.contentType;
    
    // Apply updates directly to the document
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null) {
        // Delete field from document
        delete content[key];
      } else {
        content[key] = updateData[key];
      }
    });
    
    // Ensure required fields are set and unnecessary fields are cleared based on contentType
    if (finalContentType === 'file') {
      // Ensure file fields are set
      if (!content.fileUrl || !content.fileName || !content.fileType) {
        return res.status(400).json({
          success: false,
          message: 'Khi loại nội dung là file, cần có fileUrl, fileName và fileType'
        });
      }
      // Clear YouTube fields completely
      delete content.youtubeUrl;
      delete content.youtubeId;
    } else if (finalContentType === 'youtube') {
      // Ensure YouTube fields are set
      if (!content.youtubeUrl || !content.youtubeId) {
        return res.status(400).json({
          success: false,
          message: 'Khi loại nội dung là YouTube, cần có youtubeUrl và youtubeId'
        });
      }
      // Clear file fields completely
      delete content.fileUrl;
      delete content.fileName;
      delete content.fileType;
      delete content.fileSize;
    }
    
    // Save the document (this will trigger validation)
    const updatedContent = await content.save();
    
    // Populate author
    await updatedContent.populate('author', 'fullName school');
    
    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: updatedContent
    });
    
  } catch (error) {
    console.error('=== UPDATE CONTENT ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      console.error('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Lỗi validation',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    
    // Delete file from Cloudinary if content has a file
    if (content.contentType === 'file' && content.fileUrl) {
      await deleteCloudinaryFile(content.fileUrl);
    }
    
    // Delete content from database
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