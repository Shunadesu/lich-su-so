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
  Phone,
  Mail,
  FileText,
  Video,
  Image,
  Download
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
// import useScrollToTop from '../hooks/useScrollToTop';

const About = () => {
  // const { scrollToSection } = useScrollToTop();

  const stats = [
    { 
      label: 'Tài liệu', 
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Tài liệu đa dạng'
    },
    { 
      label: 'Video', 
      icon: Video,
      color: 'bg-red-500',
      description: 'Video học tập'
    },
    { 
      label: 'Hình ảnh', 
      icon: Image,
      color: 'bg-green-500',
      description: 'Hình ảnh tư liệu'
    },
    { 
      label: 'Lượt tải', 
      icon: Download,
      color: 'bg-purple-500',
      description: 'Lượt tải về'
    },
    { 
      label: 'Người dùng', 
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


   const banners = [
    {
      id: 1,
      title: 'Chào mừng đến với Lịch Sử Số',
      subtitle: 'Nền tảng giáo dục lịch sử trực tuyến',
      description: 'Khám phá kho tài liệu phong phú với tài liệu chất lượng cao',
      image: 'https://biowish.vn/wp-content/uploads/2017/08/resources-banner-1.jpg',
      buttonText: 'Khám phá ngay',
      buttonLink: '/content'
    },
    {
      id: 2,
      title: 'Tài liệu Lịch sử 12',
      subtitle: 'Ôn thi THPT Quốc Gia',
      description: 'Bộ tài liệu chuyên sâu phục vụ ôn thi tốt nghiệp THPT môn Lịch sử',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2028&q=80',
      buttonText: 'Xem tài liệu',
      buttonLink: '/lich-su-12'
    },
    {
      id: 3,
      title: 'Lịch sử Địa phương',
      subtitle: 'Văn hóa Tiền Giang',
      description: 'Tìm hiểu về lịch sử, văn hóa và danh nhân của vùng đất Tiền Giang',
      image: 'https://img.lovepik.com/bg/20231218/Antique-Library-Bookshelf-with-Books-A-Stunning-Background_2639167_wh860.jpg!/fw/860',
      buttonText: 'Tìm hiểu thêm',
      buttonLink: '/lich-su-dia-phuong'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white">
        
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, EffectFade]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="fade"
            className="hero-swiper"
            loop={true}
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-full">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-950/80 via-amber-900/70 to-orange-950/80"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
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
              Nền tảng giáo dục lịch sử trực tuyến
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">UBND TỈNH ĐỒNG THÁP</h2>
              <h3 className="text-lg font-semibold text-amber-100 mb-4">SỞ GIÁO DỤC & ĐÀO TẠO</h3>
              <p className="text-amber-100 text-lg">
                Hệ thống quản lý và chia sẻ tài liệu giáo dục lịch sử
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
                <Phone className="h-8 w-8 text-amber-300 mr-4" />
                <div className="text-left">
                  <p className="font-semibold">Điện thoại</p>
                
                  <p className="text-amber-100">098 458 0434</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Phone className="h-8 w-8 text-amber-300 mr-4" />
                <div className="text-left">
                  <p className="font-semibold">Điện thoại</p>
                  
                  <p className="text-amber-100">098 458 0434</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Mail className="h-8 w-8 text-amber-300 mr-4" />
                <div className="text-left">
                  <p className="font-semibold">Email</p>
                  <p className="text-amber-100">honhan.080305@gmail.com</p>
                
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