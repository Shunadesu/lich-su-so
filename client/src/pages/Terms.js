import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const Terms = () => {
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
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Điều khoản sử dụng
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 font-light">
              Quy định và điều khoản khi sử dụng hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Điều khoản sử dụng hệ thống</h2>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-amber-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Điều khoản chung</h3>
              </div>
              <p className="text-gray-700">
                Bằng việc truy cập và sử dụng hệ thống Lịch Sử Số, bạn đồng ý tuân thủ 
                các điều khoản và điều kiện được nêu trong tài liệu này.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">1. Định nghĩa</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>"Hệ thống":</strong> Lịch Sử Số - nền tảng giáo dục lịch sử trực tuyến
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>"Người dùng":</strong> Giáo viên và học sinh sử dụng hệ thống
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>"Nội dung":</strong> Tài liệu, video, hình ảnh được đăng tải trên hệ thống
                </div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">2. Đăng ký và tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Được phép</h4>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• Đăng ký tài khoản với thông tin chính xác</li>
                  <li>• Sử dụng tài khoản cho mục đích giáo dục</li>
                  <li>• Bảo mật thông tin đăng nhập</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Không được phép</h4>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• Tạo tài khoản giả mạo</li>
                  <li>• Chia sẻ tài khoản với người khác</li>
                  <li>• Sử dụng cho mục đích thương mại</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">3. Quyền và nghĩa vụ</h3>
            
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Giáo viên:</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Đăng tải tài liệu giáo dục chất lượng cao</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Phê duyệt nội dung của học sinh</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Quản lý và chỉnh sửa nội dung đã đăng tải</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Hỗ trợ học sinh trong quá trình học tập</div>
              </li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-4">Học sinh:</h4>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Truy cập và tải về tài liệu học tập</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Đăng tải sản phẩm học tập của mình</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Tham gia thảo luận và chia sẻ kiến thức</div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>Tuân thủ quy định về bản quyền</div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">4. Nội dung và bản quyền</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Bản quyền:</strong> Tất cả nội dung thuộc về tác giả hoặc được sử dụng với sự cho phép
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Sử dụng hợp pháp:</strong> Chỉ sử dụng nội dung cho mục đích giáo dục
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Không sao chép:</strong> Không sao chép, phân phối lại nội dung mà không được phép
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Báo cáo vi phạm:</strong> Báo cáo ngay khi phát hiện nội dung vi phạm bản quyền
                </div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">5. Hạn chế trách nhiệm</h3>
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <p className="text-gray-700 mb-4">
                UBND TỈNH ĐỒNG THÁP - SỞ GIÁO DỤC & ĐÀO TẠO không chịu trách nhiệm về:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Nội dung do người dùng đăng tải</li>
                <li>• Lỗi kỹ thuật ngoài tầm kiểm soát</li>
                <li>• Mất mát dữ liệu do lỗi người dùng</li>
                <li>• Thiệt hại gián tiếp từ việc sử dụng hệ thống</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">6. Vi phạm và xử lý</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Cảnh báo:</strong> Vi phạm lần đầu sẽ được cảnh báo
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Tạm khóa:</strong> Vi phạm nhiều lần sẽ bị tạm khóa tài khoản
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Vĩnh viễn:</strong> Vi phạm nghiêm trọng sẽ bị khóa vĩnh viễn
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Pháp luật:</strong> Vi phạm pháp luật sẽ được báo cáo cơ quan có thẩm quyền
                </div>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">7. Thay đổi điều khoản</h3>
            <p className="text-gray-700 mb-6">
              Chúng tôi có quyền thay đổi điều khoản này bất cứ lúc nào. 
              Những thay đổi sẽ được thông báo trên hệ thống và có hiệu lực ngay khi đăng tải.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">8. Liên hệ</h3>
            <div className="bg-gray-50 rounded-2xl p-8">
              <p className="text-gray-700 mb-4">
                Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> terms@dongthap.edu.vn</p>
                <p><strong>Điện thoại:</strong> (0277) 3.851.234</p>
                <p><strong>Địa chỉ:</strong> Số 1, Đường 30/4, TP. Cao Lãnh, Tỉnh Đồng Tháp</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 text-sm">
                Điều khoản này có hiệu lực từ: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 