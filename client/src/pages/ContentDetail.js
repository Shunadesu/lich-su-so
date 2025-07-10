import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { ArrowLeft, Download, Eye, Calendar, User, Tag, FileText } from 'lucide-react';
import { contentAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuthStore();

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
    onError: () => {
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

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    try {
      await axios.post(`/api/content/${id}/download`);
      const link = document.createElement('a');
      link.href = `http://localhost:5000${data.data.fileUrl}`;
      link.download = data.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      downloadMutation.mutate(id);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Lỗi khi tải file');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleApprove = () => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt nội dung này?')) {
      approveMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
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

  const content = data?.data.data;
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </Link>
        </div>

        {/* Content Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{getFileTypeIcon(content.fileType)}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {content.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                    {getFileTypeLabel(content.fileType)}
                  </span>
                  {!content.isApproved && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      Chờ phê duyệt
                    </span>
                  )}
                  {content.isApproved && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Đã phê duyệt
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mb-2"
              >
                <Download className="h-5 w-5 mr-2" />
                Tải về
              </button>
              {canApprove && (
                <button
                  onClick={handleApprove}
                  className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors mb-2"
                >
                  Phê duyệt
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa bài đăng
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {content.author?.fullName || 'Không xác định'}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {content.createdAt ? new Date(content.createdAt).toLocaleDateString('vi-VN') : ''}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {content.viewCount} lượt xem
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              {content.downloadCount} lượt tải
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {content.fileName} ({formatFileSize(content.fileSize)})
            </div>
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

          <div className="prose max-w-none text-gray-800">
            <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
            <p>{content.description || 'Không có mô tả.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail; 