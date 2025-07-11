import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  Shield,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  School,
  BookOpen
} from 'lucide-react';
import { userAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Debug useEffect
  useEffect(() => {
    console.log('UserManagement - Current user:', user);
    console.log('UserManagement - User role:', user?.role);
    console.log('UserManagement - User ID:', user?.id || user?._id);
  }, [user]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form data for create/edit user
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    fullName: '',
    role: 'student',
    email: '',
    school: '',
    grade: '',
    isActive: true
  });

  // Fetch all users
  const { data: usersData, isLoading, error } = useQuery(
    ['users', searchTerm, roleFilter, statusFilter],
    () => userAPI.getAll({ 
      search: searchTerm || undefined,
      role: roleFilter === 'all' ? undefined : roleFilter,
      isActive: statusFilter === 'all' ? undefined : (statusFilter === 'active' ? true : false)
    }),
    {
      retry: 3,
      onError: (error) => {
        console.error('Error fetching users:', error);
        toast.error('Không thể tải danh sách người dùng');
      }
    }
  );

  // Delete user mutation
  const deleteMutation = useMutation(
    (userId) => userAPI.delete(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        toast.success('Xóa người dùng thành công!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng');
      }
    }
  );

  // Update user status mutation
  const updateStatusMutation = useMutation(
    ({ userId, isActive }) => userAPI.updateStatus(userId, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        toast.success('Cập nhật trạng thái thành công!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    }
  );

  // Create user mutation
  const createUserMutation = useMutation(
    (data) => userAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        toast.success('Tạo người dùng thành công!');
        setShowCreateModal(false);
        setFormData({
          phone: '',
          password: '',
          fullName: '',
          role: 'student',
          email: '',
          school: '',
          grade: '',
          isActive: true
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng');
      }
    }
  );

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      deleteMutation.mutate(userId);
    }
  };

  const handleToggleStatus = (userId, currentStatus, userName) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'kích hoạt' : 'khóa';
    
    if (window.confirm(`Bạn có chắc chắn muốn ${action} người dùng "${userName}"?`)) {
      updateStatusMutation.mutate({ userId, isActive: newStatus });
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phone || !formData.password || !formData.fullName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    createUserMutation.mutate(formData);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      phone: user.phone,
      password: '',
      fullName: user.fullName,
      role: user.role,
      email: user.email || '',
      school: user.school || '',
      grade: user.grade || '',
      isActive: user.isActive
    });
    setShowUserModal(true);
  };

  const getRoleIcon = (role) => {
    return role === 'teacher' ? <Shield className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />;
  };

  const getRoleLabel = (role) => {
    return role === 'teacher' ? 'Giáo viên' : 'Học sinh';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Eye className="h-3 w-3 mr-1" />
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <EyeOff className="h-3 w-3 mr-1" />
        Đã khóa
      </span>
    );
  };
  console.log('usersData:', usersData);
  const users = Array.isArray(usersData?.data.data) ? usersData.data.data : [];
  
  // Debug log
  console.log('usersData:', usersData);
  console.log('users:', users);
  console.log('usersData type:', typeof usersData);
  console.log('usersData.data type:', typeof usersData?.data);
  console.log('usersData.data isArray:', Array.isArray(usersData?.data));
  
  // Final fallback - ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is teacher
  if (user.role !== 'teacher') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium mb-2">
                Không có quyền truy cập
              </div>
              <p className="text-gray-600 mb-4">
                Chỉ giáo viên mới có quyền quản lý người dùng
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium mb-2">
                Có lỗi xảy ra khi tải dữ liệu
              </div>
              <p className="text-gray-600 mb-4">
                {error.response?.data?.message || 'Không thể kết nối đến máy chủ'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý người dùng
              </h1>
              <p className="text-gray-600">
                Quản lý tất cả người dùng trong hệ thống
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Thêm người dùng mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{safeUsers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Giáo viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeUsers.filter(u => u.role === 'teacher').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Học sinh</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeUsers.filter(u => u.role === 'student').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeUsers.filter(u => u.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="teacher">Giáo viên</option>
                <option value="student">Học sinh</option>
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách người dùng ({safeUsers.length})
            </h2>
          </div>

          {safeUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy người dùng nào
              </h3>
              <p className="text-gray-600 mb-6">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {safeUsers.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {userItem.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {userItem._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRoleIcon(userItem.role)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getRoleLabel(userItem.role)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {userItem.phone}
                          </div>
                          {userItem.email && (
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1 text-gray-400" />
                              {userItem.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(userItem.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(userItem.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditUser(userItem)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(userItem._id, userItem.isActive, userItem.fullName)}
                            className={`p-1 ${
                              userItem.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={userItem.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                          >
                            {userItem.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(userItem._id, userItem.fullName)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm người dùng mới</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ tên *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vai trò *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trường học</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lớp</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Tài khoản hoạt động
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={createUserMutation.isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createUserMutation.isLoading ? 'Đang tạo...' : 'Tạo người dùng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 