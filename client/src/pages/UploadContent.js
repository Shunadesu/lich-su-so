import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Tag } from 'lucide-react';
import { contentAPI } from '../services/api';
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
    category: 'lich-su-10',
    subCategory: 'bai-giang-dien-tu',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Fetch content for editing
  const { isLoading: isLoadingEdit } = useQuery(
    ['content', editId],
    () => contentAPI.getById(editId),
    {
      enabled: !!editId,
      onSuccess: (data) => {
        const content = data.data;
        setFormData({
          title: content.title,
          description: content.description || '',
          category: content.category,
          subCategory: content.subCategory,
          tags: content.tags || []
        });
      }
    }
  );

  const uploadMutation = useMutation(
    (data) => editId ? contentAPI.update(editId, data) : contentAPI.create(data),
    {
      onSuccess: () => {
        // Invalidate and refetch queries
        queryClient.invalidateQueries(['contents']);
        queryClient.invalidateQueries(['teacher-dashboard']);
        queryClient.invalidateQueries(['recent-activities']);
        queryClient.invalidateQueries(['content']);
        
        toast.success(editId ? 'Cập nhật thành công!' : 'Đăng tải thành công!');
        navigate('/');
      },
      onError: (error) => {
        console.error('Upload error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
        if (error.response?.data?.errors) {
          // Validation errors
          const errors = error.response.data.errors;
          console.log('Validation errors:', errors);
          errors.forEach(err => {
            toast.error(`${err.param}: ${err.msg}`);
          });
        } else if (error.response?.data?.message) {
          // Server error message
          console.log('Server error message:', error.response.data.message);
          toast.error(error.response.data.message);
        } else if (error.message) {
          // Network or other error
          console.log('Network error:', error.message);
          toast.error(error.message);
        } else {
          console.log('Unknown error');
          toast.error('Có lỗi xảy ra khi đăng tải');
        }
      }
    }
  );

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  }, []);

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
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Reset subCategory when category changes
      const newSubCategories = getSubCategories(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subCategory: newSubCategories.length > 0 ? newSubCategories[0].value : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    
    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Uploaded file:', uploadedFile);
    console.log('Edit ID:', editId);
    console.log('User role:', user?.role);
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    if (!uploadedFile && !editId) {
      toast.error('Vui lòng chọn file để đăng tải');
      return;
    }

    // Check student permissions
    if (isStudent() && formData.subCategory !== 'san-pham-hoc-tap') {
      toast.error('Học sinh chỉ được đăng tải sản phẩm học tập');
      return;
    }

    // Additional validation
    if (!formData.category) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    if (!formData.subCategory) {
      toast.error('Vui lòng chọn thư mục con');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('category', formData.category);
    submitData.append('subCategory', formData.subCategory);
    submitData.append('tags', formData.tags.join(','));
    
    if (uploadedFile) {
      submitData.append('file', uploadedFile);
    }

    console.log('Submitting form data:', {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      subCategory: formData.subCategory,
      tags: formData.tags,
      hasFile: !!uploadedFile
    });

    uploadMutation.mutate(submitData);
  };

  const getSubCategories = (category) => {
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
    return subCategories[category] || [];
  };

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
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File tài liệu {!editId && '*'}
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Thả file vào đây...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Kéo thả file vào đây, hoặc <span className="text-blue-600">chọn file</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Hỗ trợ: PDF, PPT, DOC, MP4, JPG, PNG, TXT (Tối đa 50MB)
                    </p>
                  </div>
                )}
              </div>
              
              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">{uploadedFile.name}</span>
                      <span className="text-xs text-green-600 ml-2">
                        ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề tài liệu"
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả tài liệu (không bắt buộc)"
              />
            </div>

            {/* Category and SubCategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục chính *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lich-su-10">Lịch sử 10</option>
                  <option value="lich-su-11">Lịch sử 11</option>
                  <option value="lich-su-12">Lịch sử 12</option>
                  <option value="lich-su-dia-phuong">Lịch sử địa phương</option>
                </select>
              </div>

              <div>
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Thư mục con *
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {getSubCategories(formData.category).map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
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
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
                              <button
                  type="submit"
                  disabled={uploadMutation.isLoading}
                  className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                {uploadMutation.isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editId ? 'Đang cập nhật...' : 'Đang đăng tải...'}
                  </div>
                ) : (
                  editId ? 'Cập nhật' : 'Đăng tải'
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