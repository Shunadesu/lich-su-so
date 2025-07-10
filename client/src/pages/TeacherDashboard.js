import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { 
  Users, 
  FileText, 
  Plus, 
  BarChart3, 
  Calendar, 
  BookOpen, 
  UserPlus,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { authAPI, contentAPI, userAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateTeacher, setShowCreateTeacher] = useState(false);
  const [createTeacherData, setCreateTeacherData] = useState({
    fullName: '',
    phone: '',
    email: '',
    school: '',
    password: '',
    confirmPassword: ''
  });

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery(
    ['teacher-dashboard'],
    async () => {
      const [contentStats, userStats] = await Promise.all([
        contentAPI.getMyContent({ limit: 100 }), // Lấy nhiều hơn để hiển thị đầy đủ
        userAPI.getAll({ role: 'student' })
      ]);
      
      console.log('Dashboard data:', {
        contentStats: contentStats.data,
        userStats: userStats.data,
        user: user
      });
      
      return {
        myContent: contentStats.data,
        students: userStats.data,
        totalStudents: userStats.data?.length || 0,
        totalContent: contentStats.data?.length || 0,
        approvedContent: contentStats.data?.filter(c => c.isApproved).length || 0,
        pendingContent: contentStats.data?.filter(c => !c.isApproved).length || 0
      };
    },
    {
      onError: (error) => {
        console.error('Dashboard data error:', error);
      }
    }
  );

  // Create teacher mutation
  const createTeacherMutation = useMutation(
    authAPI.createTeacher,
    {
      onSuccess: () => {
        toast.success('Tạo tài khoản giáo viên thành công!');
        setShowCreateTeacher(false);
        setCreateTeacherData({
          fullName: '',
          phone: '',
          email: '',
          school: '',
          password: '',
          confirmPassword: ''
        });
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      }
    }
  );

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    
    if (createTeacherData.password !== createTeacherData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (createTeacherData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    const { confirmPassword, ...submitData } = createTeacherData;
    createTeacherMutation.mutate(submitData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateTeacherData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const stats = [
    {
      title: 'Tổng tài liệu',
      value: dashboardData?.totalContent || 0,
      icon: FileText,
      color: 'bg-amber-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Tài liệu đã phê duyệt',
      value: dashboardData?.approvedContent || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Tài liệu chờ phê duyệt',
      value: dashboardData?.pendingContent || 0,
      icon: Eye,
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'decrease'
    },
    {
      title: 'Học sinh đăng ký',
      value: dashboardData?.totalStudents || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const recentContent = dashboardData?.myContent?.slice(0, 5) || [];
  const allMyContent = dashboardData?.myContent || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Giáo viên
          </h1>
          <p className="text-gray-600">
            Chào mừng trở lại, {user?.fullName}! Đây là tổng quan về hoạt động của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-5 w-5 inline mr-2" />
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Tài liệu của tôi
              </button>
              <button
                onClick={() => setActiveTab('teachers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'teachers'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Quản lý giáo viên
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Hoạt động gần đây
                    </h3>
                    <div className="space-y-4">
                      {recentContent.map((content) => (
                        <div key={content._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {content.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(content.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              content.isApproved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {content.isApproved ? 'Đã phê duyệt' : 'Chờ phê duyệt'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Thao tác nhanh
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => window.location.href = '/upload'}
                        className="w-full flex items-center justify-center px-4 py-3 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Đăng tải tài liệu mới
                      </button>
                      <button
                        onClick={() => setShowCreateTeacher(true)}
                        className="w-full flex items-center justify-center px-4 py-3 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Tạo tài khoản giáo viên
                      </button>
                      <button
                        onClick={() => window.location.href = '/admin'}
                        className="w-full flex items-center justify-center px-4 py-3 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <Users className="h-5 w-5 mr-2" />
                        Quản lý hệ thống
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tài liệu của tôi
                  </h3>
                  <button
                    onClick={() => window.location.href = '/upload'}
                    className="flex items-center px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng tải mới
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tài liệu
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh mục
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lượt xem
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày tạo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(allMyContent) && allMyContent.length > 0 ? (
                          allMyContent.map((content) => (
                            <tr key={content._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {content.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {content.fileName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                  {content.category} / {content.subCategory}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  content.isApproved 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {content.isApproved ? 'Đã phê duyệt' : 'Chờ phê duyệt'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {content.viewCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(content.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center">
                              <div className="text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  Chưa có tài liệu nào
                                </h3>
                                <p className="text-gray-500 mb-4">
                                  Bạn chưa đăng tải tài liệu nào. Hãy bắt đầu bằng cách tạo tài liệu mới!
                                </p>
                                <button
                                  onClick={() => window.location.href = '/upload'}
                                  className="inline-flex items-center px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Đăng tải tài liệu đầu tiên
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'teachers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quản lý giáo viên
                  </h3>
                  <button
                    onClick={() => setShowCreateTeacher(true)}
                    className="flex items-center px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tạo tài khoản giáo viên
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <UserPlus className="h-6 w-6 text-amber-600 mr-2" />
                    <h4 className="text-lg font-semibold text-amber-900">
                      Tạo tài khoản giáo viên mới
                    </h4>
                  </div>
                  <p className="text-amber-800 mb-4">
                    Chỉ giáo viên mới có quyền tạo tài khoản giáo viên khác. 
                    Tài khoản mới sẽ được kích hoạt ngay lập tức và có thể đăng nhập.
                  </p>
                  <button
                    onClick={() => setShowCreateTeacher(true)}
                    className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Bắt đầu tạo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Teacher Modal */}
        {showCreateTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tạo tài khoản giáo viên
                </h3>
                <button
                  onClick={() => setShowCreateTeacher(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={createTeacherData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={createTeacherData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={createTeacherData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nhập email (không bắt buộc)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trường học *
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={createTeacherData.school}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nhập tên trường học"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={createTeacherData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={createTeacherData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateTeacher(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={createTeacherMutation.isLoading}
                    className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                  >
                    {createTeacherMutation.isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard; 