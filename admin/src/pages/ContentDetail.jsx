import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, CheckCircle, Trash2, Download, Eye, Calendar, User, Tag, FileText, School, Clock, CheckCircle2, ExternalLink, Image as ImageIcon, Edit } from 'lucide-react';
import { contentAPI, getFileUrl } from '../services/api';
import toast from 'react-hot-toast';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['content', id],
    () => contentAPI.getById(id)
  );

  const approveMutation = useMutation(
    () => contentAPI.approve(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['content', id]);
        toast.success('Phê duyệt thành công');
      },
    }
  );

  const deleteMutation = useMutation(
    () => contentAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Xóa thành công');
        navigate('/content');
      },
    }
  );

  const getCategoryLabel = (category) => {
    const labels = {
      'lich-su-10': 'Lịch sử 10',
      'lich-su-11': 'Lịch sử 11',
      'lich-su-12': 'Lịch sử 12',
      'lich-su-dia-phuong': 'Lịch sử địa phương'
    };
    return labels[category] || category;
  };

  const getSubCategoryLabel = (subCategory) => {
    const labels = {
      'bai-giang-dien-tu': 'Bài giảng điện tử',
      'sach-dien-tu': 'Sách điện tử',
      'ke-hoach-bai-day': 'Kế hoạch bài dạy',
      'tu-lieu-lich-su-goc': 'Tư liệu lịch sử gốc',
      'tu-lieu-dien-tu': 'Tư liệu điện tử',
      'video': 'Video',
      'hinh-anh': 'Hình ảnh',
      'bai-kiem-tra': 'Bài kiểm tra',
      'on-thi-tnthpt': 'Ôn thi THPT',
      'san-pham-hoc-tap': 'Sản phẩm học tập',
      'tai-lieu-hoc-tap': 'Tài liệu học tập',
      'hinh-anh-hoc-tap': 'Hình ảnh học tập',
      'video-hoc-tap': 'Video học tập',
      'bai-tap-hoc-sinh': 'Bài tập học sinh',
      'du-an-hoc-tap': 'Dự án học tập'
    };
    return labels[subCategory] || subCategory;
  };

  const getFileTypeLabel = (fileType) => {
    const labels = {
      pdf: 'PDF Document', 
      ppt: 'PowerPoint Presentation', 
      doc: 'Word Document', 
      mp4: 'Video File', 
      jpg: 'Image File', 
      png: 'Image File', 
      txt: 'Text File', 
      other: 'Other File'
    };
    return labels[fileType] || 'Unknown File';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isImageFile = (fileType) => {
    return ['jpg', 'png', 'jpeg'].includes(fileType);
  };

  // YouTube embed component
  const YouTubeEmbed = ({ youtubeId }) => {
    if (!youtubeId) return null;
    
    return (
      <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const content = data?.data?.data;

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy nội dung</p>
        <button
          onClick={() => navigate('/content')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/content')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>
        <Link
          to={`/content/${id}/edit`}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Edit className="h-5 w-5" />
          <span>Chỉnh sửa</span>
        </Link>
      </div>

      {/* Banner Image */}
      {content.bannerImage && (
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img 
            src={getFileUrl(content.bannerImage)} 
            alt={content.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        {/* Title and Status */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryLabel(content.category)}
            </span>
            <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {getSubCategoryLabel(content.subCategory)}
            </span>
            {content.isApproved ? (
              <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Đã phê duyệt
              </span>
            ) : (
              <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Chờ phê duyệt
              </span>
            )}
            <span className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {content.contentType === 'youtube' ? 'YouTube Video' : getFileTypeLabel(content.fileType)}
            </span>
          </div>
        </div>

        {/* Description */}
        {content.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Mô tả</h2>
            <div 
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
        )}

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
          {/* Author Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin tác giả</h3>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">
                {typeof content.author === 'object'
                  ? content.author?.fullName || 'Không xác định'
                  : content.author}
              </span>
            </div>
            {content.author?.school && (
              <div className="flex items-center text-sm text-gray-600">
                <School className="h-4 w-4 mr-2 text-gray-500" />
                <span>{content.author.school}</span>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thống kê</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Eye className="h-4 w-4 mr-2 text-gray-500" />
              <span>{content.viewCount || 0} lượt xem</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Download className="h-4 w-4 mr-2 text-gray-500" />
              <span>{content.downloadCount || 0} lượt tải</span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thời gian</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Đăng: {formatDateTime(content.createdAt)}</span>
            </div>
            {content.updatedAt && content.updatedAt !== content.createdAt && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>Cập nhật: {formatDateTime(content.updatedAt)}</span>
              </div>
            )}
          </div>

          {/* Approval Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Phê duyệt</h3>
            {content.isApproved ? (
              <>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span>Đã phê duyệt</span>
                </div>
                {content.approvedAt && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formatDateTime(content.approvedAt)}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center text-sm text-yellow-600">
                <span>Chờ phê duyệt</span>
              </div>
            )}
          </div>

          {/* File Info */}
          {content.contentType === 'file' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin file</h3>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className="truncate">{content.fileName}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Kích thước:</span> {formatFileSize(content.fileSize)}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Loại:</span> {getFileTypeLabel(content.fileType)}
              </div>
            </div>
          )}

          {/* YouTube Info */}
          {content.contentType === 'youtube' && content.youtubeUrl && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin video</h3>
              <div className="flex items-center text-sm text-gray-600">
                <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                <a 
                  href={content.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline truncate"
                >
                  Xem trên YouTube
                </a>
              </div>
              {content.youtubeId && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Video ID:</span> {content.youtubeId}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Thẻ tag</h2>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          {!content.isApproved && (
            <button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isLoading}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Phê duyệt</span>
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn xóa? Hành động này không thể hoàn tác.')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isLoading}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5" />
            <span>Xóa</span>
          </button>
        </div>
      </div>

      {/* Image Preview */}
      {content.contentType === 'file' && isImageFile(content.fileType) && content.fileUrl && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Xem trước hình ảnh</h2>
          <div className="relative w-full max-w-4xl mx-auto">
            <img 
              src={getFileUrl(content.fileUrl)} 
              alt={content.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      )}

      {/* YouTube Video Embed */}
      {content.contentType === 'youtube' && content.youtubeId && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Video</h2>
          <YouTubeEmbed youtubeId={content.youtubeId} />
          {content.youtubeUrl && (
            <div className="mt-4">
              <a 
                href={content.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Mở trên YouTube
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDetail;

