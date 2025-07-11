# Cập nhật ContentList - Hiển thị bài đăng học sinh

## Tổng quan

Đã cập nhật tất cả các trang lịch sử (Lịch sử 10, 11, 12, địa phương) để hiển thị **tất cả bài đăng của học sinh** mà không phân biệt khối lớp. Điều này giúp học sinh có thể xem và học hỏi từ các bài đăng của bạn bè ở các khối khác.

## Tính năng mới

### 1. **Section "Bài đăng của học sinh"**

- **Vị trí**: Luôn hiển thị ở đầu trang, trước tài liệu giáo viên
- **Nội dung**: Tất cả bài đăng của học sinh từ mọi khối lớp
- **Màu sắc**: Purple theme để phân biệt với tài liệu giáo viên
- **Số lượng**: Hiển thị tối đa 20 bài đăng mới nhất

### 2. **Section "Tài liệu của giáo viên"**

- **Vị trí**: Hiển thị sau bài đăng học sinh
- **Nội dung**: Tài liệu giáo viên được lọc theo khối lớp hiện tại
- **Màu sắc**: Amber theme như trước
- **Tính năng**: Tìm kiếm và lọc theo danh mục

### 3. **Phân biệt trực quan**

- **Bài đăng học sinh**: Border purple, button purple
- **Tài liệu giáo viên**: Border amber, button amber
- **Icon phân biệt**: GraduationCap cho học sinh, User cho giáo viên

## Cách hoạt động

### **Frontend (ContentList.js)**

```javascript
// Query riêng cho bài đăng học sinh
const { data: studentData } = useQuery(["student-contents"], () =>
  contentAPI.getAll({
    authorRole: "student",
    limit: 20,
  })
);

// Query riêng cho tài liệu giáo viên
const { data: teacherData } = useQuery(
  [
    "teacher-contents",
    effectiveCategory,
    selectedSubCategory,
    searchTerm,
    currentPage,
  ],
  () =>
    contentAPI.getAll({
      category: effectiveCategory,
      subCategory: selectedSubCategory,
      search: searchTerm,
      page: currentPage,
      limit: 12,
      authorRole: "teacher",
    })
);
```

### **Backend (content.js)**

```javascript
// Hỗ trợ filter theo authorRole
const { category, subCategory, search, page, limit, author, authorRole } =
  req.query;

// Filter sau khi populate author
if (authorRole) {
  filteredContents = contents.filter(
    (content) => content.author?.role === authorRole
  );
}
```

## Lợi ích

### **Cho học sinh:**

1. **Học hỏi đa dạng**: Xem bài đăng từ các khối khác
2. **Cảm hứng**: Thấy được sản phẩm của bạn bè
3. **Giao lưu**: Hiểu được cách học tập ở các khối khác

### **Cho giáo viên:**

1. **Theo dõi**: Xem được tất cả hoạt động của học sinh
2. **Đánh giá**: So sánh chất lượng bài đăng giữa các khối
3. **Hướng dẫn**: Có thể comment và góp ý cho học sinh

### **Cho hệ thống:**

1. **Tăng tương tác**: Học sinh xem nhiều nội dung hơn
2. **Cộng đồng**: Tạo môi trường học tập cộng đồng
3. **Chất lượng**: Khuyến khích học sinh đăng tải chất lượng

## Các trang được cập nhật

- ✅ `/lich-su-10` - Lịch sử 10
- ✅ `/lich-su-11` - Lịch sử 11
- ✅ `/lich-su-12` - Lịch sử 12
- ✅ `/lich-su-dia-phuong` - Lịch sử địa phương
- ✅ `/content` - Tất cả tài liệu

## Loading States

- **Loading chung**: Hiển thị khi cả hai API đang load
- **Loading riêng**: Mỗi section có loading state riêng
- **Error handling**: Xử lý lỗi riêng cho từng section

## Responsive Design

- **Desktop**: Grid 4 cột cho cả hai section
- **Tablet**: Grid 3 cột
- **Mobile**: Grid 1-2 cột tùy màn hình
- **Search/Filter**: Responsive layout

## Tương lai

### **Tính năng có thể thêm:**

1. **Filter theo khối**: Cho phép học sinh lọc bài đăng theo khối
2. **Sort options**: Sắp xếp theo thời gian, lượt xem, lượt tải
3. **Categories**: Phân loại bài đăng học sinh theo loại
4. **Comments**: Cho phép comment trên bài đăng học sinh
5. **Likes**: Hệ thống like cho bài đăng

### **Cải tiến UX:**

1. **Infinite scroll**: Thay vì pagination
2. **Lazy loading**: Load ảnh khi cần
3. **Search real-time**: Tìm kiếm real-time
4. **Bookmarks**: Đánh dấu bài đăng yêu thích

## Kết luận

Cập nhật này tạo ra một môi trường học tập cộng đồng tốt hơn, nơi học sinh có thể:

- Xem và học hỏi từ tất cả bài đăng của bạn bè
- Được truyền cảm hứng từ các sản phẩm chất lượng
- Tạo ra một cộng đồng học tập sôi động

Đồng thời vẫn giữ nguyên tính năng tìm kiếm và lọc cho tài liệu giáo viên theo từng khối lớp cụ thể.
