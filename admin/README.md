# Admin Panel - Lịch Sử Số

Admin panel riêng biệt để quản lý hệ thống Lịch Sử Số.

## 🚀 Công nghệ

- **React 18** - UI Framework
- **Vite** - Build tool
- **Zustand** - State management
- **React Query** - Data fetching
- **React Router** - Routing
- **Tailwind CSS** - Styling

## 📦 Cài đặt

```bash
cd admin
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:1912`

## 🏗️ Build

```bash
npm run build
```

## 📁 Cấu trúc

```
src/
├── components/     # Components
│   └── Layout.jsx # Layout chính
├── pages/          # Pages
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── ContentManagement.jsx
│   ├── UserManagement.jsx
│   ├── ContentDetail.jsx
│   └── UserDetail.jsx
├── services/       # API services
│   └── api.js
├── store/          # Zustand stores
│   ├── authStore.js
│   └── adminStore.js
└── App.jsx         # Main app
```

## 🔐 Authentication

Chỉ giáo viên mới có quyền truy cập admin panel.

## 📝 Routes

- `/login` - Đăng nhập
- `/` - Dashboard
- `/content` - Quản lý tài liệu
- `/content/:id` - Chi tiết tài liệu
- `/users` - Quản lý người dùng
- `/users/:id` - Chi tiết người dùng

