import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Search, Download, Eye, Calendar, User, GraduationCap, Filter, X, Loader2, AlertCircle } from 'lucide-react';
import { contentAPI, taxonomyAPI, getFileUrl } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ContentListSkeleton, ContentCardSkeleton, ContentListPageSkeleton } from '../components/skeletons';

const ContentList = ({ category }) => {
  // If no category is provided, show all content
  const effectiveCategory = category || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters] = useState(true); // always show
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());
  const location = useLocation();

  // Fetch taxonomy tree
  const { data: taxonomyData } = useQuery(
    ['taxonomy'],
    () => taxonomyAPI.getTree(),
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const grades = taxonomyData?.data?.data || [];

  // Map route category slug -> grade.slug in DB
  const mapRouteCategoryToGradeSlug = (cat) => {
    if (!cat || cat === 'all') return null;
    const mapping = {
      'lich-su-10': 'lop-10',
      'lich-su-11': 'lop-11',
      'lich-su-12': 'lop-12',
    };
    return mapping[cat] || null;
  };

  const activeGradeSlug = mapRouteCategoryToGradeSlug(effectiveCategory);
  const activeGrade = grades.find((g) => g.slug === activeGradeSlug) || null;
  const topics = activeGrade?.topics || [];
  const activeTopic = topics.find((t) => t._id === selectedTopicId) || null;
  const sections = activeTopic?.sections || [];

  // Sync topic/section from URL (?topic=, ?section=)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topicParam = params.get('topic');
    const sectionParam = params.get('section');
    if (topicParam) setSelectedTopicId(topicParam);
    if (sectionParam) setSelectedSectionId(sectionParam);
  }, [location.search]);

  // Query for teacher content (filtered by taxonomy)
  const { data: teacherData, isLoading: teacherLoading, error: teacherError } = useQuery(
    ['teacher-contents', activeGrade?._id, selectedTopicId, selectedSectionId, searchTerm, currentPage],
    () => contentAPI.getAll({
      gradeId: activeGrade?._id,
      topicId: selectedTopicId || undefined,
      sectionId: selectedSectionId || undefined,
      search: searchTerm || undefined,
      page: currentPage,
      limit: 12,
      authorRole: 'teacher' // Only teacher content
    }),
  );

  // Query for student content (all categories, no filtering)
  const { data: studentData, isLoading: studentLoading, error: studentError } = useQuery(
    ['student-contents'],
    () => contentAPI.getAll({
      authorRole: 'student', // Only student content
      limit: 20 // Show more student content
    }),
  );

  const headerTitle = useMemo(() => {
    if (effectiveCategory === 'all') return 'Tất cả tài liệu';
    if (effectiveCategory === 'lich-su-dia-phuong') return 'Tài liệu Lịch sử địa phương';
    if (activeGrade?.name) return `Tài liệu ${activeGrade.name}`;
    return 'Tài liệu';
  }, [effectiveCategory, activeGrade]);

  const headerDesc = useMemo(() => {
    if (effectiveCategory === 'all') return 'Tài liệu học tập và nghiên cứu lịch sử';
    if (effectiveCategory === 'lich-su-dia-phuong') return 'Tài liệu lịch sử địa phương';
    if (activeGrade?.name) return `Tài liệu học tập và nghiên cứu môn ${activeGrade.name}`;
    return 'Tài liệu học tập và nghiên cứu lịch sử';
  }, [effectiveCategory, activeGrade]);

  const getFileTypeIcon = (content) => {
    if (content.contentType === 'youtube') {
      return '🎥';
    }
    
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
    return icons[content.fileType] || icons.other;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTopicId('');
    setSelectedSectionId('');
    setCurrentPage(1);
  }, []);

  const handleDownload = useCallback(async (content) => {
    try {
      // Add to downloading set
      setDownloadingFiles(prev => new Set([...prev, content._id || content.id]));
      
      if (content.contentType === 'youtube') {
        // For YouTube videos, open in new tab
        window.open(content.youtubeUrl, '_blank');
        toast.success('Đã mở video YouTube');
      } else {
        // Track download count for files
        await contentAPI.download(content._id || content.id);
        
        // Create download link
        const link = document.createElement('a');
        link.href = getFileUrl(content.fileUrl);
        link.download = content.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Đã bắt đầu tải file');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Lỗi khi tải file');
    } finally {
      // Remove from downloading set
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(content._id || content.id);
        return newSet;
      });
    }
  }, []);

  const isLoading = teacherLoading || studentLoading;
  const error = teacherError || studentError;

  if (isLoading) {
    return <ContentListPageSkeleton />;
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

  const teacherContents = Array.isArray(teacherData?.data?.data) ? teacherData.data.data : [];
  const studentContents = Array.isArray(studentData?.data?.data) ? studentData.data.data : [];
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {headerTitle}
              </h1>
              <p className="text-gray-600">
                {headerDesc}
              </p>
            </div>
          </div>
        </div>

        

        {/* Teacher Content Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Tài liệu của giáo viên</h2>
            <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {teacherLoading ? '...' : teacherContents.length} tài liệu
            </span>
          </div>

          {/* Search and Filter for Teacher Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tìm kiếm và lọc</h3>
            </div>
            
            <div className="transition-all duration-300 block">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm tài liệu giáo viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {effectiveCategory !== 'all' && (
                  <>
                    <div className="md:w-64">
                      <select
                        value={selectedTopicId}
                        onChange={(e) => {
                          setSelectedTopicId(e.target.value);
                          setSelectedSectionId('');
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!activeGrade}
                      >
                        <option value="">Tất cả chủ đề</option>
                        {topics.map((topic) => (
                          <option key={topic._id} value={topic._id}>
                            {topic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:w-64">
                      <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!selectedTopicId}
                      >
                        <option value="">Tất cả mục</option>
                        {sections.map((section) => (
                          <option key={section._id} value={section._id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
              
              {/* Active filters display */}
              {(searchTerm || selectedTopicId || selectedSectionId) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Tìm kiếm: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedTopicId && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Chủ đề: {topics.find(t => t._id === selectedTopicId)?.name || 'Đã chọn'}
                      <button
                        onClick={() => {
                          setSelectedTopicId('');
                          setSelectedSectionId('');
                        }}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSectionId && (
                    <span className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                      Mục: {sections.find(s => s._id === selectedSectionId)?.name || 'Đã chọn'}
                      <button
                        onClick={() => setSelectedSectionId('')}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Teacher Content Grid */}
          {teacherLoading ? (
            <ContentListSkeleton count={8} />
          ) : teacherContents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teacherContents.map((content, idx) => (
                <div key={content._id || content.id || idx} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-amber-200 overflow-hidden">
                  {/* Banner Image */}
                  {content.bannerImage && typeof content.bannerImage === 'string' && content.bannerImage.trim() ? (
                    <div className="w-full h-64 overflow-hidden">
                      <img
                        src={getFileUrl(content.bannerImage)}
                        alt={content.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        loading="lazy"
                      />
                      <div className="hidden w-full h-40 bg-gradient-to-br from-amber-100 to-orange-100 items-center justify-center">
                        <span className="text-4xl">{getFileTypeIcon(content)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <span className="text-4xl">{getFileTypeIcon(content)}</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {!content.bannerImage && (
                        <span className="text-2xl">{getFileTypeIcon(content)}</span>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {content.contentType === 'youtube' ? 'YOUTUBE' : content.fileType?.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {content.title}
                    </h3>
                    {content.description && (
                      <div 
                        className="text-sm text-gray-600 mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: content.description }}
                      />
                    )}
                    <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {content.viewCount || 0}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {content.downloadCount || 0}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <User className="h-4 w-4 mr-1" />
                      {content.author?.fullName || 'Không xác định'}
                    </div>
                  <div className="flex flex-col text-[11px] text-gray-500 mb-3 space-y-1">
                    <span className="font-semibold text-gray-700">{content.grade?.name || content.grade?.slug || ''}</span>
                    <span>{content.topic?.name || ''}</span>
                    <span className="text-gray-500">{content.section?.name || ''}</span>
                  </div>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(content.createdAt)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {formatFileSize(content.fileSize)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/content/${content._id || content.id}`}
                        className="flex-1 bg-amber-700 text-white text-center py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={() => handleDownload(content)}
                        disabled={downloadingFiles.has(content._id || content.id)}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {downloadingFiles.has(content._id || content.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-amber-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy tài liệu giáo viên
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>

        {/* Pagination for Teacher Content */}
        {teacherContents.length > 0 && teacherData?.data?.pagination && teacherData.data.pagination.total > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {teacherData.data.pagination.hasPrev && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Trước
                </button>
              )}
              
              <span className="px-4 py-2 text-gray-700">
                Trang {teacherData.data.pagination.current} / {teacherData.data.pagination.total}
              </span>
              
              {teacherData.data.pagination.hasNext && (
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
        {/* Student Content Section - Always shown */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <GraduationCap className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Bài đăng của học sinh</h2>
            <span className="ml-3 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {studentLoading ? '...' : studentContents.length} bài đăng
            </span>
          </div>
          
          {studentLoading ? (
            <ContentListSkeleton count={8} />
          ) : studentContents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {studentContents.map((content, idx) => (
                <div key={content._id || content.id || idx} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-purple-200 overflow-hidden">
                  {/* Banner Image */}
                  {content.bannerImage && typeof content.bannerImage === 'string' && content.bannerImage.trim() ? (
                    <div className="w-full h-64 overflow-hidden">
                      <img
                        src={getFileUrl(content.bannerImage)}
                        alt={content.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        loading="lazy"
                      />
                      <div className="hidden w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 items-center justify-center">
                        <span className="text-4xl">{getFileTypeIcon(content)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="text-4xl">{getFileTypeIcon(content)}</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {!content.bannerImage && (
                        <span className="text-2xl">{getFileTypeIcon(content)}</span>
                      )}
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {content.contentType === 'youtube' ? 'YOUTUBE' : content.fileType?.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {content.title}
                    </h3>
                    {content.description && (
                      <div 
                        className="text-sm text-gray-600 mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: content.description }}
                      />
                    )}
                    <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {content.viewCount || 0}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {content.downloadCount || 0}
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
                        className="flex-1 bg-purple-700 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={() => handleDownload(content)}
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
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-purple-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có bài đăng nào từ học sinh
              </h3>
              <p className="text-gray-600">
                Học sinh có thể đăng tải bài viết, tài liệu học tập và sản phẩm của mình.
              </p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ContentList; 