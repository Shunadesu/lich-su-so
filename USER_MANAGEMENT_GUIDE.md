# Hướng dẫn Quản lý Người dùng

## Tổng quan

Hệ thống Lịch Sử Số đã được cập nhật với tính năng quản lý người dùng toàn diện cho giáo viên. Giáo viên có thể xem, tạo, chỉnh sửa, khóa/mở khóa và xóa tài khoản của tất cả người dùng trong hệ thống.

## Tính năng mới

### 1. Đăng ký với vai trò tùy chọn

- Người dùng có thể chọn vai trò "Học sinh" hoặc "Giáo viên" khi đăng ký
- Không còn giới hạn chỉ đăng ký tài khoản học sinh
- Giáo viên sẽ có quyền quản lý hệ thống ngay sau khi đăng ký

### 2. Quản lý người dùng cho giáo viên

- **Xem danh sách**: Tất cả người dùng trong hệ thống
- **Tìm kiếm**: Theo tên, email, số điện thoại
- **Lọc**: Theo vai trò (học sinh/giáo viên) và trạng thái (hoạt động/đã khóa)
- **Thống kê**: Số lượng người dùng theo vai trò và trạng thái

### 3. Thao tác quản lý

- **Tạo người dùng mới**: Thêm học sinh hoặc giáo viên mới
- **Chỉnh sửa thông tin**: Cập nhật thông tin cá nhân, vai trò
- **Khóa/Mở khóa**: Kích hoạt hoặc vô hiệu hóa tài khoản
- **Đổi mật khẩu**: Reset mật khẩu cho người dùng khác
- **Xóa tài khoản**: Xóa vĩnh viễn tài khoản (có xác nhận)

## Cách sử dụng

### Truy cập trang quản lý người dùng

1. Đăng nhập với tài khoản giáo viên
2. Nhấp vào "Quản lý người dùng" trong header
3. Hoặc truy cập trực tiếp: `/user-management`

### Tìm kiếm và lọc

- **Tìm kiếm**: Nhập từ khóa vào ô tìm kiếm để tìm theo tên, email, số điện thoại
- **Lọc theo vai trò**: Chọn "Giáo viên" hoặc "Học sinh" để lọc
- **Lọc theo trạng thái**: Chọn "Đang hoạt động" hoặc "Đã khóa"

### Tạo người dùng mới

1. Nhấp vào nút "Thêm người dùng mới"
2. Điền thông tin bắt buộc:
   - Họ tên
   - Số điện thoại
   - Mật khẩu
   - Vai trò (học sinh/giáo viên)
3. Điền thông tin tùy chọn:
   - Email
   - Trường học
   - Lớp
4. Chọn trạng thái tài khoản (mặc định: hoạt động)
5. Nhấp "Tạo người dùng"

### Chỉnh sửa người dùng

1. Nhấp vào biểu tượng chỉnh sửa (✏️) bên cạnh người dùng
2. Cập nhật thông tin cần thiết
3. Nhấp "Lưu thay đổi"

### Khóa/Mở khóa tài khoản

1. Nhấp vào biểu tượng mắt (👁️) bên cạnh người dùng
2. Xác nhận hành động trong hộp thoại
3. Tài khoản sẽ được khóa hoặc mở khóa

### Xóa người dùng

1. Nhấp vào biểu tượng thùng rác (🗑️) bên cạnh người dùng
2. Xác nhận xóa trong hộp thoại
3. **Lưu ý**: Hành động này không thể hoàn tác

## Bảo mật và quyền hạn

### Giới hạn bảo mật

- Giáo viên không thể khóa hoặc xóa tài khoản của chính mình
- Chỉ giáo viên mới có quyền truy cập trang quản lý người dùng
- Tất cả thao tác đều yêu cầu xác nhận trước khi thực hiện

### Quyền hạn theo vai trò

- **Giáo viên**: Toàn quyền quản lý hệ thống
- **Học sinh**: Chỉ có thể quản lý nội dung của mình

## Thống kê và báo cáo

### Dashboard thống kê

- **Tổng số người dùng**: Tổng cộng tất cả người dùng
- **Giáo viên**: Số lượng tài khoản giáo viên
- **Học sinh**: Số lượng tài khoản học sinh
- **Đang hoạt động**: Số tài khoản đang hoạt động

### Phân tích dữ liệu

- Thống kê theo vai trò
- Thống kê theo trạng thái
- Theo dõi ngày tạo tài khoản

## Lưu ý quan trọng

### Trước khi thực hiện thao tác

1. **Sao lưu dữ liệu**: Đảm bảo có bản sao lưu trước khi xóa người dùng
2. **Kiểm tra quyền**: Xác nhận bạn có quyền thực hiện thao tác
3. **Thông báo**: Thông báo cho người dùng trước khi khóa tài khoản

### Xử lý lỗi

- Nếu gặp lỗi khi tạo người dùng, kiểm tra số điện thoại đã tồn tại chưa
- Nếu không thể khóa tài khoản, kiểm tra xem có phải tài khoản của chính mình không
- Nếu gặp lỗi mạng, thử lại sau vài giây

### Hỗ trợ

Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:

- Email: support@lichsuso.com
- Hotline: 1900-xxxx
- Hoặc tạo ticket hỗ trợ trong hệ thống

## Cập nhật hệ thống

### Phiên bản mới

- Hỗ trợ đăng ký với vai trò tùy chọn
- Giao diện quản lý người dùng hiện đại
- Tính năng tìm kiếm và lọc nâng cao
- Bảo mật và xác thực cải thiện

### Tương lai

- Xuất báo cáo PDF/Excel
- Gửi email thông báo tự động
- Phân quyền chi tiết hơn
- Lịch sử hoạt động người dùng
