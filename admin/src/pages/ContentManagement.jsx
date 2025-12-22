import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Download,
  Edit,
  Plus,
  FileText,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { contentAPI, taxonomyAPI, getFileUrl } from '../services/api';
import { useAdminStore } from '../store';
import { ContentTableSkeleton } from '../components/skeletons';
import toast from 'react-hot-toast';

const ContentManagement = () => {
  const queryClient = useQueryClient();
  const { contentFilters, setContentFilters } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState(contentFilters.search || '');
  const [gradeFilter, setGradeFilter] = useState(contentFilters.gradeId || '');
  const [legacyLocalFilter, setLegacyLocalFilter] = useState(contentFilters.category || '');
  const [topicFilter, setTopicFilter] = useState(contentFilters.topicId || '');
  const [sectionFilter, setSectionFilter] = useState(contentFilters.sectionId || '');
  const [approvalFilter, setApprovalFilter] = useState(
    contentFilters.isApproved !== null ? String(contentFilters.isApproved) : 'all'
  );

  // Fetch taxonomy tree for filters
  const { data: taxonomyData } = useQuery(
    ['taxonomy'],
    () => taxonomyAPI.getTree(),
    { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );

  const grades = taxonomyData?.data?.data || [];
  const topics = useMemo(() => {
    const g = grades.find((gr) => gr._id === gradeFilter);
    return g?.topics || [];
  }, [grades, gradeFilter]);
  const sections = useMemo(() => {
    const t = topics.find((tp) => tp._id === topicFilter);
    return t?.sections || [];
  }, [topics, topicFilter]);

  const { data, isLoading, error } = useQuery(
    ['admin-content', searchTerm, gradeFilter, topicFilter, sectionFilter, approvalFilter, legacyLocalFilter],
    () => {
      const params = { limit: 50 };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (gradeFilter) params.gradeId = gradeFilter;
      if (topicFilter) params.topicId = topicFilter;
      if (sectionFilter) params.sectionId = sectionFilter;
      if (legacyLocalFilter === 'lich-su-dia-phuong') params.category = 'lich-su-dia-phuong';
      if (approvalFilter !== 'all') params.isApproved = approvalFilter === 'true';
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
      gradeId: gradeFilter || null,
      topicId: topicFilter || null,
      sectionId: sectionFilter || null,
      category: legacyLocalFilter || null,
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            value={gradeFilter || legacyLocalFilter}
            onChange={(e) => {
              const val = e.target.value;
              // Legacy option for Lịch sử địa phương (không nằm trong taxonomy grade)
              if (val === 'lich-su-dia-phuong') {
                setGradeFilter('');
                setTopicFilter('');
                setSectionFilter('');
                setLegacyLocalFilter('lich-su-dia-phuong');
              } else {
                setGradeFilter(val);
                setTopicFilter('');
                setSectionFilter('');
                setLegacyLocalFilter('');
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả lớp</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>
                {`Lịch sử ${g.name}`}
              </option>
            ))}
            <option value="lich-su-dia-phuong">Lịch sử địa phương</option>
          </select>

          <select
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setSectionFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!gradeFilter}
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!topicFilter}
          >
            <option value="">Tất cả mục</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
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
                  Lớp / Chủ đề / Mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt xem / tải
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
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
                      <div className="flex flex-col gap-1 text-xs text-gray-700">
                        <span className="px-2 inline-flex text-[11px] leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 w-fit">
                          {content.grade?.name || content.grade?.slug || 'Chưa có lớp'}
                        </span>
                        <span className="line-clamp-1">{content.topic?.name || 'Chưa có chủ đề'}</span>
                        <span className="line-clamp-1 text-gray-500">{content.section?.name || 'Chưa có mục'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof content.author === 'object'
                        ? content.author?.fullName || 'Không xác định'
                        : content.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {content.contentType === 'youtube' ? 'YouTube' : 'File'}{content.fileType ? ` • ${content.fileType?.toUpperCase()}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span>{content.viewCount || 0}</span>
                        <Download className="h-4 w-4 text-gray-500 ml-2" />
                        <span>{content.downloadCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{content.createdAt ? new Date(content.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                      </div>
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

