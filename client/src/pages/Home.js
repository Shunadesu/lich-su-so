import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../styles/swiper.css';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Image, 
  Download, 
  Users, 
  ArrowRight, 
  Clock, 
  Star, 
  Shield, 
  TrendingUp,
  Award
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { contentAPI, userAPI, taxonomyAPI, getFileUrl } from '../services/api';
import StudentFeatures from '../components/StudentFeatures';

const Home = () => {
  const { user } = useAuthStore();
  
  // Banner data for swiper
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

  // Check if any teachers exist (only if user is authenticated and is a teacher)
  const { data: teachers } = useQuery(
    ['teachers-count'],
    () => userAPI.getAll({ role: 'teacher' }),
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!user && user?.role === 'teacher' // Only run query if user is authenticated AND is a teacher
    }
  );

  const hasTeachers = teachers?.data && teachers.data.length > 0;
  const isTeacher = user?.role === 'teacher';

  // Taxonomy for dynamic classes
  const { data: taxonomyData } = useQuery(
    ['taxonomy'],
    () => taxonomyAPI.getTree(),
    { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const grades = taxonomyData?.data?.data || [];

  const mapGradeSlugToPath = (slug) => {
    const mapping = {
      'lop-10': '/lich-su-10',
      'lop-11': '/lich-su-11',
      'lop-12': '/lich-su-12',
    };
    return mapping[slug] || '/content';
  };

  const dynamicCategories = grades.map((g, idx) => ({
    id: g.slug,
    title: `Lịch sử ${g.name}`,
    description: `Tài liệu học tập môn ${g.name}`,
    icon: BookOpen,
    color: [
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-amber-600 to-orange-700',
      'bg-gradient-to-br from-amber-700 to-orange-800',
      'bg-gradient-to-br from-amber-800 to-orange-900',
    ][idx % 4],
    link: mapGradeSlugToPath(g.slug),
    topics: g.topics || [],
  }));


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
      description: 'Có thể tải về'
    },
    { 
      label: 'Người dùng', 
      icon: Users,
      color: 'bg-indigo-500',
      description: 'Quản lý người dùng'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Bảo mật cao',
      description: 'Hệ thống bảo mật đa lớp, đảm bảo an toàn thông tin người dùng',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Cập nhật liên tục',
      description: 'Nội dung được cập nhật thường xuyên với tài liệu mới nhất',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Truy cập 24/7',
      description: 'Học tập mọi lúc, mọi nơi với hệ thống hoạt động liên tục',
      color: 'text-orange-600'
    },
    {
      icon: Star,
      title: 'Chất lượng cao',
      description: 'Tài liệu được kiểm duyệt kỹ lưỡng, đảm bảo chất lượng',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Swiper Background */}
      <section className="relative text-white overflow-hidden min-h-screen">
        {/* Swiper Background */}
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

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
 
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-44">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo and Title */}
            
            <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 absolute top-5 right-0">
              <div className="flex items-center justify-center">
                <div className="text-right">
                  <h2 className="text-2xl font-bold">Dữ liệu Lịch sử số</h2>
                  <h3 className="text-lg font-semibold text-amber-100">SỞ GIÁO DỤC & ĐÀO TẠO</h3>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center ml-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            

            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                Lịch Sử Số
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-100 font-light">
                Biết quá khứ, thắp sáng hiện tại, mở lối tương lai
              </p>
            </div>

            {/* Government Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 md:absolute md:top-5 md:left-0 mb-4 md:mb-0">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold">UBND TỈNH ĐỒNG THÁP</h2>
                  <h3 className="text-lg font-semibold text-amber-100">SỞ GIÁO DỤC & ĐÀO TẠO TỈNH ĐỒNG THÁP</h3>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  {/* <div className="text-2xl font-bold mb-1">{stat.value}</div> */}
                  <div className="text-sm text-amber-100 font-medium">{stat.label}</div>
                  <div className="text-xs text-amber-200 mt-1">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/content"
                className="bg-white text-amber-900 px-8 py-4 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Khám phá tài liệu
                </div>
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-amber-900 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <Users className="h-5 w-5 mr-2" />
                    Đăng ký ngay
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      

      {/* Create First Teacher Section */}
      {user && !hasTeachers && !isTeacher && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Thiết lập hệ thống
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Hệ thống chưa có tài khoản giáo viên nào. Bạn có muốn tạo tài khoản giáo viên đầu tiên để quản lý hệ thống?
                </p>
                <Link
                  to="/create-first-teacher"
                  className="inline-flex items-center bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Tạo tài khoản giáo viên
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Student Features Section */}
      {user && !isTeacher && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <StudentFeatures />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Danh mục tài liệu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá kho tài liệu phong phú được tổ chức theo từng lớp học và chủ đề
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dynamicCategories.map((category) => (
              <Link
                key={category.id}
                to={category.link || `/${category.id}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden h-full"
              >
                <div className="flex flex-col h-full">
                  <div className={`${category.color} text-white p-8 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative">
                      <category.icon className="h-16 w-16 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-center mb-2">{category.title}</h3>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col p-8">
                    <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                    {category.topics && category.topics.length > 0 && (
                      <ul className="space-y-1 mb-4">
                        {category.topics.map((topic) => (
                          <li
                            key={topic._id}
                            className="text-sm text-gray-500 line-clamp-1"
                            title={topic.name}
                          >
                            {topic.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between text-amber-600 font-semibold group-hover:text-amber-700 border-t border-gray-100">
                      <span>Xem chi tiết</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
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


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-950 to-orange-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Bắt đầu hành trình học tập ngay hôm nay
            </h2>
            <p className="text-xl mb-12 text-amber-100 leading-relaxed">
              Tham gia cộng đồng học tập lịch sử trực tuyến với hàng nghìn tài liệu chất lượng cao
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/content"
                className="bg-white text-amber-900 px-8 py-4 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Khám phá tài liệu
                </div>
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-amber-900 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <Users className="h-5 w-5 mr-2" />
                    Đăng ký miễn phí
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 