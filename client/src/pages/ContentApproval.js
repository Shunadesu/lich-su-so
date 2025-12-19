import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Calendar, 
  User, 
  FileText,
  Search,
 
  Clock,
  AlertCircle
} from 'lucide-react';
import { contentAPI } from '../services/api';
import toast from 'react-hot-toast';

const ContentApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending'); // pending, approved, all
  const [categoryFilter, setCategoryFilter] = useState('');

  // Fetch pending content for approval
  const { data: pendingData, isLoading: pendingLoading, refetch: refetchPending } = useQuery(
    ['pending-content'],
    () => contentAPI.getAll({ 
      isApproved: false,
      authorRole: 'student',
      limit: 50
    }),
    {
      onSuccess: (response) => {
        console.log('Pending content API response:', response);
      },
      onError: (error) => {
        console.error('Pending content API error:', error);
      }
    }
  );

  // Fetch approved content
  const { data: approvedData, isLoading: approvedLoading, refetch: refetchApproved } = useQuery(
    ['approved-content'],
    () => contentAPI.getAll({ 
      isApproved: true,
      authorRole: 'student',
      limit: 50
    }),
    {
      onSuccess: (response) => {
        console.log('Approved content API response:', response);
      },
      onError: (error) => {
        console.error('Approved content API error:', error);
      }
    }
  );

  // Mutations
  const approveMutation = useMutation(
    (id) => contentAPI.approve(id),
    {
      onSuccess: () => {
        toast.success('Phê duyệt nội dung thành công!');
        refetchPending();
        refetchApproved();
      },
      onError: () => {
        toast.error('Lỗi khi phê duyệt nội dung');
      }
    }
  );

  const rejectMutation = useMutation(
    (id) => contentAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Từ chối nội dung thành công!');
        refetchPending();
        refetchApproved();
      },
      onError: () => {
        toast.error('Lỗi khi từ chối nội dung');
      }
    }
  );

  const handleApprove = (contentId, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn phê duyệt "${title}"?`)) {
      approveMutation.mutate(contentId);
    }
  };

  const handleReject = (contentId, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn từ chối "${title}"? Nội dung sẽ bị xóa vĩnh viễn.`)) {
      rejectMutation.mutate(contentId);
    }
  };

  const getFileTypeIcon = (fileType) => {
    const icons = {
      pdf: '📄',
      ppt: '📊',
      doc: '📝',
      mp4: '🎥',
      jpg: '🖼️',
      png: '🖼️',
      txt: '📄',
      other: '📁'
    };
    return icons[fileType] || icons.other;
  };

  const getCategoryTitle = (category) => {
    const titles = {
      'lich-su-10': 'Lịch sử 10',
      'lich-su-11': 'Lịch sử 11',
      'lich-su-12': 'Lịch sử 12',
      'lich-su-dia-phuong': 'Lịch sử địa phương'
    };
    return titles[category] || category;
  };

  const getSubCategoryTitle = (subCategory) => {
    const titles = {
      'san-pham-hoc-tap': 'Sản phẩm học tập',
      'tai-lieu-hoc-tap': 'Tài liệu học tập',
      'hinh-anh-hoc-tap': 'Hình ảnh học tập',
      'video-hoc-tap': 'Video học tập',
      'bai-tap-hoc-sinh': 'Bài tập học sinh',
      'du-an-hoc-tap': 'Dự án học tập'
    };
    return titles[subCategory] || subCategory;
  };

  // Filter content based on search and filters
  const filterContent = (contentList) => {
    if (!Array.isArray(contentList)) return [];
    
    return contentList.filter(content => {
      const matchesSearch = !searchTerm || 
        content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.author?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !categoryFilter || content.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  const pendingContents = filterContent(pendingData?.data?.data || []);
  const approvedContents = filterContent(approvedData?.data?.data || []);
  const allContents = statusFilter === 'pending' ? pendingContents : 
                     statusFilter === 'approved' ? approvedContents : 
                     [...pendingContents, ...approvedContents];

  const isLoading = pendingLoading || approvedLoading;

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Phê duyệt bài đăng học sinh</h1>
          </div>
          <p className="text-gray-600">
            Quản lý và phê duyệt các bài đăng của học sinh trước khi hiển thị công khai
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ phê duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{pendingContents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã phê duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{approvedContents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng bài đăng</p>
                <p className="text-2xl font-bold text-gray-900">{allContents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, mô tả hoặc tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Chờ phê duyệt</option>
                <option value="approved">Đã phê duyệt</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả danh mục</option>
                <option value="lich-su-10">Lịch sử 10</option>
                <option value="lich-su-11">Lịch sử 11</option>
                <option value="lich-su-12">Lịch sử 12</option>
                <option value="lich-su-dia-phuong">Lịch sử địa phương</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {statusFilter === 'pending' ? 'Bài đăng chờ phê duyệt' :
               statusFilter === 'approved' ? 'Bài đăng đã phê duyệt' :
               'Tất cả bài đăng'}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {allContents.length > 0 ? (
              allContents.map((content) => (
                <div key={content._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-3xl">{getFileTypeIcon(content.fileType)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {content.title}
                          </h3>
                          {content.description && (
                            <div 
                              className="text-gray-600 mb-3 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: content.description }}
                            />
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
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
                              {content.viewCount || 0} lượt xem
                            </div>
                            <div className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              {content.downloadCount || 0} lượt tải
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getCategoryTitle(content.category)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {getSubCategoryTitle(content.subCategory)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {content.fileType?.toUpperCase()}
                            </span>
                            {!content.isApproved ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Chờ phê duyệt
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Đã phê duyệt
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 ml-4">
                          <div className="flex space-x-2">
                            {!content.isApproved && (
                              <>
                                <button
                                  onClick={() => handleApprove(content._id, content.title)}
                                  disabled={approveMutation.isLoading}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Phê duyệt
                                </button>
                                <button
                                  onClick={() => handleReject(content._id, content.title)}
                                  disabled={rejectMutation.isLoading}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Từ chối
                                </button>
                              </>
                            )}
                            <a
                              href={`http://localhost:5000${content.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {statusFilter === 'pending' ? 'Không có bài đăng nào chờ phê duyệt' :
                   statusFilter === 'approved' ? 'Không có bài đăng nào đã phê duyệt' :
                   'Không tìm thấy bài đăng nào'}
                </h3>
                <p className="text-gray-500">
                  {statusFilter === 'pending' ? 'Tất cả bài đăng đã được phê duyệt hoặc chưa có bài đăng nào được gửi.' :
                   statusFilter === 'approved' ? 'Chưa có bài đăng nào được phê duyệt.' :
                   'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentApproval; 