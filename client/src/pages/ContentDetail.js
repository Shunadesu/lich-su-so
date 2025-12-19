import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { ArrowLeft, Download, Eye, Calendar, User, Tag, FileText, Loader2, AlertCircle, CheckCircle, Trash2, School, Clock, CheckCircle2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { contentAPI, getFileUrl } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ContentDetailSkeleton } from '../components/skeletons';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuthStore();
  const [isDownloading, setIsDownloading] = useState(false);

  // Lấy chi tiết bài đăng
  const { data, isLoading, error, refetch } = useQuery(
    ['content', id],
    () => contentAPI.getById(id),
    { enabled: !!id }
  );

  // Tăng view count khi vào trang chi tiết
  useEffect(() => {
    if (id) {
      axios.get(`/api/content/${id}`);
    }
  }, [id]);

  const downloadMutation = useMutation(contentAPI.download, {
    onSuccess: () => {
      toast.success('Đã tăng lượt tải');
      refetch();
    },
    onError: (error) => {
      console.error('Download error:', error);
      toast.error('Lỗi khi tải file');
    }
  });

  const deleteMutation = useMutation(contentAPI.delete, {
    onSuccess: () => {
      toast.success('Xóa nội dung thành công');
      navigate('/');
    },
    onError: () => {
      toast.error('Lỗi khi xóa nội dung');
    }
  });

  const approveMutation = useMutation(contentAPI.approve, {
    onSuccess: () => {
      toast.success('Phê duyệt nội dung thành công');
      window.location.reload();
    },
    onError: () => {
      toast.error('Lỗi khi phê duyệt nội dung');
    }
  });

  const getFileTypeIcon = (fileType) => {
    const icons = {
      pdf: '📄', ppt: '📊', doc: '📝', mp4: '🎥', jpg: '🖼️', png: '🖼️', txt: '📄', other: '📁'
    };
    return icons[fileType] || icons.other;
  };

  const getFileTypeLabel = (fileType) => {
    const labels = {
      pdf: 'PDF Document', ppt: 'PowerPoint Presentation', doc: 'Word Document', mp4: 'Video File', jpg: 'Image File', png: 'Image File', txt: 'Text File', other: 'Other File'
    };
    return labels[fileType] || 'Unknown File';
  };

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

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = useCallback(async () => {
    // Get content from response - check different possible structures
    const content = data?.data?.data || data?.data || data;
    
    if (!content) {
      toast.error('Không tìm thấy nội dung');
      return;
    }

    try {
      setIsDownloading(true);
      
      if (content.contentType === 'youtube') {
        // For YouTube videos, open in new tab
        window.open(content.youtubeUrl, '_blank');
        toast.success('Đã mở video YouTube');
      } else {
        if (!content.fileUrl || !content.fileName) {
          toast.error('Không tìm thấy file để tải');
          return;
        }
        
        // Track download count
        await downloadMutation.mutateAsync(id);
        
        // Get file URL
        const fileUrl = getFileUrl(content.fileUrl);
        
        // For Cloudinary URLs or external URLs, use fetch to download
        if (fileUrl.startsWith('http')) {
          try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = content.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up blob URL
            window.URL.revokeObjectURL(blobUrl);
            
            toast.success('Đã bắt đầu tải file');
          } catch (fetchError) {
            console.error('Fetch download error:', fetchError);
            // Fallback: open in new tab
            window.open(fileUrl, '_blank');
            toast.success('Đã mở file trong tab mới');
          }
        } else {
          // For relative URLs, use direct download
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = content.fileName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success('Đã bắt đầu tải file');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Lỗi khi tải file: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setIsDownloading(false);
    }
  }, [data, id, downloadMutation]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nội dung này? Hành động này không thể hoàn tác.')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation, id]);

  const handleApprove = useCallback(() => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt nội dung này?')) {
      approveMutation.mutate(id);
    }
  }, [approveMutation, id]);

  if (isLoading) {
    return <ContentDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
            <p className="text-gray-600">{error.message}</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get content from response - check different possible structures
  const content = data?.data?.data || data?.data || data;
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy nội dung</h2>
            <Link
              to="/"
              className="inline-block bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canDelete = user && (content.author?._id === user.id || isTeacher());
  const canApprove = user && isTeacher() && !content.isApproved;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button - Fixed at top */}
      <div className="container mx-auto px-4 pt-6 pb-4">
        <Link
          to="/"
          className="inline-flex items-center text-amber-700 hover:text-amber-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại
        </Link>
      </div>

      {/* Banner Image - Full width, above title */}
      {content.bannerImage && typeof content.bannerImage === 'string' && content.bannerImage.trim() ? (
        <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
          <img 
            src={getFileUrl(content.bannerImage)} 
            alt={content.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-48 md:h-64 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl md:text-8xl">{getFileTypeIcon(content.contentType === 'youtube' ? 'youtube' : content.fileType)}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Content Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 -mt-16 md:-mt-20 lg:-mt-24 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {content.title}
              </h1>
              <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mt-3">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                  {content.contentType === 'youtube' ? 'YouTube Video' : getFileTypeLabel(content.fileType)}
                </span>
                {!content.isApproved && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                    Chờ phê duyệt
                  </span>
                )}
                {content.isApproved && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    Đã phê duyệt
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleDownload}
                disabled={isDownloading || downloadMutation.isLoading}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading || downloadMutation.isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Tải về
                  </>
                )}
              </button>
              {canApprove && (
                <button
                  onClick={handleApprove}
                  disabled={approveMutation.isLoading}
                  className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approveMutation.isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Đang phê duyệt...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Phê duyệt
                    </>
                  )}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isLoading}
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5 mr-2" />
                      Xóa bài đăng
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Category and SubCategory */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryLabel(content.category)}
            </span>
            <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {getSubCategoryLabel(content.subCategory)}
            </span>
          </div>

          {/* Detailed Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Author Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Thông tin tác giả</h3>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">{content.author?.fullName || 'Không xác định'}</span>
              </div>
              {content.author?.school && (
                <div className="flex items-center text-sm text-gray-600">
                  <School className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{content.author.school}</span>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Thống kê</h3>
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
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Thời gian</h3>
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
            {content.isApproved && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Phê duyệt</h3>
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
              </div>
            )}

            {/* File Info */}
            {content.contentType === 'file' && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Thông tin file</h3>
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
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Thông tin video</h3>
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

          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Mô tả</h2>
            <div 
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ 
                __html: content.description || '<p class="text-gray-500 italic">Không có mô tả.</p>' 
              }}
            />
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Thẻ tag</h2>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Preview */}
        {content.contentType === 'file' && isImageFile(content.fileType) && content.fileUrl && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Xem trước hình ảnh</h2>
            <div className="relative w-full max-w-4xl mx-auto">
              <img 
                src={getFileUrl(content.fileUrl)} 
                alt={content.title}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>Không thể tải hình ảnh</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Video Embed */}
        {content.contentType === 'youtube' && content.youtubeId && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
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

        {/* File Download Section */}
        {content.contentType === 'file' && !isImageFile(content.fileType) && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Tải xuống</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-8 w-8 mr-3 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{content.fileName}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(content.fileSize)} • {getFileTypeLabel(content.fileType)}</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading || downloadMutation.isLoading}
                className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading || downloadMutation.isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Tải về
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetail; 