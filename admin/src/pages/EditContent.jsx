import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Save,
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Youtube,
  Loader,
} from 'lucide-react';
import { contentAPI, getFileUrl } from '../services/api';
import toast from 'react-hot-toast';

const EditContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    contentType: 'file',
    youtubeUrl: '',
    tags: '',
    file: null,
    bannerImage: null,
  });

  const [currentFile, setCurrentFile] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch content data
  const { data, isLoading, error } = useQuery(
    ['content', id],
    () => contentAPI.getById(id),
    {
      enabled: !!id
    }
  );

  // Populate form when data is loaded
  useEffect(() => {
    // Check different possible response structures
    const content = data?.data?.data || data?.data || data;
    
    if (content && (content._id || content.id)) {
      // Set form data with all fields
      const newFormData = {
        title: content.title || '',
        description: content.description || '',
        category: content.category || '',
        subCategory: content.subCategory || '',
        contentType: content.contentType || 'file',
        youtubeUrl: content.youtubeUrl || '',
        tags: content.tags ? (Array.isArray(content.tags) ? content.tags.join(', ') : content.tags) : '',
        file: null,
        bannerImage: null,
      };
      
      setFormData(newFormData);
      
      if (content.contentType === 'file' && content.fileUrl) {
        const fileUrl = getFileUrl(content.fileUrl);
        setCurrentFile({
          url: fileUrl,
          name: content.fileName || 'File hiện tại',
          type: content.fileType || 'other',
        });
        // Preview image if it's an image
        if (['jpg', 'jpeg', 'png'].includes(content.fileType?.toLowerCase())) {
          setPreviewUrl(fileUrl);
        }
      } else if (content.contentType === 'youtube' && content.youtubeUrl) {
        setCurrentFile(null);
        setPreviewUrl(null);
      }

      // Set banner image
      if (content.bannerImage) {
        const bannerUrl = getFileUrl(content.bannerImage);
        setCurrentBanner({
          url: bannerUrl,
          name: 'Banner hiện tại'
        });
        setBannerPreviewUrl(bannerUrl);
      }
    }
  }, [data]);

  const updateMutation = useMutation(
    (formDataToSubmit) => contentAPI.update(id, formDataToSubmit),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['content', id]);
        queryClient.invalidateQueries('admin-content');
        toast.success('Cập nhật tài liệu thành công');
        navigate('/content');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Lỗi khi cập nhật tài liệu';
        toast.error(message);
        setIsSubmitting(false);
      },
    }
  );

  const categories = [
    { value: 'lich-su-10', label: 'Lịch sử 10' },
    { value: 'lich-su-11', label: 'Lịch sử 11' },
    { value: 'lich-su-12', label: 'Lịch sử 12' },
    { value: 'lich-su-dia-phuong', label: 'Lịch sử địa phương' },
  ];

  const subCategories = {
    'lich-su-10': [
      { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
      { value: 'sach-dien-tu', label: 'Sách điện tử' },
      { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
      { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
      { value: 'tu-lieu-dien-tu', label: 'Tư liệu điện tử' },
      { value: 'video', label: 'Video' },
      { value: 'hinh-anh', label: 'Hình ảnh' },
      { value: 'bai-kiem-tra', label: 'Bài kiểm tra' },
    ],
    'lich-su-11': [
      { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
      { value: 'sach-dien-tu', label: 'Sách điện tử' },
      { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
      { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
      { value: 'tu-lieu-dien-tu', label: 'Tư liệu điện tử' },
      { value: 'video', label: 'Video' },
      { value: 'hinh-anh', label: 'Hình ảnh' },
      { value: 'bai-kiem-tra', label: 'Bài kiểm tra' },
    ],
    'lich-su-12': [
      { value: 'bai-giang-dien-tu', label: 'Bài giảng điện tử' },
      { value: 'sach-dien-tu', label: 'Sách điện tử' },
      { value: 'ke-hoach-bai-day', label: 'Kế hoạch bài dạy' },
      { value: 'tu-lieu-lich-su-goc', label: 'Tư liệu lịch sử gốc' },
      { value: 'tu-lieu-dien-tu', label: 'Tư liệu điện tử' },
      { value: 'video', label: 'Video' },
      { value: 'hinh-anh', label: 'Hình ảnh' },
      { value: 'bai-kiem-tra', label: 'Bài kiểm tra' },
      { value: 'on-thi-tnthpt', label: 'Ôn thi TNTHPT' },
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
      { value: 'du-an-hoc-tap', label: 'Dự án học tập' },
    ],
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setCurrentFile({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      });

      // Preview for images
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, bannerImage: file });
      setBannerPreviewUrl(URL.createObjectURL(file));
    }
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('subCategory', formData.subCategory);
      submitData.append('contentType', formData.contentType);

      if (formData.tags) {
        submitData.append('tags', formData.tags);
      }

      if (formData.contentType === 'youtube') {
        if (!formData.youtubeUrl) {
          toast.error('Vui lòng nhập link YouTube');
          setIsSubmitting(false);
          return;
        }
        submitData.append('youtubeUrl', formData.youtubeUrl);
      } else if (formData.contentType === 'file') {
        if (formData.file) {
          submitData.append('file', formData.file);
        }
      }

      // Append banner image if provided
      if (formData.bannerImage) {
        submitData.append('bannerImage', formData.bannerImage);
      }

      updateMutation.mutate(submitData);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Lỗi khi gửi dữ liệu');
      setIsSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Lỗi khi tải dữ liệu: {error.message}</p>
        <button
          onClick={() => navigate('/content')}
          className="text-blue-600 hover:text-blue-800"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!data?.data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Không tìm thấy nội dung</p>
        <button
          onClick={() => navigate('/content')}
          className="text-blue-600 hover:text-blue-800"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const youtubeId = formData.contentType === 'youtube' && formData.youtubeUrl
    ? extractYouTubeId(formData.youtubeUrl)
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/content')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <X className="h-5 w-5" />
          <span>Quay lại</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa tài liệu</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tiêu đề"
          />
          {!formData.title && (
            <p className="mt-1 text-xs text-gray-500">Tiêu đề hiện tại: {data?.data?.data?.title || 'Chưa có'}</p>
          )}
        </div>

        {/* Description with React Quill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            modules={quillModules}
            className="bg-white"
            style={{ minHeight: '200px' }}
          />
        </div>

        {/* Banner Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh Banner
          </label>
          <div className="space-y-4">
            {currentBanner && !formData.bannerImage && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Banner hiện tại:</p>
                <img 
                  src={currentBanner.url} 
                  alt="Current banner" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            {bannerPreviewUrl && formData.bannerImage && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Banner mới (sẽ thay thế banner cũ):</p>
                <img 
                  src={bannerPreviewUrl} 
                  alt="New banner preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <ImageIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600">
                {formData.bannerImage ? formData.bannerImage.name : 'Chọn ảnh banner (JPG, PNG, WEBP)'}
              </span>
              <input
                type="file"
                onChange={handleBannerChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500">Kích thước khuyến nghị: 1920x1080px. Tối đa 10MB.</p>
          </div>
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subCategory: '', // Reset subCategory when category changes
                });
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {!formData.category && data?.data?.data?.category && (
              <p className="mt-1 text-xs text-gray-500">Danh mục hiện tại: {data.data.data.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thư mục con <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subCategory || ''}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              required
              disabled={!formData.category}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Chọn thư mục con</option>
              {formData.category &&
                subCategories[formData.category]?.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
            </select>
            {!formData.subCategory && data?.data?.data?.subCategory && (
              <p className="mt-1 text-xs text-gray-500">Thư mục con hiện tại: {data.data.data.subCategory}</p>
            )}
          </div>
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại nội dung <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="file"
                checked={formData.contentType === 'file'}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value, youtubeUrl: '' })}
                className="w-4 h-4 text-blue-600"
              />
              <File className="h-5 w-5" />
              <span>Tải file lên</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="youtube"
                checked={formData.contentType === 'youtube'}
                onChange={(e) => {
                  setFormData({ ...formData, contentType: e.target.value, file: null });
                  setCurrentFile(null);
                  setPreviewUrl(null);
                }}
                className="w-4 h-4 text-blue-600"
              />
              <Youtube className="h-5 w-5" />
              <span>Link YouTube</span>
            </label>
          </div>
        </div>

        {/* File Upload or YouTube URL */}
        {formData.contentType === 'file' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              {currentFile && !formData.file && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{currentFile.name}</p>
                      <p className="text-sm text-gray-500">File hiện tại</p>
                    </div>
                  </div>
                  {previewUrl && !formData.file && (
                    <div className="mt-4">
                      <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg max-h-64" />
                    </div>
                  )}
                </div>
              )}
              {formData.file && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{formData.file.name}</p>
                      <p className="text-sm text-gray-500">File mới (sẽ thay thế file cũ)</p>
                    </div>
                  </div>
                  {previewUrl && formData.file && (
                    <div className="mt-4">
                      <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg max-h-64" />
                    </div>
                  )}
                </div>
              )}
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.file ? formData.file.name : 'Chọn file mới (PDF, DOCX, PPT, MP4, JPG, PNG)'}
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png,.txt"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link YouTube <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {youtubeId && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (phân cách bằng dấu phẩy)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="tag1, tag2, tag3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/content')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContent;

