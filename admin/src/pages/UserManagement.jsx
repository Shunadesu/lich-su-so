import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  GraduationCap,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { userAPI } from '../services/api';
import { useAdminStore } from '../store';
import { UserTableSkeleton } from '../components/skeletons';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { userFilters, setUserFilters } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState(userFilters.search || '');
  const [roleFilter, setRoleFilter] = useState(userFilters.role || 'all');
  const [statusFilter, setStatusFilter] = useState(
    userFilters.isActive !== null ? (userFilters.isActive ? 'active' : 'inactive') : 'all'
  );

  const { data, isLoading, error } = useQuery(
    ['admin-users', userFilters.search, userFilters.role, userFilters.isActive],
    () => {
      const params = {
        limit: 100,
      };
      if (userFilters.search) params.search = userFilters.search;
      if (userFilters.role) params.role = userFilters.role;
      if (userFilters.isActive !== null && userFilters.isActive !== undefined) {
        params.isActive = userFilters.isActive;
      }
      return userAPI.getAll(params);
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const deleteMutation = useMutation(
    (id) => userAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
        toast.success('Xóa người dùng thành công');
      },
      onError: () => {
        toast.error('Lỗi khi xóa người dùng');
      },
    }
  );

  const statusMutation = useMutation(
    ({ id, isActive }) => userAPI.updateStatus(id, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
        toast.success('Cập nhật trạng thái thành công');
      },
      onError: () => {
        toast.error('Lỗi khi cập nhật trạng thái');
      },
    }
  );

  const applyFilters = () => {
    const newFilters = {
      search: searchTerm.trim() || null,
      role: roleFilter !== 'all' ? roleFilter : null,
      isActive: statusFilter !== 'all' ? (statusFilter === 'active') : null,
    };
    setUserFilters(newFilters);
    queryClient.invalidateQueries(['admin-users']);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleFilter = () => {
    applyFilters();
  };

  const users = data?.data?.data || [];
  
  console.log('Current userFilters from store:', userFilters);
  console.log('Users data:', users.length);

  if (isLoading) {
    return (
      <div>
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center justify-between animate-pulse">
          <div>
            <div className="h-9 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <UserTableSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
          <p className="text-gray-600">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <Link
          to="/users/new"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>Thêm người dùng</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              // Auto apply filter when role changes
              setTimeout(() => {
                const newFilters = {
                  search: searchTerm.trim() || null,
                  role: e.target.value !== 'all' ? e.target.value : null,
                  isActive: statusFilter !== 'all' ? (statusFilter === 'active') : null,
                };
                setUserFilters(newFilters);
                queryClient.invalidateQueries(['admin-users']);
              }, 0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="teacher">Giáo viên</option>
            <option value="student">Học sinh</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              // Auto apply filter when status changes
              setTimeout(() => {
                const newFilters = {
                  search: searchTerm.trim() || null,
                  role: roleFilter !== 'all' ? roleFilter : null,
                  isActive: e.target.value !== 'all' ? (e.target.value === 'active') : null,
                };
                setUserFilters(newFilters);
                queryClient.invalidateQueries(['admin-users']);
              }, 0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Đã khóa</option>
          </select>
          <button
            onClick={handleFilter}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                  Trường học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                      {user.email && (
                        <div className="text-sm text-gray-500">{user.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'teacher' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          <Shield className="h-4 w-4 mr-1" />
                          Giáo viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          Học sinh
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.school || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Eye className="h-4 w-4 mr-1" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <EyeOff className="h-4 w-4 mr-1" />
                          Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/users/${user._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => {
                          statusMutation.mutate({
                            id: user._id,
                            isActive: !user.isActive,
                          });
                        }}
                        className={`${
                          user.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive ? (
                          <EyeOff className="h-5 w-5 inline" />
                        ) : (
                          <Eye className="h-5 w-5 inline" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
                            deleteMutation.mutate(user._id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

