import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: 'Số 1, Đường 30/4, TP. Cao Lãnh, Tỉnh Đồng Tháp, Việt Nam',
      color: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: '(0277) 3.851.234',
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@dongthap.edu.vn',
      color: 'text-red-600'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6: 7:30 - 17:00',
      color: 'text-purple-600'
    }
  ];

  const departments = [
    {
      name: 'Phòng Giáo dục Trung học',
      phone: '(0277) 3.851.235',
      email: 'gdth@dongthap.edu.vn'
    },
    {
      name: 'Phòng Giáo dục Tiểu học',
      phone: '(0277) 3.851.236',
      email: 'gdth@dongthap.edu.vn'
    },
    {
      name: 'Phòng Khảo thí và Kiểm định',
      phone: '(0277) 3.851.237',
      email: 'ktkd@dongthap.edu.vn'
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
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 font-light">
              Hãy để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất
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

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Thông tin liên hệ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Liên hệ trực tiếp với chúng tôi qua các kênh sau
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <info.icon className={`h-8 w-8 ${info.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{info.title}</h3>
                <p className="text-gray-600 leading-relaxed">{info.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Departments */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="text-gray-600 mb-8">
                Hãy điền form bên dưới để gửi tin nhắn, câu hỏi hoặc góp ý. 
                Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="Nhập tiêu đề tin nhắn"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Nhập nội dung tin nhắn..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Departments */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Các phòng ban
              </h2>
              <p className="text-gray-600 mb-8">
                Liên hệ trực tiếp với các phòng ban chuyên môn để được hỗ trợ tốt nhất.
              </p>
              
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{dept.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-amber-600" />
                        <span>{dept.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-amber-600" />
                        <span>{dept.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Câu hỏi thường gặp
                </h3>
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Làm thế nào để đăng ký tài khoản?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Bạn có thể đăng ký tài khoản tại trang Đăng ký. Học sinh chỉ cần email và thông tin cơ bản, 
                      giáo viên cần được phê duyệt bởi admin.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Tôi có thể đăng tải tài liệu không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Giáo viên có thể đăng tải tất cả loại tài liệu. Học sinh chỉ được đăng tải sản phẩm học tập.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Hệ thống có miễn phí không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Hoàn toàn miễn phí! Đây là hệ thống giáo dục chính thức của UBND Tỉnh Đồng Tháp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Vị trí của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trụ sở chính tại TP. Cao Lãnh, Tỉnh Đồng Tháp
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Bản đồ sẽ được hiển thị tại đây</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Số 1, Đường 30/4, TP. Cao Lãnh, Tỉnh Đồng Tháp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 