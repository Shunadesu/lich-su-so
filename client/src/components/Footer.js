import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  Facebook, 
  Award,
  Shield,
  Users,
  FileText
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tài liệu', path: '/content' },
    { name: 'Đăng ký', path: '/register' },
    { name: 'Đăng nhập', path: '/login' },
    { name: 'Về chúng tôi', path: '/about' },
    { name: 'Liên hệ', path: '/contact' }
  ];

  const categories = [
    { name: 'Lịch sử 10', path: '/lich-su-10' },
    { name: 'Lịch sử 11', path: '/lich-su-11' },
    { name: 'Lịch sử 12', path: '/lich-su-12' },
    { name: 'Lịch sử địa phương', path: '/lich-su-dia-phuong' }
  ];

  const features = [
    { icon: FileText, name: 'Tài liệu đa dạng', desc: 'Tài liệu chất lượng' },
    { icon: Shield, name: 'Bảo mật cao', desc: 'Hệ thống bảo mật đa lớp' },
    { icon: Users, name: 'Cộng đồng', desc: 'Người dùng hoạt động' },
    { icon: Award, name: 'Chất lượng', desc: 'Nội dung được kiểm duyệt' }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: 'https://www.facebook.com/Hothenhan.835' },
    { icon: Phone, name: 'Phone', url: 'tel:0978617277' },
    { icon: Mail, name: 'Email', url: 'mailto:mahonhan.080305@gmail.com' }
  ];
  

  return (
    <footer className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Lịch Sử Số</h3>
                <p className="text-amber-100 text-sm">Nền tảng giáo dục lịch sử</p>
              </div>
            </div>
            <p className="text-amber-100 mb-6 leading-relaxed">
              Hệ thống quản lý và chia sẻ tài liệu giáo dục lịch sử của UBND TỈNH ĐỒNG THÁP - SỞ GIÁO DỤC & ĐÀO TẠO.
            </p>
            
            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-amber-100">
                  <feature.icon className="h-4 w-4 mr-3 text-amber-300" />
                  <div>
                    <div className="text-sm font-medium">{feature.name}</div>
                    <div className="text-xs text-amber-200">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-amber-100 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <div className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:bg-white transition-colors"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Danh mục</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="text-amber-100 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <div className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:bg-white transition-colors"></div>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Liên hệ</h4>
            <div className="space-y-4">
             
              
              <div className="flex items-center">
                
                <div className="flex flex-col gap-2">
                  <p className="text-amber-100 font-medium">Điện thoại</p>
                  <div className="flex items-center mb-2">
                    <Phone className="h-5 w-5 text-amber-300 mr-3 flex-shrink-0" />
                    <p className="text-amber-200 text-sm">097 861 7277</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-amber-300 mr-3 flex-shrink-0" />
                    <p className="text-amber-200 text-sm">098 458 0434</p>
                  </div>
                </div>
              </div>

              
              
              <div className="flex items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-amber-100 font-medium">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-amber-300 mr-3 flex-shrink-0" />
                    <p className="text-amber-200 text-sm">honhan.080305@gmail.com</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-amber-300 mr-3 flex-shrink-0" />
                    <p className="text-amber-200 text-sm">vantanhd2019@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h5 className="text-lg font-medium mb-4 text-white">Theo dõi chúng tôi</h5>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="h-5 w-5 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-amber-100 text-sm mb-4 md:mb-0">
              © {currentYear} <span className="font-semibold">Lịch Sử Số</span>. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-amber-100 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link to="/help" className="hover:text-white transition-colors">
                Trợ giúp
              </Link>
              <Link to="/feedback" className="hover:text-white transition-colors">
                Góp ý
              </Link>
            </div>
          </div>
          
          {/* Government Info */}
          <div className="mt-4 pt-4 border-t border-amber-700/30 text-center">
            <div className="text-amber-200 text-sm">
              <p className="font-semibold">UBND TỈNH ĐỒNG THÁP - SỞ GIÁO DỤC & ĐÀO TẠO</p>
              <p className="text-xs mt-1">Hệ thống quản lý tài liệu giáo dục lịch sử</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 