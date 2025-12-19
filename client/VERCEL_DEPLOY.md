# Hướng dẫn Deploy Client lên Vercel

## Bước 1: Cài đặt Vercel CLI (nếu chưa có)
```bash
npm i -g vercel
```

## Bước 2: Đăng nhập Vercel
```bash
vercel login
```

## Bước 3: Deploy từ thư mục client
```bash
cd client
vercel
```

Hoặc deploy production:
```bash
vercel --prod
```

## Bước 4: Cấu hình Environment Variables (nếu cần)
Trong Vercel Dashboard:
- Vào Project Settings > Environment Variables
- Thêm các biến môi trường nếu cần:
  - `VITE_API_URL` (không bắt buộc, vì đã dùng rewrites)

## Lưu ý:
- File `vercel.json` đã được cấu hình để:
  - Rewrite `/api/*` requests đến `https://lichsuso.online/api/*`
  - Handle SPA routing (tất cả routes trỏ về `/index.html`)
  - Cache static assets

## Cấu trúc file:
- `vercel.json`: Cấu hình Vercel
- `.vercelignore`: Files/folders bỏ qua khi deploy
- Build output: `build/` (theo vite.config.js)

