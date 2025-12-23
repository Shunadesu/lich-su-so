import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Shield, Lock, Phone, User } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [mode, setMode] = useState('login'); // login | register
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    fullName: '',
  });

  const loginMutation = useMutation(
    (data) => authAPI.login(data),
    {
      onSuccess: (response) => {
        const { user, token } = response.data;
        if (user.role !== 'teacher') {
          toast.error('Chỉ giáo viên mới có quyền truy cập admin panel');
          return;
        }
        login(user, token);
        toast.success('Đăng nhập thành công');
        navigate('/');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      },
    }
  );

  const registerMutation = useMutation(
    (data) => authAPI.registerTeacher(data),
    {
      onSuccess: (response) => {
        const { token, user } = response.data;
        if (user.role !== 'teacher') {
          toast.error('Chỉ giáo viên mới có quyền truy cập admin panel');
          return;
        }
        login(user, token);
        toast.success('Đăng ký thành công');
        navigate('/');
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          'Đăng ký thất bại';
        toast.error(message);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      loginMutation.mutate({ phone: formData.phone, password: formData.password });
    } else {
      registerMutation.mutate({
        phone: formData.phone,
        password: formData.password,
        fullName: formData.fullName,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Đăng nhập để quản lý hệ thống' : 'Đăng ký tài khoản giáo viên để vào admin'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg font-semibold border transition-colors ${
              mode === 'login'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg font-semibold border transition-colors ${
              mode === 'register'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            Đăng ký (Giáo viên)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập họ tên"
                  required={mode === 'register'}
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isLoading || registerMutation.isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'login'
              ? (loginMutation.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập')
              : (registerMutation.isLoading ? 'Đang đăng ký...' : 'Đăng ký giáo viên')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

