# Scripts

## createAdmin.js

Script để tạo hoặc cập nhật user admin trong database.

### Thông tin đăng nhập mặc định:
- **Số điện thoại:** `0123456789`
- **Mật khẩu:** `admin123`
- **Role:** `teacher`
- **Full Name:** `Administrator`

### Cách sử dụng:

#### Cách 1: Sử dụng npm script
```bash
cd server
npm run create-admin
```

#### Cách 2: Chạy trực tiếp
```bash
cd server
node scripts/createAdmin.js
```

### Lưu ý:
- Script sẽ tự động kiểm tra xem admin đã tồn tại chưa
- Nếu đã tồn tại, script sẽ cập nhật thông tin admin
- Nếu chưa tồn tại, script sẽ tạo mới user admin
- Mật khẩu sẽ được hash tự động bởi User model

### Yêu cầu:
- MongoDB đang chạy và có thể kết nối
- File `.env` đã được cấu hình với `MONGODB_URI`

