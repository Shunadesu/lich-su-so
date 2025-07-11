import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Image, 
  Video, 
  BookOpen, 
  Award, 
  Plus,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const StudentFeatures = () => {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      title: 'Tài liệu học tập',
      description: 'Đăng tải các tài liệu học tập, ghi chú, bài tập của bạn',
      category: 'tai-lieu-hoc-tap'
    },
    {
      icon: <Image className="h-6 w-6 text-green-600" />,
      title: 'Hình ảnh học tập',
      description: 'Chia sẻ hình ảnh từ các hoạt động học tập, dự án',
      category: 'hinh-anh-hoc-tap'
    },
    {
      icon: <Video className="h-6 w-6 text-purple-600" />,
      title: 'Video học tập',
      description: 'Đăng tải video thuyết trình, báo cáo dự án',
      category: 'video-hoc-tap'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-orange-600" />,
      title: 'Bài tập học sinh',
      description: 'Chia sẻ bài tập, bài kiểm tra của bạn',
      category: 'bai-tap-hoc-sinh'
    },
    {
      icon: <Award className="h-6 w-6 text-red-600" />,
      title: 'Dự án học tập',
      description: 'Đăng tải các dự án, sản phẩm học tập',
      category: 'du-an-hoc-tap'
    },
    {
      icon: <Award className="h-6 w-6 text-indigo-600" />,
      title: 'Sản phẩm học tập',
      description: 'Chia sẻ các sản phẩm sáng tạo trong học tập',
      category: 'san-pham-hoc-tap'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tính năng mới cho học sinh! 🎉
        </h2>
        <p className="text-gray-600">
          Bây giờ bạn có thể đăng tải nhiều loại tài liệu học tập khác nhau. Mặc định sẽ chọn "Sản phẩm học tập" cho bạn!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/upload"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Bắt đầu đăng tải</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
        
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Tất cả nội dung sẽ được giáo viên phê duyệt trước khi hiển thị</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeatures; 