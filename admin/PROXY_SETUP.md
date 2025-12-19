# Vite Proxy Setup - Admin

## Cấu hình Proxy

Proxy đã được cấu hình trong `vite.config.js` để forward tất cả requests từ `/api` đến backend server.

### Development Mode

Trong development mode (`npm run dev`), API calls sẽ tự động sử dụng proxy:

- Admin Panel: `http://localhost:1912`
- API calls: `/api/*` → được proxy đến `http://localhost:5000/api/*`

### Production Mode

Trong production mode, cần set environment variable:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Cách hoạt động

1. **Development**: 
   - API_BASE_URL = `/api` (relative path)
   - Vite proxy sẽ forward đến `http://localhost:5000/api`

2. **Production**:
   - API_BASE_URL = từ `VITE_API_URL` env variable
   - Gọi trực tiếp đến API server

## Kiểm tra

1. Chạy backend server: `cd server && npm start` (port 5000)
2. Chạy admin panel: `cd admin && npm run dev` (port 1912)
3. Mở browser console để xem proxy logs
4. API calls sẽ được log trong terminal

## Troubleshooting

- **CORS errors**: Proxy đã xử lý CORS tự động
- **404 errors**: Đảm bảo backend server đang chạy trên port 5000
- **Connection refused**: Kiểm tra backend server đã start chưa

