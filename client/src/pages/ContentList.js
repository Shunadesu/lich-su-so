import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Search, Filter, Download, Eye, Calendar, User, Bug } from 'lucide-react';
import { contentAPI } from '../services/api';

const ContentList = ({ category }) => {
  // If no category is provided, show all content
  const effectiveCategory = category || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['contents', effectiveCategory, selectedSubCategory, searchTerm, currentPage],
    () => contentAPI.getAll({
      category: effectiveCategory === 'all' ? undefined : effectiveCategory,
      subCategory: selectedSubCategory || undefined,
      search: searchTerm || undefined,
      page: currentPage,
      limit: 12
    }),
    {
      onSuccess: (response) => {
        console.log('ContentList API response:', response);
        console.log('ContentList data:', response.data);
        console.log('ContentList category:', effectiveCategory);
        console.log('ContentList subCategory:', selectedSubCategory);
      },
      onError: (error) => {
        console.error('ContentList API error:', error);
      }
    }
  );

  const subCategories = {
    'lich-su-10': [
      { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
      { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
      { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
      { value: 'video', label: 'Video' },
      { value: 'hinh-anh', label: 'Hình ảnh' },
      { value: 'bai-kiem-tra', label: 'Bài kiểm tra' }
    ],
    'lich-su-11': [
      { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
      { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
      { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
      { value: 'video', label: 'Video' },
      { value: 'hinh-anh', label: 'Hình ảnh' },
      { value: 'bai-kiem-tra', label: 'Bài kiểm tra' }
    ],
    'lich-su-12': [
      { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
      { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
      { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
      { value: 'video', label: 'Video' },
      { value: 'hinh-anh', label: 'Hình ảnh' },
      { value: 'bai-kiem-tra', label: 'Bài kiểm tra' },
      { value: 'on-thi-tnthpt', label: 'Ôn thi TNTHPT' }
    ],
    'lich-su-dia-phuong': [
      { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
      { value: 'video', label: 'Video' },
      { value: 'hinh-anh', label: 'Hình ảnh' },
      { value: 'san-pham-hoc-tap', label: 'Sản phẩm học tập' }
    ]
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

  const handleDownload = async (contentId) => {
    try {
      await contentAPI.download(contentId);
      // Tải file từ URL
      const content = Array.isArray(data?.data) ? data.data.find(item => item._id === contentId) : null;
      if (content) {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${content.fileUrl}`;
        link.download = content.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download error:', error);
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {effectiveCategory === 'all' ? 'Tất cả tài liệu' : getCategoryTitle(effectiveCategory)}
              </h1>
              <p className="text-gray-600">
                {effectiveCategory === 'all' 
                  ? 'Tài liệu học tập và nghiên cứu lịch sử'
                  : `Tài liệu học tập và nghiên cứu môn ${getCategoryTitle(effectiveCategory)}`
                }
              </p>
            </div>
          
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả danh mục</option>
                {effectiveCategory !== 'all' && subCategories[effectiveCategory]?.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Content Grid */}
        {data?.data && data.data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {data.data.data.map((content, idx) => (
              <div key={content._id || content.id || idx} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-amber-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl">{getFileTypeIcon(content.fileType)}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {content.fileType?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {content.title}
                  </h3>
                  {content.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {content.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {content.viewCount}
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      {content.downloadCount}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <User className="h-4 w-4 mr-1" />
                    {content.author?.fullName || 'Không xác định'}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    {content.createdAt ? new Date(content.createdAt).toLocaleDateString('vi-VN') : ''}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/content/${content._id || content.id}`}
                      className="flex-1 bg-amber-700 text-white text-center py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      onClick={() => handleDownload(content._id || content.id)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Không tìm thấy bài đăng nào
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Nếu bạn chắc chắn đã có dữ liệu, hãy kiểm tra lại code render hoặc liên hệ hỗ trợ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Về trang chủ
              </Link>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubCategory('');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {Array.isArray(data?.data) && data.data.length > 0 && data?.pagination && data.pagination.total > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {data.pagination.hasPrev && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Trước
                </button>
              )}
              
              <span className="px-4 py-2 text-gray-700">
                Trang {data.pagination.current} / {data.pagination.total}
              </span>
              
              {data.pagination.hasNext && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sau
                </button>
              )}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default ContentList; 