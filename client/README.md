# Lịch Sử Số - Frontend

Frontend application được xây dựng với React + Vite + Zustand + Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **React 18** - UI Framework
- **Vite** - Build tool và dev server
- **Zustand** - State management
- **React Query** - Data fetching và caching
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📦 Cài đặt

```bash
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:1922`

## 🏗️ Build

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `build/`

## 👀 Preview Production Build

```bash
npm run preview
```

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Reusable components
│   ├── skeletons/      # Skeleton loading components
│   └── ...
├── pages/              # Page components
├── store/              # Zustand stores
│   ├── authStore.js    # Authentication state
│   ├── contentStore.js # Content state
│   └── uiStore.js      # UI state
├── services/           # API services
├── hooks/             # Custom hooks
└── styles/            # Global styles
```

## 🗂️ Zustand Stores

### useAuthStore
Quản lý authentication state:
- `user` - Thông tin user hiện tại
- `token` - JWT token
- `isAuthenticated` - Trạng thái đăng nhập
- `login()` - Đăng nhập
- `logout()` - Đăng xuất
- `updateUser()` - Cập nhật thông tin user

### useContentStore
Quản lý content state:
- `contents` - Danh sách nội dung
- `filters` - Bộ lọc
- `recentActivities` - Hoạt động gần đây
- `selectedContent` - Nội dung đang xem
- `myContents` - Nội dung của user

### useUIStore
Quản lý UI state:
- `globalLoading` - Trạng thái loading toàn cục
- `isModalOpen` - Trạng thái modal
- `isSidebarOpen` - Trạng thái sidebar

## 🎨 Skeleton Components

Các skeleton components đã được tạo sẵn:
- `ContentCardSkeleton` - Skeleton cho content card
- `ContentListSkeleton` - Skeleton cho danh sách content
- `ContentDetailSkeleton` - Skeleton cho chi tiết content
- `TableSkeleton` - Skeleton cho bảng
- `RecentActivitiesSkeleton` - Skeleton cho hoạt động gần đây
- `DashboardSkeleton` - Skeleton cho dashboard

## 🔧 Environment Variables

Tạo file `.env` từ `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STATIC_URL=http://localhost:5000
```

## 📝 Migration từ CRA

Xem file `MIGRATION.md` để biết chi tiết về quá trình migration từ Create React App sang Vite.

