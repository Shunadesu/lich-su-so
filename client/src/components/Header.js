import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Upload, Users, BarChart3, Menu, X, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Header = () => {
  const { user, isAuthenticated, logout, isTeacher } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-amber-800 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover:text-amber-100 transition-colors" onClick={closeMobileMenu}>
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Lịch Sử Số</h1>
                <p className="text-sm text-amber-100">Giáo dục Lịch sử</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
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

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Upload Button for Teachers and Students */}
                <Link
                  to="/upload"
                  className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Đăng tải</span>
                </Link>

                {/* Content Approval for Teachers */}
                {isTeacher() && (
                  <Link
                    to="/content-approval"
                    className="flex items-center space-x-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Phê duyệt</span>
                  </Link>
                )}

                {/* User Profile */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-amber-100 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user?.fullName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white  shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    {/* Dashboard for Teachers */}
                {isTeacher() && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2  transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Student Dashboard */}
                {!isTeacher() && (
                  <Link
                    to="/student-dashboard"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2  transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Admin Panel for Teachers */}
                {isTeacher() && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2  transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span>Quản lý</span>
                  </Link>
                )}

                {/* User Management for Teachers */}
                {isTeacher() && (
                  <Link
                    to="/user-management"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2  transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span>Quản lý người dùng</span>
                  </Link>
                )}
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:text-amber-100 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-amber-700 pt-4">
            {/* Mobile Navigation */}
            <nav className="mb-6">
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block py-2 hover:text-amber-100 transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Trang chủ
                </Link>
                <Link 
                  to="/lich-su-10" 
                  className="block py-2 hover:text-amber-100 transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Lịch sử 10
                </Link>
                <Link 
                  to="/lich-su-11" 
                  className="block py-2 hover:text-amber-100 transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Lịch sử 11
                </Link>
                <Link 
                  to="/lich-su-12" 
                  className="block py-2 hover:text-amber-100 transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Lịch sử 12
                </Link>
                <Link 
                  to="/lich-su-dia-phuong" 
                  className="block py-2 hover:text-amber-100 transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Lịch sử địa phương
                </Link>
              </div>
            </nav>

            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-2 py-2 border-b border-amber-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.fullName}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    to="/upload"
                    className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors w-full"
                    onClick={closeMobileMenu}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Đăng tải</span>
                  </Link>

                  {/* Content Approval for Teachers */}
                  {isTeacher() && (
                    <Link
                      to="/content-approval"
                      className="flex items-center space-x-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors w-full"
                      onClick={closeMobileMenu}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Phê duyệt</span>
                    </Link>
                  )}

                  {/* Dashboard for Teachers */}
                  {isTeacher() && (
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors w-full"
                      onClick={closeMobileMenu}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Student Dashboard */}
                  {!isTeacher() && (
                    <Link
                      to="/student-dashboard"
                      className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors w-full"
                      onClick={closeMobileMenu}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Admin Panel for Teachers */}
                  {isTeacher() && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors w-full"
                      onClick={closeMobileMenu}
                    >
                      <Users className="h-4 w-4" />
                      <span>Quản lý</span>
                    </Link>
                  )}

                  {/* User Management for Teachers */}
                  {isTeacher() && (
                    <Link
                      to="/user-management"
                      className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors w-full"
                      onClick={closeMobileMenu}
                    >
                      <Users className="h-4 w-4" />
                      <span>Quản lý người dùng</span>
                    </Link>
                  )}

                  {/* Profile and Logout */}
                  <div className="pt-2 border-t border-amber-700">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 py-2 hover:text-amber-100 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <User className="h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 py-2 hover:text-amber-100 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors text-center"
                  onClick={closeMobileMenu}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block border border-white hover:bg-white hover:text-amber-800 px-4 py-2 rounded-lg transition-colors text-center"
                  onClick={closeMobileMenu}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 