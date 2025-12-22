import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ContentManagement from './pages/ContentManagement';
import UserManagement from './pages/UserManagement';
import ContentDetail from './pages/ContentDetail';
import EditContent from './pages/EditContent';
import UploadContent from './pages/UploadContent';
import UserDetail from './pages/UserDetail';
import CreateUser from './pages/CreateUser';
import TaxonomyManagement from './pages/TaxonomyManagement';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isTeacher } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isTeacher()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="content/upload" element={<UploadContent />} />
          <Route path="content/:id" element={<ContentDetail />} />
          <Route path="content/:id/edit" element={<EditContent />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/new" element={<CreateUser />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="taxonomy" element={<TaxonomyManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

