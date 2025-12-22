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
    trim: true
  },
  subCategory: {
    type: String,
    required: [true, 'Thư mục con là bắt buộc'],
    trim: true
  },
  contentType: {
    type: String,
    required: [true, 'Loại nội dung là bắt buộc'],
    enum: ['file', 'youtube'],
    default: 'file'
  },
  fileType: {
    type: String,
    required: function() {
      return this.contentType === 'file';
    },
    enum: ['pdf', 'ppt', 'doc', 'mp4', 'jpg', 'png', 'txt', 'other']
  },
  fileUrl: {
    type: String,
    required: function() {
      return this.contentType === 'file';
    }
  },
  fileName: {
    type: String,
    required: function() {
      return this.contentType === 'file';
    }
  },
  fileSize: {
    type: Number,
    required: false
  },
  youtubeUrl: {
    type: String,
    required: function() {
      return this.contentType === 'youtube';
    },
    validate: {
      validator: function(v) {
        if (this.contentType === 'youtube') {
          const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          return youtubeRegex.test(v);
        }
        return true;
      },
      message: 'Link YouTube không hợp lệ'
    }
  },
  youtubeId: {
    type: String,
    required: false
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade',
    required: false
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: false
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
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
  },
  bannerImage: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to extract YouTube ID
contentSchema.pre('save', function(next) {
  if (this.contentType === 'youtube' && this.youtubeUrl) {
    // Extract YouTube ID from URL
    const match = this.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) {
      this.youtubeId = match[1];
    }
  }
  next();
});

// Index for better search performance
contentSchema.index({ category: 1, subCategory: 1 });
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
contentSchema.index({ author: 1, createdAt: -1 });
contentSchema.index({ contentType: 1 });
contentSchema.index({ youtubeId: 1 });
contentSchema.index({ grade: 1, topic: 1, section: 1 });

module.exports = mongoose.model('Content', contentSchema); 