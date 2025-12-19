import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Shield, GraduationCap, Mail, Phone, School } from 'lucide-react';
import { userAPI } from '../services/api';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ['user', id],
    () => userAPI.getById(id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const user = data?.data?.data;

  if (!user) {
    return <div>Không tìm thấy người dùng</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/users')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Quay lại</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullName}</h1>
          <div className="flex items-center space-x-4">
            {user.role === 'teacher' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                <Shield className="h-4 w-4 mr-1" />
                Giáo viên
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <GraduationCap className="h-4 w-4 mr-1" />
                Học sinh
              </span>
            )}
            {user.isActive ? (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Hoạt động
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Đã khóa
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              {user.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              )}
              {user.school && (
                <div className="flex items-center space-x-3">
                  <School className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Trường học:</span>
                  <span className="font-medium">{user.school}</span>
                </div>
              )}
              {user.grade && (
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Lớp:</span>
                  <span className="font-medium">{user.grade}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Ngày tạo:</span>
                <span className="ml-2 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {user.lastLogin && (
                <div>
                  <span className="text-gray-600">Đăng nhập lần cuối:</span>
                  <span className="ml-2 font-medium">
                    {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

