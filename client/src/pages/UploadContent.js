import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Tag, AlertCircle, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { contentAPI, taxonomyAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const UploadContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { user, isStudent } = useAuthStore();

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
  const [contentType, setContentType] = useState('file'); // 'file' or 'youtube'
  const [youtubeUrl, setYoutubeUrl] = useState('');

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
  const selectedGrade = grades.find((g) => g._id === formData.gradeId);
  const topics = selectedGrade?.topics || [];
  const selectedTopic = topics.find((t) => t._id === formData.topicId);
  const sections = selectedTopic?.sections || [];

  // Fetch content for editing
  const { isLoading: isLoadingEdit } = useQuery(
    ['content', editId],
    () => contentAPI.getById(editId),
    {
      enabled: !!editId,
      onSuccess: (data) => {
        const content = data.data;
        setFormData((prev) => ({
          ...prev,
          title: content.title,
          description: content.description || '',
          gradeId: content.grade?._id || prev.gradeId,
          topicId: content.topic?._id || prev.topicId,
          sectionId: content.section?._id || prev.sectionId,
          tags: content.tags || []
        }));
        
        // Set content type based on existing data
        if (content.youtubeUrl) {
          setContentType('youtube');
          setYoutubeUrl(content.youtubeUrl);
        } else {
          setContentType('file');
        }

        // Set banner image if exists
        if (content.bannerImage) {
          setBannerPreview(content.bannerImage);
        }
      }
    }
  );

  const uploadMutation = useMutation(
    (data) => editId ? contentAPI.update(editId, data) : contentAPI.create(data),
    {
      onSuccess: (response) => {
        // Clear validation errors
        setValidationErrors({});
        setUploadProgress(0);
        
        // Invalidate and refetch queries
        queryClient.invalidateQueries(['contents']);
        queryClient.invalidateQueries(['teacher-dashboard']);
        queryClient.invalidateQueries(['recent-activities']);
        queryClient.invalidateQueries(['content']);
        
        toast.success(editId ? 'Cập nhật thành công!' : 'Đăng tải thành công!');
        navigate('/');
      },
      onError: (error) => {
        setUploadProgress(0);
        console.error('Upload error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
        // Handle different types of errors
        if (error.response?.data?.errors) {
          // Validation errors
          const errors = error.response.data.errors;
          const errorMap = {};
          errors.forEach(err => {
            errorMap[err.param] = err.msg;
            toast.error(`${err.param}: ${err.msg}`);
          });
          setValidationErrors(errorMap);
        } else if (error.response?.data?.message) {
          // Server error message
          toast.error(error.response.data.message);
        } else if (error.response?.status === 413) {
          toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 50MB');
        } else if (error.response?.status === 415) {
          toast.error('Loại file không được hỗ trợ');
        } else if (error.message) {
          // Network or other error
          toast.error(error.message);
        } else {
          toast.error('Có lỗi xảy ra khi đăng tải');
        }
      }
    }
  );

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Clear previous validation errors
    setValidationErrors(prev => ({ ...prev, file: null }));
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setValidationErrors(prev => ({ ...prev, file: 'File quá lớn. Vui lòng chọn file nhỏ hơn 50MB' }));
        toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 50MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setValidationErrors(prev => ({ ...prev, file: 'Loại file không được hỗ trợ' }));
        toast.error('Loại file không được hỗ trợ');
      }
      return;
    }
    
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`Đã chọn file: ${file.name}`);
    }
  }, []);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'video/mp4': ['.mp4'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    disabled: uploadMutation.isLoading
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Reset dependent taxonomy when parent changes
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Client-side validation
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề';
    }

    // Validate content based on type
    if (contentType === 'file') {
      if (!uploadedFile && !editId) {
        errors.file = 'Vui lòng chọn file để đăng tải';
      }
    } else if (contentType === 'youtube') {
      if (!youtubeUrl.trim()) {
        errors.youtubeUrl = 'Vui lòng nhập link YouTube';
      } else if (!validateYouTubeUrl(youtubeUrl)) {
        errors.youtubeUrl = 'Link YouTube không hợp lệ';
      }
    }

    // Validate taxonomy selection
    if (!formData.gradeId) {
      errors.gradeId = 'Vui lòng chọn lớp';
    }
    if (!formData.topicId) {
      errors.topicId = 'Vui lòng chọn chủ đề';
    }
    if (!formData.sectionId) {
      errors.sectionId = 'Vui lòng chọn mục';
    }

    // Check student permissions based on section slug
    if (isStudent() && formData.sectionId && sections.length > 0) {
      const selectedSection = sections.find(s => s._id === formData.sectionId);
      const allowedStudentSubCategories = [
        'san-pham-hoc-tap',
        'tai-lieu-hoc-tap',
        'hinh-anh-hoc-tap',
        'video-hoc-tap',
        'bai-tap-hoc-sinh',
        'du-an-hoc-tap'
      ];
      
      if (selectedSection && !allowedStudentSubCategories.includes(selectedSection.slug)) {
        errors.sectionId = 'Vui lòng chọn mục phù hợp cho học sinh (tài liệu/sản phẩm học tập, hình ảnh, video học tập, bài tập, dự án...)';
      }
    }

    // If there are validation errors, show them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    // Show upload progress
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

    // Append banner image if provided
    if (bannerImage) {
      submitData.append('bannerImage', bannerImage);
    }

    // Simulate progress updates
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

  // Helper functions
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

  // YouTube URL validation and extraction
  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  // Removed legacy getSubCategories - taxonomy is now managed via API

  if (isLoadingEdit) {
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {editId ? 'Chỉnh sửa nội dung' : 'Đăng tải nội dung mới'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại nội dung {!editId && '*'}
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
                  File tài liệu {!editId && '*'}
                </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50 scale-105' 
                    : validationErrors.file
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                } ${uploadMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                {uploadMutation.isLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin" />
                    <p className="text-blue-600 font-medium">Đang đăng tải...</p>
                    {uploadProgress > 0 && (
                      <div className="w-full max-w-xs mt-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                ) : isDragActive ? (
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                    <p className="text-blue-600 font-medium">Thả file vào đây...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Kéo thả file vào đây, hoặc <span className="text-blue-600 font-medium">chọn file</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Hỗ trợ: PDF, PPT, DOC, MP4, JPG, PNG, TXT (Tối đa 50MB)
                    </p>
                  </div>
                )}
              </div>
              
              {/* File validation error */}
              {validationErrors.file && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.file}
                </div>
              )}
              
              {/* Uploaded file info */}
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
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
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
                  Link YouTube {!editId && '*'}
                </label>
                <div className="space-y-4">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => {
                      setYoutubeUrl(e.target.value);
                      if (validationErrors.youtubeUrl) {
                        setValidationErrors(prev => ({ ...prev, youtubeUrl: null }));
                      }
                    }}
                    disabled={uploadMutation.isLoading}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.youtubeUrl 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    } ${uploadMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  
                  {/* YouTube validation error */}
                  {validationErrors.youtubeUrl && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.youtubeUrl}
                    </div>
                  )}
                  
                  {/* YouTube preview */}
                  {youtubeUrl && validateYouTubeUrl(youtubeUrl) && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <img
                          src={getYouTubeThumbnail(youtubeUrl)}
                          alt="YouTube thumbnail"
                          className="w-32 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/128x80?text=YouTube';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">YouTube Video</p>
                          <p className="text-xs text-red-600 mt-1">
                            Video ID: {extractYouTubeId(youtubeUrl)}
                          </p>
                          <a
                            href={youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-red-600 hover:text-red-800 underline mt-1 inline-block"
                          >
                            Xem video trên YouTube
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => setYoutubeUrl('')}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                          disabled={uploadMutation.isLoading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={uploadMutation.isLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  validationErrors.title 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                } ${uploadMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Nhập tiêu đề tài liệu"
              />
              {validationErrors.title && (
                <div className="mt-1 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.title}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                disabled={uploadMutation.isLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  'border-gray-300'
                } ${uploadMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Nhập mô tả tài liệu (không bắt buộc)"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh Banner (tùy chọn)
              </label>
              <div className="space-y-4">
                {bannerPreview && !bannerImage && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Banner hiện tại:</p>
                    <img 
                      src={bannerPreview.startsWith('http') ? bannerPreview : `http://localhost:5000${bannerPreview}`} 
                      alt="Current banner" 
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {bannerPreview && bannerImage && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Banner mới (sẽ thay thế banner cũ):</p>
                    <img 
                      src={bannerPreview} 
                      alt="New banner preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <ImageIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {bannerImage ? bannerImage.name : 'Chọn ảnh banner (JPG, PNG, WEBP - Tối đa 10MB)'}
                  </span>
                  <input
                    type="file"
                    onChange={handleBannerChange}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadMutation.isLoading}
                  />
                </label>
                {bannerImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setBannerImage(null);
                      setBannerPreview(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    disabled={uploadMutation.isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa ảnh banner
                  </button>
                )}
                <p className="text-xs text-gray-500">Kích thước khuyến nghị: 1920x1080px. Tối đa 10MB.</p>
              </div>
            </div>

            {/* Taxonomy Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="gradeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Lớp *
                </label>
                <select
                  id="gradeId"
                  name="gradeId"
                  value={formData.gradeId}
                  onChange={handleInputChange}
                  required
                  disabled={uploadMutation.isLoading || !grades.length}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.gradeId 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  } ${uploadMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Chọn lớp</option>
                  {grades.map((grade) => (
                    <option key={grade._id} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
                {validationErrors.gradeId && (
                  <div className="mt-1 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.gradeId}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="topicId" className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề *
                </label>
                <select
                  id="topicId"
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleInputChange}
                  required
                  disabled={uploadMutation.isLoading || !formData.gradeId}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.topicId 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  } ${uploadMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                {validationErrors.topicId && (
                  <div className="mt-1 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.topicId}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-2">
                  Mục *
                </label>
                <select
                  id="sectionId"
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleInputChange}
                  required
                  disabled={uploadMutation.isLoading || !formData.topicId}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.sectionId 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  } ${uploadMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Chọn mục</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.name}
                    </option>
                  ))}
                </select>
                {validationErrors.sectionId && (
                  <div className="mt-1 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.sectionId}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tag và nhấn Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600"
                >
                  Thêm
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Permission Notice */}
            {isStudent() && formData.subCategory !== 'san-pham-hoc-tap' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Lưu ý: Học sinh chỉ được đăng tải sản phẩm học tập. 
                  Vui lòng chọn "Sản phẩm học tập" trong thư mục con.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={uploadMutation.isLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={uploadMutation.isLoading}
                className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {uploadMutation.isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    {editId ? 'Đang cập nhật...' : 'Đang đăng tải...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {editId ? 'Cập nhật' : 'Đăng tải'}
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