# Fix Vercel API 404 Error

## Vấn đề
API requests từ frontend qua Vercel trả về 404, mặc dù truy cập trực tiếp `https://lichsuso.online/api/...` hoạt động.

## Giải pháp

### 1. Kiểm tra cấu hình vercel.json
Đảm bảo `rewrites` được cấu hình đúng:
- API rewrite phải đứng TRƯỚC SPA routing
- Sử dụng pattern `:path*` để match tất cả paths

### 2. Nếu vẫn lỗi, thử các cách sau:

#### Cách 1: Thêm environment variable
Trong Vercel Dashboard > Settings > Environment Variables:
- Thêm `VITE_API_URL` = `https://lichsuso.online/api`

Sau đó cập nhật `client/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'https://lichsuso.online/api');
```

#### Cách 2: Sử dụng direct API URL trong production
Cập nhật `client/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'
  : 'https://lichsuso.online/api';
```

### 3. Kiểm tra CORS trên server
Đảm bảo server cho phép requests từ domain Vercel:
- Thêm domain Vercel vào `allowedOrigins` trong `server/index.js`

### 4. Debug
Kiểm tra Network tab trong browser:
- Xem request URL thực tế được gửi
- Kiểm tra response headers
- Xem có CORS error không

### 5. Redeploy
Sau khi sửa, cần redeploy:
```bash
vercel --prod
```

