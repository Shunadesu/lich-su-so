import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
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
  Award,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { contentAPI, userAPI } from '../services/api';

const Home = () => {
  const { user } = useAuthStore();
  
  // Banner data for swiper
  const banners = [
    {
      id: 1,
      title: 'Chào mừng đến với Lịch Sử Số',
      subtitle: 'Nền tảng giáo dục lịch sử trực tuyến hàng đầu',
      description: 'Khám phá kho tài liệu phong phú với hơn 650+ tài liệu chất lượng cao',
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

  // Default activities for fallback
  const defaultActivities = [
    {
      type: 'upload',
      title: 'Bài giảng mới về Cách mạng tháng 8',
      author: 'Cô Nguyễn Thị Mai',
      time: '2 giờ trước',
      category: 'Lịch sử 12'
    },
    {
      type: 'download',
      title: 'Tư liệu về Đồng Tháp xưa',
      author: 'Thầy Trần Văn Nam',
      time: '4 giờ trước',
      category: 'Lịch sử địa phương'
    },
    {
      type: 'upload',
      title: 'Video tư liệu về chiến dịch Điện Biên Phủ',
      author: 'Cô Lê Thị Hoa',
      time: '6 giờ trước',
      category: 'Lịch sử 12'
    }
  ];
  
  // Check if any teachers exist (only if user is authenticated)
  const { data: teachers } = useQuery(
    ['teachers-count'],
    () => userAPI.getAll({ role: 'teacher' }),
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!user // Only run query if user is authenticated
    }
  );

  const hasTeachers = teachers?.data && teachers.data.length > 0;
  const isTeacher = user?.role === 'teacher';

  // Use React Query for recent activities
  const { data: recentActivitiesData, isLoading: activitiesLoading, error: activitiesError } = useQuery(
    ['recent-activities'],
    async () => {
      const response = await contentAPI.getRecentActivities({ limit: 6 });
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 429 (rate limit) errors
        if (error?.response?.status === 429) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        console.error('Error fetching recent activities:', error);
        if (error?.response?.status === 429) {
          console.warn('Rate limited - using fallback data');
        }
      }
    }
  );

  // Use fallback data if API fails
  const recentActivities = recentActivitiesData || defaultActivities;

  const categories = [
    {
      id: 'lich-su-10',
      title: 'Lịch sử 10',
      description: 'Tài liệu học tập môn Lịch sử lớp 10',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      subCategories: [
        'Bài giảng điện tử',
        'Kế hoạch bài dạy',
        'Tư liệu lịch sử gốc',
        'Video',
        'Hình ảnh',
        'Bài kiểm tra'
      ],
      count: '150+'
    },
    {
      id: 'lich-su-11',
      title: 'Lịch sử 11',
      description: 'Tài liệu học tập môn Lịch sử lớp 11',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-amber-600 to-orange-700',
      subCategories: [
        'Bài giảng điện tử',
        'Kế hoạch bài dạy',
        'Tư liệu lịch sử gốc',
        'Video',
        'Hình ảnh',
        'Bài kiểm tra'
      ],
      count: '180+'
    },
    {
      id: 'lich-su-12',
      title: 'Lịch sử 12',
      description: 'Tài liệu học tập môn Lịch sử lớp 12',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-amber-700 to-orange-800',
      subCategories: [
        'Bài giảng điện tử',
        'Kế hoạch bài dạy',
        'Tư liệu lịch sử gốc',
        'Video',
        'Hình ảnh',
        'Bài kiểm tra',
        'Ôn thi TNTHPT'
      ],
      count: '200+'
    },
    {
      id: 'lich-su-dia-phuong',
      title: 'Lịch sử địa phương',
      description: 'Tài liệu về lịch sử, văn hóa địa phương',
      icon: Award,
      color: 'bg-gradient-to-br from-amber-800 to-orange-900',
      subCategories: [
        'Lịch sử Mỹ Tho',
        'Lịch sử Tiền Giang',
        'Lịch sử cách mạng địa phương',
        'Danh nhân địa phương',
        'Văn hóa truyền thống'
      ],
      count: '120+'
    }
  ];

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
      <section className="relative text-white overflow-hidden">
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

        <div className="relative z-20 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo and Title */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                Lịch Sử Số
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-100 font-light">
                Nền tảng giáo dục lịch sử trực tuyến hàng đầu
              </p>
            </div>
            
            {/* Government Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold">UBND TỈNH ĐỒNG THÁP</h2>
                  <h3 className="text-lg font-semibold text-amber-100">SỞ GIÁO DỤC & ĐÀO TẠO</h3>
                </div>
              </div>
              <p className="text-amber-100 text-lg">
                Hệ thống quản lý và chia sẻ tài liệu giáo dục lịch sử chính thức
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
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
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/${category.id}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`${category.color} text-white p-8 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <category.icon className="h-16 w-16 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-center mb-2">{category.title}</h3>
                    <div className="text-center text-amber-100 font-semibold">{category.count} tài liệu</div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                  <ul className="space-y-3 mb-6">
                    {category.subCategories.slice(0, 4).map((sub, index) => (
                      <li key={index} className="text-sm text-gray-500 flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        {sub}
                      </li>
                    ))}
                    {category.subCategories.length > 4 && (
                      <li className="text-sm text-amber-600 font-medium">
                        +{category.subCategories.length - 4} mục khác
                      </li>
                    )}
                  </ul>
                  <div className="flex items-center justify-between text-amber-600 font-semibold group-hover:text-amber-700">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
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

      {/* Recent Activities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hoạt động gần đây
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Theo dõi những hoạt động mới nhất trong cộng đồng học tập
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {activitiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(recentActivities) && recentActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentActivities.map((activity, index) => {
                  console.log(recentActivities);
                  // Format time from API data
                  const formatTime = (timeString) => {
                    if (!timeString) return 'Vừa xong';
                    
                    const time = new Date(timeString);
                    const now = new Date();
                    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
                    
                    if (diffInHours < 1) return 'Vừa xong';
                    if (diffInHours < 24) return `${diffInHours} giờ trước`;
                    
                    const diffInDays = Math.floor(diffInHours / 24);
                    if (diffInDays < 7) return `${diffInDays} ngày trước`;
                    
                    return time.toLocaleDateString('vi-VN');
                  };

                  return (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                          activity.type === 'upload' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {activity.type === 'upload' ? (
                            <FileText className="h-6 w-6 text-green-600" />
                          ) : (
                            <Download className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${
                            activity.type === 'upload' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {activity.type === 'upload' ? 'Đăng tải mới' : 'Tải về'}
                          </div>
                          <div className="text-xs text-gray-500">{formatTime(activity.time)}</div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {activity.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{activity.author}</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                          {activity.category}
                        </span>
                      </div>
                      {activity.downloadCount && (
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <Download className="h-3 w-3 mr-1" />
                          {activity.downloadCount} lượt tải
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : activitiesError ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">⚠️</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {activitiesError?.response?.status === 429 
                    ? 'Tạm thời không thể tải dữ liệu' 
                    : 'Có lỗi xảy ra'
                  }
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {activitiesError?.response?.status === 429 
                    ? 'Hệ thống đang bận, vui lòng thử lại sau vài phút.'
                    : 'Không thể tải thông tin hoạt động gần đây. Vui lòng thử lại.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/content"
                    className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Khám phá tài liệu
                  </Link>
                  {user && (
                    <Link
                      to="/upload"
                      className="inline-flex items-center border border-amber-300 text-amber-700 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Đăng tải tài liệu
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">📚</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Chưa có hoạt động nào
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Hệ thống chưa có hoạt động nào được ghi nhận. Hãy là người đầu tiên đăng tải tài liệu!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/content"
                    className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Khám phá tài liệu
                  </Link>
                  {user && (
                    <Link
                      to="/upload"
                      className="inline-flex items-center border border-amber-300 text-amber-700 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Đăng tải tài liệu
                    </Link>
                  )}
                </div>
              </div>
            )}
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