const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Danh mục là bắt buộc'],
    enum: ['lich-su-10', 'lich-su-11', 'lich-su-12', 'lich-su-dia-phuong']
  },
  subCategory: {
    type: String,
    required: [true, 'Thư mục con là bắt buộc'],
    enum: [
      'bai-giang-dien-tu',
      'ke-hoach-bai-day', 
      'tu-lieu-lich-su-goc',
      'video',
      'hinh-anh',
      'bai-kiem-tra',
      'on-thi-tnthpt',
      'san-pham-hoc-tap'
    ]
  },
  fileType: {
    type: String,
    required: [true, 'Loại file là bắt buộc'],
    enum: ['pdf', 'ppt', 'doc', 'mp4', 'jpg', 'png', 'txt', 'other']
  },
  fileUrl: {
    type: String,
    required: [true, 'Đường dẫn file là bắt buộc']
  },
  fileName: {
    type: String,
    required: [true, 'Tên file là bắt buộc']
  },
  fileSize: {
    type: Number,
    required: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tác giả là bắt buộc']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  approvedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Index for better search performance
contentSchema.index({ category: 1, subCategory: 1 });
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
contentSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema); 