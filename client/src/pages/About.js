import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Users, 
  Shield, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  FileText,
  Video,
  Image,
  Download
} from 'lucide-react';
// import useScrollToTop from '../hooks/useScrollToTop';

const About = () => {
  // const { scrollToSection } = useScrollToTop();

  const stats = [
    { 
      label: 'Tài liệu', 
      value: '650+', 
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Tài liệu đa dạng'
    },
    { 
      label: 'Video', 
      value: '150+', 
      icon: Video,
      color: 'bg-red-500',
      description: 'Video học tập'
    },
    { 
      label: 'Hình ảnh', 
      value: '1200+', 
      icon: Image,
      color: 'bg-green-500',
      description: 'Hình ảnh tư liệu'
    },
    { 
      label: 'Lượt tải', 
      value: '15K+', 
      icon: Download,
      color: 'bg-purple-500',
      description: 'Lượt tải về'
    },
    { 
      label: 'Người dùng', 
      value: '2500+', 
      icon: Users,
      color: 'bg-indigo-500',
      description: 'Người dùng hoạt động'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Bảo mật cao',
      description: 'Hệ thống bảo mật đa lớp, đảm bảo an toàn thông tin người dùng và tài liệu giáo dục',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Cập nhật liên tục',
      description: 'Nội dung được cập nhật thường xuyên với tài liệu mới nhất từ các giáo viên',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Truy cập 24/7',
      description: 'Học tập mọi lúc, mọi nơi với hệ thống hoạt động liên tục và ổn định',
      color: 'text-orange-600'
    },
    {
      icon: Star,
      title: 'Chất lượng cao',
      description: 'Tài liệu được kiểm duyệt kỹ lưỡng, đảm bảo chất lượng giáo dục',
      color: 'text-yellow-600'
    }
  ];

  const team = [
    {
      name: 'UBND TỈNH ĐỒNG THÁP',
      role: 'Chủ quản',
      description: 'Cơ quan quản lý nhà nước cấp tỉnh, chịu trách nhiệm về giáo dục và đào tạo'
    },
    {
      name: 'SỞ GIÁO DỤC & ĐÀO TẠO',
      role: 'Đơn vị thực hiện',
      description: 'Cơ quan chuyên môn thuộc UBND tỉnh, quản lý nhà nước về giáo dục'
    },
    {
      name: 'Đội ngũ giáo viên',
      role: 'Nội dung',
      description: 'Các giáo viên lịch sử có kinh nghiệm, tạo ra tài liệu chất lượng cao'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-amber-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại trang chủ
            </Link>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Về Lịch Sử Số
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 font-light">
              Nền tảng giáo dục lịch sử trực tuyến hàng đầu
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">UBND TỈNH ĐỒNG THÁP</h2>
              <h3 className="text-lg font-semibold text-amber-100 mb-4">SỞ GIÁO DỤC & ĐÀO TẠO</h3>
              <p className="text-amber-100 text-lg">
                Hệ thống quản lý và chia sẻ tài liệu giáo dục lịch sử chính thức
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              Lịch Sử Số được thành lập với sứ mệnh xây dựng một nền tảng giáo dục lịch sử 
              hiện đại, chất lượng cao, phục vụ cho việc học tập và giảng dạy môn Lịch sử 
              tại tỉnh Đồng Tháp và cả nước.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Giáo dục chất lượng</h3>
                <p className="text-gray-600">
                  Cung cấp tài liệu học tập chất lượng cao, được kiểm duyệt kỹ lưỡng 
                  bởi đội ngũ giáo viên có kinh nghiệm.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Cộng đồng học tập</h3>
                <p className="text-gray-600">
                  Xây dựng cộng đồng học tập sôi động, nơi giáo viên và học sinh 
                  có thể chia sẻ, trao đổi kiến thức.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Đổi mới giáo dục</h3>
                <p className="text-gray-600">
                  Áp dụng công nghệ hiện đại để đổi mới phương pháp dạy và học 
                  môn Lịch sử, nâng cao hiệu quả giáo dục.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Thống kê ấn tượng
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con số thể hiện sự phát triển và uy tín của hệ thống
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống được thiết kế với những tính năng hiện đại, đáp ứng mọi nhu cầu học tập
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-100 transition-all duration-300`}>
                  <feature.icon className={`h-10 w-10 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ thực hiện
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những đơn vị và cá nhân đóng góp vào sự thành công của hệ thống
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 text-center border border-amber-200">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{member.name}</h3>
                <p className="text-amber-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-amber-800 to-orange-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl mb-12 text-amber-100">
              Có câu hỏi hoặc góp ý? Hãy liên hệ với chúng tôi
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center">
                <MapPin className="h-8 w-8 text-amber-300 mr-4" />
                <div className="text-left">
                  <p className="font-semibold">Địa chỉ</p>
                  <p className="text-amber-100">Số 1, Đường 30/4, TP. Cao Lãnh</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Phone className="h-8 w-8 text-amber-300 mr-4" />
                <div className="text-left">
                  <p className="font-semibold">Điện thoại</p>
                  <p className="text-amber-100">(0277) 3.851.234</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Mail className="h-8 w-8 text-amber-300 mr-4" />
                <div className="text-left">
                  <p className="font-semibold">Email</p>
                  <p className="text-amber-100">info@dongthap.edu.vn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 