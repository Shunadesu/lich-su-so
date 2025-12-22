import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Upload, X, Tag, AlertCircle, Loader2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentAPI, taxonomyAPI } from '../services/api';
import toast from 'react-hot-toast';

const UploadContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gradeId: '',
    topicId: '',
    sectionId: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [contentType, setContentType] = useState('file');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Fetch taxonomy tree
  const { data: taxonomyData, isLoading: isLoadingTaxonomy } = useQuery(
    ['taxonomy'],
    () => taxonomyAPI.getTree(),
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const grades = taxonomyData?.data?.data || [];
  const selectedGrade = grades.find((g) => g._id === formData.gradeId);
  const topics = selectedGrade?.topics || [];
  const selectedTopic = topics.find((t) => t._id === formData.topicId);
  const sections = selectedTopic?.sections || [];

  const uploadMutation = useMutation(
    (data) => contentAPI.create(data),
    {
      onSuccess: () => {
        setValidationErrors({});
        setUploadProgress(0);
        queryClient.invalidateQueries('admin-content');
        queryClient.invalidateQueries(['recent-activities']);
        toast.success('Đăng tải thành công!');
        navigate('/content');
      },
      onError: (error) => {
        setUploadProgress(0);
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errors.forEach(err => {
            toast.error(`${err.param}: ${err.msg}`);
          });
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Có lỗi xảy ra khi đăng tải');
        }
      }
    }
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 50MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'video/mp4', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Loại file không được hỗ trợ');
        return;
      }
      
      setUploadedFile(file);
      setValidationErrors(prev => ({ ...prev, file: null }));
      toast.success(`Đã chọn file: ${file.name}`);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ảnh banner quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB');
        return;
      }
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
      toast.success(`Đã chọn ảnh banner: ${file.name}`);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }

    // Reset dependent fields when changing parent
    if (name === 'gradeId') {
      setFormData(prev => ({
        ...prev,
        gradeId: value,
        topicId: '',
        sectionId: ''
      }));
      return;
    }

    if (name === 'topicId') {
      setFormData(prev => ({
        ...prev,
        topicId: value,
        sectionId: ''
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});
    
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề';
    }

    if (contentType === 'file') {
      if (!uploadedFile) {
        errors.file = 'Vui lòng chọn file để đăng tải';
      }
    } else if (contentType === 'youtube') {
      if (!youtubeUrl.trim()) {
        errors.youtubeUrl = 'Vui lòng nhập link YouTube';
      } else if (!validateYouTubeUrl(youtubeUrl)) {
        errors.youtubeUrl = 'Link YouTube không hợp lệ';
      }
    }

    if (!formData.gradeId) {
      errors.gradeId = 'Vui lòng chọn lớp';
    }

    if (!formData.topicId) {
      errors.topicId = 'Vui lòng chọn chủ đề';
    }

    if (!formData.sectionId) {
      errors.sectionId = 'Vui lòng chọn mục';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    setUploadProgress(10);
    
    const submitData = new FormData();
    submitData.append('title', formData.title.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('gradeId', formData.gradeId);
    submitData.append('topicId', formData.topicId);
    submitData.append('sectionId', formData.sectionId);
    submitData.append('tags', formData.tags.join(','));
    submitData.append('contentType', contentType);
    
    if (contentType === 'file' && uploadedFile) {
      submitData.append('file', uploadedFile);
    } else if (contentType === 'youtube') {
      submitData.append('youtubeUrl', youtubeUrl.trim());
    }

    if (bannerImage) {
      submitData.append('bannerImage', bannerImage);
    }

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    uploadMutation.mutate(submitData, {
      onSettled: () => {
        clearInterval(progressInterval);
        setUploadProgress(0);
      }
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const icons = {
      pdf: '📄', ppt: '📊', pptx: '📊', doc: '📝', docx: '📝',
      mp4: '🎥', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', txt: '📄'
    };
    return icons[ext] || '📁';
  };

  const getSubCategories = (category) => {
    const subCategories = {
      'lich-su-10': [
        { value: 'chuyen-de-hoc-tap', label: 'Chuyên đề học tập' },
        { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
        { value: 'sach-dien-tu', label: 'Sách điện tử' },
        { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
        { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
        { value: 'tu-lieu-dien-tu', label: 'Tư liệu điện tử' },
        { value: 'video', label: 'Video' },
        { value: 'hinh-anh', label: 'Hình ảnh' },
        { value: 'bai-kiem-tra', label: 'Bài kiểm tra' }
      ],
      'lich-su-11': [
        { value: 'chuyen-de-hoc-tap', label: 'Chuyên đề học tập' },
        { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
        { value: 'sach-dien-tu', label: 'Sách điện tử' },
        { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
        { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
        { value: 'tu-lieu-dien-tu', label: 'Tư liệu điện tử' },
        { value: 'video', label: 'Video' },
        { value: 'hinh-anh', label: 'Hình ảnh' },
        { value: 'bai-kiem-tra', label: 'Bài kiểm tra' }
      ],
      'lich-su-12': [
        { value: 'chuyen-de-hoc-tap', label: 'Chuyên đề học tập' },
        { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
        { value: 'sach-dien-tu', label: 'Sách điện tử' },
        { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
        { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
        { value: 'tu-lieu-dien-tu', label: 'Tư liệu điện tử' },
        { value: 'video', label: 'Video' },
        { value: 'hinh-anh', label: 'Hình ảnh' },
        { value: 'bai-kiem-tra', label: 'Bài kiểm tra' },
        { value: 'on-thi-tnthpt', label: 'Ôn thi TNTHPT' }
      ],
      'lich-su-dia-phuong': [
        { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
        { value: 'video', label: 'Video' },
        { value: 'hinh-anh', label: 'Hình ảnh' },
        { value: 'san-pham-hoc-tap', label: 'Sản phẩm học tập' },
        { value: 'tai-lieu-hoc-tap', label: 'Tài liệu học tập' },
        { value: 'hinh-anh-hoc-tap', label: 'Hình ảnh học tập' },
        { value: 'video-hoc-tap', label: 'Video học tập' },
        { value: 'bai-tap-hoc-sinh', label: 'Bài tập học sinh' },
        { value: 'du-an-hoc-tap', label: 'Dự án học tập' }
      ]
    };
    return subCategories[category] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link
            to="/content"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Đăng tải nội dung mới</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại nội dung *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    checked={contentType === 'file'}
                    onChange={(e) => {
                      setContentType(e.target.value);
                      setValidationErrors(prev => ({ ...prev, file: null, youtubeUrl: null }));
                    }}
                    disabled={uploadMutation.isLoading}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Upload file</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="youtube"
                    checked={contentType === 'youtube'}
                    onChange={(e) => {
                      setContentType(e.target.value);
                      setValidationErrors(prev => ({ ...prev, file: null, youtubeUrl: null }));
                    }}
                    disabled={uploadMutation.isLoading}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Link YouTube</span>
                </label>
              </div>
            </div>

            {/* File Upload */}
            {contentType === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File tài liệu *
                </label>
                {uploadMutation.isLoading ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Loader2 className="h-12 w-12 text-blue-500 mb-4 animate-spin mx-auto" />
                    <p className="text-blue-600 font-medium">Đang đăng tải...</p>
                    {uploadProgress > 0 && (
                      <div className="w-full max-w-xs mt-4 mx-auto">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    validationErrors.file
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.jpg,.jpeg,.png,.txt"
                      className="hidden"
                      disabled={uploadMutation.isLoading}
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">
                        <span className="text-blue-600 font-medium">Chọn file</span> để đăng tải
                      </p>
                      <p className="text-sm text-gray-500">
                        Hỗ trợ: PDF, PPT, PPTX, DOC, DOCX, MP4, JPG, PNG, TXT (Tối đa 50MB)
                      </p>
                    </div>
                  </label>
                )}
                
                {validationErrors.file && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.file}
                  </div>
                )}
                
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getFileIcon(uploadedFile.name)}</span>
                        <div>
                          <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                          <p className="text-xs text-green-600">{formatFileSize(uploadedFile.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="text-red-600 hover:text-red-800"
                        disabled={uploadMutation.isLoading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* YouTube URL Input */}
            {contentType === 'youtube' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link YouTube *
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setValidationErrors(prev => ({ ...prev, youtubeUrl: null }));
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full px-4 py-2 border rounded-lg ${
                    validationErrors.youtubeUrl ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={uploadMutation.isLoading}
                />
                {validationErrors.youtubeUrl && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.youtubeUrl}
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  validationErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={uploadMutation.isLoading}
              />
              {validationErrors.title && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.title}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                disabled={uploadMutation.isLoading}
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lớp *
              </label>
              <select
                name="gradeId"
                value={formData.gradeId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  validationErrors.gradeId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={uploadMutation.isLoading || isLoadingTaxonomy}
              >
                <option value="">Chọn lớp</option>
                {grades.map((grade) => (
                  <option key={grade._id} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </select>
              {validationErrors.gradeId && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.gradeId}
                </div>
              )}
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chủ đề *
              </label>
              <select
                name="topicId"
                value={formData.topicId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  validationErrors.topicId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={uploadMutation.isLoading || !formData.gradeId || isLoadingTaxonomy}
              >
                <option value="">Chọn chủ đề</option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.name}
                  </option>
                ))}
              </select>
              {validationErrors.topicId && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.topicId}
                </div>
              )}
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mục *
              </label>
              <select
                name="sectionId"
                value={formData.sectionId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  validationErrors.sectionId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={uploadMutation.isLoading || !formData.topicId || isLoadingTaxonomy}
              >
                <option value="">Chọn mục</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.name}
                  </option>
                ))}
              </select>
              {validationErrors.sectionId && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.sectionId}
                </div>
              )}
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh Banner (tùy chọn)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                    disabled={uploadMutation.isLoading}
                  />
                  <div className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                    <ImageIcon className="h-5 w-5 inline mr-2" />
                    Chọn ảnh banner
                  </div>
                </label>
                {bannerPreview && (
                  <div className="relative">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="h-20 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setBannerImage(null);
                        setBannerPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      disabled={uploadMutation.isLoading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Nhập tag và nhấn Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={uploadMutation.isLoading}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={uploadMutation.isLoading}
                >
                  Thêm
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={uploadMutation.isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                to="/content"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={uploadMutation.isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploadMutation.isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang đăng tải...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Đăng tải
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadContent;

