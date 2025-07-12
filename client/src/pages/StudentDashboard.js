import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Image, 
  Video, 
  BookOpen, 
  Award, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Calendar,
} from 'lucide-react';
import { contentAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch student's content
  const { data: contentData, isLoading, error } = useQuery(
    ['student-content', user?.id],
    () => contentAPI.getMyContent(),
    {
      enabled: !!user?.id,
      onSuccess: (data) => {
        console.log('Student content API response:', data);
        console.log('Content data structure:', data?.data);
      },
      onError: (error) => {
        console.error('Error fetching student content:', error);
      }
    }
  );

  // Delete content mutation
  const deleteMutation = useMutation(
    (contentId) => contentAPI.delete(contentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['student-content']);
        queryClient.invalidateQueries(['recent-activities']);
        toast.success('Xóa nội dung thành công!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa nội dung');
      }
    }
  );

  const handleDelete = (contentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
      deleteMutation.mutate(contentId);
    }
  };

  const getSubCategoryIcon = (subCategory) => {
    switch (subCategory) {
      case 'tai-lieu-hoc-tap':
        return <FileText className="h-5 w-5" />;
      case 'hinh-anh-hoc-tap':
        return <Image className="h-5 w-5" />;
      case 'video-hoc-tap':
        return <Video className="h-5 w-5" />;
      case 'bai-tap-hoc-sinh':
        return <BookOpen className="h-5 w-5" />;
      case 'du-an-hoc-tap':
        return <Award className="h-5 w-5" />;
      case 'san-pham-hoc-tap':
        return <Award className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getSubCategoryLabel = (subCategory) => {
    const labels = {
      'tai-lieu-hoc-tap': 'Tài liệu học tập',
      'hinh-anh-hoc-tap': 'Hình ảnh học tập',
      'video-hoc-tap': 'Video học tập',
      'bai-tap-hoc-sinh': 'Bài tập học sinh',
      'du-an-hoc-tap': 'Dự án học tập',
      'san-pham-hoc-tap': 'Sản phẩm học tập'
    };
    return labels[subCategory] || subCategory;
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

  // Ensure contentData.data is an array
  const contents = Array.isArray(contentData?.data.data) ? contentData.data.data : [];
  console.log('contents:', contents);
  const filteredContent = contents.filter(content => {
    if (selectedCategory === 'all') return true;
    return content.subCategory === selectedCategory;
  });

  const categories = [
    { value: 'all', label: 'Tất cả', count: contents.length },
    { value: 'tai-lieu-hoc-tap', label: 'Tài liệu học tập', count: contents.filter(c => c.subCategory === 'tai-lieu-hoc-tap').length },
    { value: 'hinh-anh-hoc-tap', label: 'Hình ảnh học tập', count: contents.filter(c => c.subCategory === 'hinh-anh-hoc-tap').length },
    { value: 'video-hoc-tap', label: 'Video học tập', count: contents.filter(c => c.subCategory === 'video-hoc-tap').length },
    { value: 'bai-tap-hoc-sinh', label: 'Bài tập học sinh', count: contents.filter(c => c.subCategory === 'bai-tap-hoc-sinh').length },
    { value: 'du-an-hoc-tap', label: 'Dự án học tập', count: contents.filter(c => c.subCategory === 'du-an-hoc-tap').length },
    { value: 'san-pham-hoc-tap', label: 'Sản phẩm học tập', count: contents.filter(c => c.subCategory === 'san-pham-hoc-tap').length }
  ];

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
            <div className="text-8xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
            <p className="text-gray-600 mb-8">{error.message || 'Có lỗi xảy ra khi tải dữ liệu'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Học Sinh
              </h1>
              <p className="text-gray-600">
                Quản lý tài liệu học tập, sản phẩm và hình ảnh học tập của bạn
              </p>
            </div>
            <Link
              to="/upload"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Đăng tải nội dung mới
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số nội dung</p>
                <p className="text-2xl font-bold text-gray-900">{contents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contents.reduce((sum, content) => sum + (content.viewCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lượt tải</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contents.reduce((sum, content) => sum + (content.downloadCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã phê duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contents.filter(content => content.isApproved).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approval Notice */}
        {contents.filter(content => !content.isApproved).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Có {contents.filter(content => !content.isApproved).length} nội dung đang chờ phê duyệt
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Nội dung sẽ được hiển thị công khai sau khi giáo viên phê duyệt
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lọc theo loại nội dung</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Nội dung của bạn
            </h2>
          </div>

          {filteredContent.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {contents.length === 0 ? 'Chưa có nội dung nào' : 'Không có nội dung trong danh mục này'}
              </h3>
              <p className="text-gray-600 mb-6">
                {contents.length === 0 
                  ? 'Bắt đầu đăng tải tài liệu học tập, sản phẩm hoặc hình ảnh học tập của bạn'
                  : 'Thử chọn danh mục khác hoặc đăng tải nội dung mới'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/upload"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Đăng tải nội dung mới
                </Link>
                {contents.length > 0 && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Xem tất cả nội dung
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredContent.map((content) => (
                <div key={content._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getSubCategoryIcon(content.subCategory)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {content.title}
                          </h3>
                          {content.isApproved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Đã phê duyệt
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Chờ phê duyệt
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {content.description || 'Không có mô tả'}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center" title="Loại nội dung">
                            <FileText className="h-4 w-4 mr-1" />
                            {getSubCategoryLabel(content.subCategory)}
                          </span>
                          <span className="flex items-center" title="Danh mục">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {getCategoryLabel(content.category)}
                          </span>
                          <span className="flex items-center" title="Lượt xem">
                            <Eye className="h-4 w-4 mr-1" />
                            {content.viewCount || 0} lượt xem
                          </span>
                          <span className="flex items-center" title="Lượt tải">
                            <Download className="h-4 w-4 mr-1" />
                            {content.downloadCount || 0} lượt tải
                          </span>
                          <span className="flex items-center" title="Ngày tạo">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(content.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/content/${content._id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      
                      <Link
                        to={`/upload?edit=${content._id}`}
                        className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(content._id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Xóa"
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 