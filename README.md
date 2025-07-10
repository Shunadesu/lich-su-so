# Lịch Sử Số - Hệ thống giáo dục lịch sử trực tuyến

## 📋 Mô tả

Hệ thống quản lý và chia sẻ tài liệu giáo dục lịch sử cho UBND TỈNH ĐỒNG THÁP - SỞ GIÁO DỤC & ĐÀO TẠO TỈNH ĐỒNG THÁP.

## 🚀 Tính năng chính

### 👨‍🏫 Dành cho Giáo viên

- **Dashboard riêng biệt** với thống kê chi tiết
- **Tạo tài khoản giáo viên** mới (chỉ giáo viên mới có quyền)
- **Đăng tải tài liệu** đa dạng (PDF, PowerPoint, Video, Hình ảnh)
- **Quản lý nội dung** với phân loại theo lớp và danh mục
- **Theo dõi thống kê** lượt xem, tải về
- **Quản lý hệ thống** toàn diện

### 👨‍🎓 Dành cho Học sinh

- **Xem và tải tài liệu** từ giáo viên
- **Đăng tải sản phẩm học tập** trong khu vực riêng
- **Tìm kiếm tài liệu** theo lớp và danh mục
- **Theo dõi hoạt động** học tập

## 🛠️ Công nghệ sử dụng

### Backend

- **Node.js** với Express.js
- **MongoDB** với Mongoose
- **JWT** cho xác thực
- **Multer** cho upload file
- **Express-validator** cho validation

### Frontend

- **React.js** với React Router DOM
- **Tailwind CSS** cho styling
- **Zustand** cho state management
- **React Query** cho data fetching
- **Lucide React** cho icons
- **React Hot Toast** cho notifications

## 📦 Cài đặt và chạy

### 1. Clone repository

```bash
git clone <repository-url>
cd lich-su-so
```

### 2. Cài đặt dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Cấu hình môi trường

```bash
# Tạo file .env trong thư mục server
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lich-su-so
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

### 4. Chạy ứng dụng

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 🔐 Hệ thống phân quyền

### Tạo tài khoản giáo viên đầu tiên

1. Truy cập trang chủ khi chưa có giáo viên nào
2. Click "Tạo tài khoản giáo viên"
3. Điền thông tin và tạo tài khoản

### Tạo tài khoản giáo viên khác

1. Đăng nhập với tài khoản giáo viên
2. Vào Dashboard → Tab "Quản lý giáo viên"
3. Click "Tạo tài khoản giáo viên"
4. Điền thông tin và tạo

### Đăng ký học sinh

- Bất kỳ ai cũng có thể đăng ký tài khoản học sinh
- Chỉ cần điền thông tin cơ bản

## 📁 Cấu trúc thư mục

```
lich-su-so/
├── server/                 # Backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Middleware functions
│   ├── uploads/           # Uploaded files
│   └── server.js          # Main server file
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   └── App.js         # Main app component
│   └── package.json
└── README.md
```

## 🎨 Giao diện

Hệ thống sử dụng theme màu **amber/brown** phù hợp với chủ đề lịch sử:

- Header: Nền xanh với chữ trắng
- Background: Trắng
- Accent colors: Amber, Brown, Yellow tones

## 📱 Responsive Design

Giao diện được thiết kế responsive cho:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký học sinh
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/create-teacher` - Tạo giáo viên (cần auth)
- `POST /api/auth/create-first-teacher` - Tạo giáo viên đầu tiên
- `GET /api/auth/me` - Lấy thông tin user

### Content

- `GET /api/content` - Lấy danh sách tài liệu
- `POST /api/content` - Tạo tài liệu mới
- `GET /api/content/:id` - Lấy chi tiết tài liệu
- `PUT /api/content/:id` - Cập nhật tài liệu
- `DELETE /api/content/:id` - Xóa tài liệu

### Users

- `GET /api/users` - Lấy danh sách users
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

## 🚀 Deployment

### Backend (Heroku/Railway)

```bash
cd server
npm run build
```

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
```

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ:

- Email: support@lichsuso.com
- Phone: 0123-456-789

## 📄 License

Dự án này được phát triển cho UBND TỈNH ĐỒNG THÁP - SỞ GIÁO DỤC & ĐÀO TẠO TỈNH ĐỒNG THÁP.
