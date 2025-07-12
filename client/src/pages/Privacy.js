import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';

const Privacy = () => {
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
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chính sách bảo mật
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 font-light">
              Bảo vệ thông tin cá nhân của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Chính sách bảo mật thông tin</h2>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-amber-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Cam kết bảo mật</h3>
              </div>
              <p className="text-gray-700">
                UBND TỈNH ĐỒNG THÁP - SỞ GIÁO DỤC & ĐÀO TẠO cam kết bảo vệ thông tin cá nhân 
                của người dùng theo quy định của pháp luật Việt Nam.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">1. Thông tin chúng tôi thu thập</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Thông tin cá nhân:</strong> Họ tên, email, trường học, vai trò (giáo viên/học sinh)
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Thông tin sử dụng:</strong> Lịch sử đăng nhập, tài liệu đã tải, hoạt động trên hệ thống
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Thông tin kỹ thuật:</strong> IP address, trình duyệt, thiết bị sử dụng
                </div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">2. Mục đích sử dụng thông tin</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Cung cấp dịch vụ giáo dục và quản lý tài liệu</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Xác thực và phân quyền người dùng</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Liên lạc và hỗ trợ người dùng khi cần thiết</div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">3. Bảo vệ thông tin</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Mã hóa dữ liệu</h4>
                <p className="text-gray-600 text-sm">
                  Tất cả thông tin được mã hóa SSL/TLS khi truyền tải
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Kiểm soát truy cập</h4>
                <p className="text-gray-600 text-sm">
                  Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Xác thực người dùng</h4>
                <p className="text-gray-600 text-sm">
                  Hệ thống xác thực đa lớp bảo vệ tài khoản người dùng
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">4. Chia sẻ thông tin</h3>
            <p className="text-gray-700 mb-6">
              Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba 
              mà không có sự đồng ý của bạn, trừ khi:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Được yêu cầu bởi pháp luật hoặc cơ quan có thẩm quyền</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Bảo vệ quyền lợi và an toàn của người dùng khác</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Phòng chống gian lận hoặc vi phạm pháp luật</div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">5. Quyền của người dùng</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Quyền truy cập và xem thông tin cá nhân của mình</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Quyền yêu cầu cập nhật hoặc sửa đổi thông tin</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Quyền yêu cầu xóa tài khoản và dữ liệu cá nhân</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Quyền từ chối nhận thông tin quảng cáo</div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">6. Liên hệ</h3>
            <div className="bg-gray-50 rounded-2xl p-8">
              <p className="text-gray-700 mb-4">
                Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@dongthap.edu.vn</p>
                <p><strong>Điện thoại:</strong> (0277) 3.851.234</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 text-sm">
                Chính sách này được cập nhật lần cuối vào: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 