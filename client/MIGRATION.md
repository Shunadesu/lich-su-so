# Migration từ Create React App sang Vite

## Thay đổi chính

### 1. Cấu hình
- ✅ Đã chuyển từ `react-scripts` sang `vite`
- ✅ Đã tạo `vite.config.js` với cấu hình proxy
- ✅ Đã cập nhật `index.html` cho Vite
- ✅ Đã tạo `main.jsx` thay vì `index.js`

### 2. Environment Variables
- Thay đổi từ `REACT_APP_*` sang `VITE_*`
- Tạo file `.env` với các biến:
  ```
  VITE_API_URL=http://localhost:5000/api
  VITE_STATIC_URL=http://localhost:5000
  ```

### 3. Zustand Stores
- ✅ `authStore.js` - đã có sẵn
- ✅ `contentStore.js` - mới tạo
- ✅ `uiStore.js` - mới tạo

### 4. Skeleton Components
- ✅ `ContentCardSkeleton` - skeleton cho card nội dung
- ✅ `ContentListSkeleton` - skeleton cho danh sách
- ✅ `ContentDetailSkeleton` - skeleton cho chi tiết
- ✅ `TableSkeleton` - skeleton cho bảng
- ✅ `RecentActivitiesSkeleton` - skeleton cho hoạt động gần đây
- ✅ `DashboardSkeleton` - skeleton cho dashboard

## Cài đặt

```bash
cd client
npm install
```

## Chạy development

```bash
npm run dev
```

## Build production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Lưu ý

1. Đảm bảo tạo file `.env` từ `.env.example`
2. Các import paths vẫn giữ nguyên
3. Tailwind CSS vẫn hoạt động bình thường
4. React Router vẫn hoạt động bình thường

