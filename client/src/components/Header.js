import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Upload, Users, BarChart3 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Header = () => {
  const { user, isAuthenticated, logout, isTeacher } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-amber-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover:text-amber-100 transition-colors">
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Lịch Sử Số</h1>
                <p className="text-sm text-amber-100">Giáo dục Lịch sử</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="hover:text-amber-100 transition-colors font-medium"
            >
              Trang chủ
            </Link>
            <Link 
              to="/lich-su-10" 
              className="hover:text-amber-100 transition-colors font-medium"
            >
              Lịch sử 10
            </Link>
            <Link 
              to="/lich-su-11" 
              className="hover:text-amber-100 transition-colors font-medium"
            >
              Lịch sử 11
            </Link>
            <Link 
              to="/lich-su-12" 
              className="hover:text-amber-100 transition-colors font-medium"
            >
              Lịch sử 12
            </Link>
            <Link 
              to="/lich-su-dia-phuong" 
              className="hover:text-amber-100 transition-colors font-medium"
            >
              Lịch sử địa phương
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Upload Button for Teachers */}
                {isTeacher() && (
                  <Link
                    to="/upload"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Đăng tải</span>
                  </Link>
                )}

                {/* Dashboard for Teachers */}
                {isTeacher() && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Admin Panel for Teachers */}
                {isTeacher() && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span>Quản lý</span>
                  </Link>
                )}

                {/* User Profile */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-amber-100 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user?.fullName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="border border-white hover:bg-white hover:text-amber-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden mt-4">
          <button className="text-white hover:text-amber-100">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 