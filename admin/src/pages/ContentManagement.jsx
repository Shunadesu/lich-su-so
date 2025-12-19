import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Download,
  Edit,
  Plus,
} from 'lucide-react';
import { contentAPI, getFileUrl } from '../services/api';
import { useAdminStore } from '../store';
import { ContentTableSkeleton } from '../components/skeletons';
import toast from 'react-hot-toast';

const ContentManagement = () => {
  const queryClient = useQueryClient();
  const { contentFilters, setContentFilters } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState(contentFilters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(contentFilters.category || '');
  const [approvalFilter, setApprovalFilter] = useState(
    contentFilters.isApproved !== null ? String(contentFilters.isApproved) : 'all'
  );

  const { data, isLoading, error } = useQuery(
    ['admin-content', contentFilters.search, contentFilters.category, contentFilters.isApproved],
    () => {
      const params = {
        limit: 50,
      };
      if (contentFilters.search) params.search = contentFilters.search;
      if (contentFilters.category) params.category = contentFilters.category;
      if (contentFilters.isApproved !== null && contentFilters.isApproved !== undefined) {
        params.isApproved = contentFilters.isApproved;
      }
      if (contentFilters.subCategory) params.subCategory = contentFilters.subCategory;
      if (contentFilters.author) params.author = contentFilters.author;
      return contentAPI.getAll(params);
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const approveMutation = useMutation(
    (id) => contentAPI.approve(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-content');
        toast.success('Phê duyệt thành công');
      },
      onError: () => {
        toast.error('Lỗi khi phê duyệt');
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => contentAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-content');
        toast.success('Xóa thành công');
      },
      onError: () => {
        toast.error('Lỗi khi xóa');
      },
    }
  );

  const applyFilters = () => {
    const newFilters = {
      search: searchTerm.trim() || null,
      category: categoryFilter || null,
      isApproved: approvalFilter !== 'all' ? (approvalFilter === 'true') : null,
    };
    setContentFilters(newFilters);
    queryClient.invalidateQueries(['admin-content']);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleFilter = () => {
    applyFilters();
  };

  const contents = data?.data?.data || [];

  const categories = [
    { value: '', label: 'Tất cả' },
    { value: 'lich-su-10', label: 'Lịch sử 10' },
    { value: 'lich-su-11', label: 'Lịch sử 11' },
    { value: 'lich-su-12', label: 'Lịch sử 12' },
    { value: 'lich-su-dia-phuong', label: 'Lịch sử địa phương' },
  ];

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài liệu</h1>
          <p className="text-gray-600">Quản lý và phê duyệt tài liệu học tập</p>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <ContentTableSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài liệu</h1>
          <p className="text-gray-600">Quản lý và phê duyệt tài liệu học tập</p>
        </div>
        <Link
          to="/content/upload"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Đăng bài
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              // Auto apply filter when category changes
              setTimeout(() => {
                const newFilters = {
                  search: searchTerm.trim() || null,
                  category: e.target.value || null,
                  isApproved: approvalFilter !== 'all' ? (approvalFilter === 'true') : null,
                };
                setContentFilters(newFilters);
                queryClient.invalidateQueries(['admin-content']);
              }, 0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={approvalFilter}
            onChange={(e) => {
              setApprovalFilter(e.target.value);
              // Auto apply filter when approval status changes
              setTimeout(() => {
                const newFilters = {
                  search: searchTerm.trim() || null,
                  category: categoryFilter || null,
                  isApproved: e.target.value !== 'all' ? (e.target.value === 'true') : null,
                };
                setContentFilters(newFilters);
                queryClient.invalidateQueries(['admin-content']);
              }, 0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="true">Đã phê duyệt</option>
            <option value="false">Chờ phê duyệt</option>
          </select>
          <button
            onClick={handleFilter}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ảnh Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Không có tài liệu nào
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {content.bannerImage && content.bannerImage.trim() ? (
                        <div className="relative group">
                          <img
                            src={getFileUrl(content.bannerImage)}
                            alt={content.title}
                            className="w-20 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              // Open image in new tab
                              window.open(getFileUrl(content.bannerImage), '_blank');
                            }}
                            onError={(e) => {
                              console.error('Error loading banner image for content:', content._id, 'URL:', content.bannerImage);
                              e.target.style.display = 'none';
                              const errorDiv = e.target.nextElementSibling;
                              if (errorDiv) {
                                errorDiv.style.display = 'flex';
                              }
                            }}
                            loading="lazy"
                          />
                          <div className="hidden w-20 h-16 bg-gray-100 rounded-lg border border-gray-200 items-center justify-center text-xs text-gray-400">
                            Lỗi tải ảnh
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                          Chưa có
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {content.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {content.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {content.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof content.author === 'object'
                        ? content.author?.fullName || 'Không xác định'
                        : content.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {content.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Đã phê duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <XCircle className="h-4 w-4 mr-1" />
                          Chờ phê duyệt
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/content/${content._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-5 w-5 inline" />
                      </Link>
                      <Link
                        to={`/content/${content._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      {!content.isApproved && (
                        <button
                          onClick={() => approveMutation.mutate(content._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Phê duyệt"
                        >
                          <CheckCircle className="h-5 w-5 inline" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn xóa?')) {
                            deleteMutation.mutate(content._id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;

