import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, requireTeacher = false }) => {
  const { isAuthenticated, isTeacher } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireTeacher && !isTeacher()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 