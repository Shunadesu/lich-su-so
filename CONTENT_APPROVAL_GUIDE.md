# Hướng dẫn chức năng Phê duyệt bài đăng học sinh

## Tổng quan

Chức năng phê duyệt bài đăng học sinh cho phép giáo viên quản lý và kiểm duyệt nội dung do học sinh đăng tải trước khi hiển thị công khai trên hệ thống.

## Tính năng chính

### 1. Trang Phê duyệt (`/content-approval`)

- **Truy cập**: Chỉ giáo viên mới có quyền truy cập
- **Đường dẫn**: `/content-approval`
- **Nút truy cập**: "Phê duyệt" trong Header (màu xanh lá)

### 2. Thống kê tổng quan

- **Chờ phê duyệt**: Số bài đăng đang chờ giáo viên xem xét
- **Đã phê duyệt**: Số bài đăng đã được phê duyệt
- **Tổng bài đăng**: Tổng số bài đăng của học sinh

### 3. Bộ lọc và tìm kiếm

- **Tìm kiếm**: Theo tiêu đề, mô tả hoặc tên tác giả
- **Lọc theo trạng thái**:
  - Chờ phê duyệt
  - Đã phê duyệt
  - Tất cả
- **Lọc theo danh mục**: Lịch sử 10, 11, 12, địa phương

### 4. Quản lý bài đăng

Mỗi bài đăng hiển thị:

- **Thông tin cơ bản**: Tiêu đề, mô tả, tác giả
- **Thống kê**: Lượt xem, lượt tải
- **Phân loại**: Danh mục, thư mục con, loại file
- **Trạng thái**: Chờ phê duyệt / Đã phê duyệt
- **Thao tác**:
  - **Phê duyệt**: Chấp nhận bài đăng
  - **Từ chối**: Xóa bài đăng vĩnh viễn
  - **Xem**: Mở file để xem trước

## Quy trình phê duyệt

### 1. Học sinh đăng tải

- Học sinh đăng tải bài viết, tài liệu, sản phẩm học tập
- Bài đăng mặc định có trạng thái "Chờ phê duyệt"
- Chỉ hiển thị cho giáo viên, không hiển thị công khai

### 2. Giáo viên xem xét

- Truy cập trang "Phê duyệt" từ Header
- Xem danh sách bài đăng chờ phê duyệt
- Sử dụng bộ lọc để tìm kiếm bài đăng cụ thể
- Xem trước nội dung bằng nút "Xem"

### 3. Quyết định phê duyệt

- **Phê duyệt**: Bài đăng sẽ hiển thị công khai
- **Từ chối**: Bài đăng bị xóa vĩnh viễn

### 4. Kết quả

- Bài đăng đã phê duyệt: Hiển thị trong danh sách công khai
- Bài đăng bị từ chối: Không còn tồn tại trong hệ thống

## Giao diện người dùng

### Header Navigation

```
[Đăng tải] [Phê duyệt] [Dashboard] [Quản lý] [Quản lý người dùng]
```

### Trang Phê duyệt

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Phê duyệt bài đăng học sinh                              │
│ Quản lý và phê duyệt các bài đăng của học sinh...          │
├─────────────────────────────────────────────────────────────┤
│ [🕐 Chờ phê duyệt: 5] [✅ Đã phê duyệt: 12] [📄 Tổng: 17]  │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Tìm kiếm...] [📋 Chờ phê duyệt ▼] [📁 Tất cả danh mục ▼] │
├─────────────────────────────────────────────────────────────┤
│ 📄 Bài đăng 1                                               │
│    Tác giả: Nguyễn Văn A | Ngày: 15/12/2024                │
│    [Phê duyệt] [Từ chối] [Xem]                             │
│                                                             │
│ 📄 Bài đăng 2                                               │
│    Tác giả: Trần Thị B | Ngày: 14/12/2024                  │
│    [Phê duyệt] [Từ chối] [Xem]                             │
└─────────────────────────────────────────────────────────────┘
```

## Quyền hạn

### Giáo viên

- ✅ Truy cập trang phê duyệt
- ✅ Xem tất cả bài đăng của học sinh
- ✅ Phê duyệt bài đăng
- ✅ Từ chối bài đăng
- ✅ Xem trước nội dung

### Học sinh

- ❌ Không thể truy cập trang phê duyệt
- ✅ Có thể xem trạng thái bài đăng của mình
- ✅ Có thể chỉnh sửa bài đăng chưa được phê duyệt

## Lưu ý quan trọng

### 1. Bảo mật

- Chỉ giáo viên mới có quyền phê duyệt
- Bài đăng chưa phê duyệt không hiển thị công khai
- Học sinh không thể xem bài đăng của học sinh khác chưa phê duyệt

### 2. Hiệu suất

- Hệ thống tự động cập nhật danh sách sau khi phê duyệt/từ chối
- Bộ lọc giúp tìm kiếm nhanh chóng
- Phân trang cho danh sách lớn

### 3. Backup

- Nên sao lưu dữ liệu thường xuyên
- Bài đăng bị từ chối không thể khôi phục

## Xử lý sự cố

### Bài đăng không hiển thị

1. Kiểm tra quyền truy cập (phải là giáo viên)
2. Kiểm tra bộ lọc trạng thái
3. Kiểm tra bộ lọc danh mục

### Lỗi phê duyệt

1. Kiểm tra kết nối mạng
2. Thử lại thao tác
3. Liên hệ admin nếu vẫn lỗi

### Hiển thị sai thống kê

1. Làm mới trang
2. Kiểm tra lại bộ lọc
3. Đợi hệ thống cập nhật

## Cập nhật và cải tiến

### Phiên bản hiện tại

- ✅ Giao diện responsive
- ✅ Bộ lọc và tìm kiếm
- ✅ Thống kê real-time
- ✅ Xác nhận trước khi thao tác

### Kế hoạch tương lai

- 🔄 Thông báo email khi có bài đăng mới
- 🔄 Lịch sử phê duyệt
- 🔄 Nhận xét khi từ chối
- 🔄 Tự động phê duyệt theo điều kiện

---

**Lưu ý**: Chức năng này đảm bảo chất lượng nội dung và bảo vệ cộng đồng học tập. Hãy sử dụng có trách nhiệm!
