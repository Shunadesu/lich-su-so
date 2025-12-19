import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Users, FileText, CheckCircle, XCircle, Search, Trash2 } from 'lucide-react';
import { userAPI, contentAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Users Query
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery(
    ['users', searchTerm, roleFilter],
    async () => {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      params.limit = 100; // Lấy nhiều hơn để hiển thị đầy đủ
      
      console.log('AdminPanel calling users API with params:', params);
      const response = await userAPI.getAll(params);
      console.log('AdminPanel users API response:', response);
      return response;
    },
    {
      onSuccess: (response) => {
        console.log('AdminPanel users API success:', response);
      },
      onError: (error) => {
        console.error('AdminPanel users API error:', error);
        toast.error('Lỗi khi tải danh sách người dùng');
      }
    }
  );

  // Pending Content Query
  const { data: pendingContent, isLoading: contentLoading, refetch: refetchContent } = useQuery(
    ['pending-content'],
    async () => {
      console.log('AdminPanel calling pending content API');
      const response = await contentAPI.getAll({ isApproved: false });
      console.log('AdminPanel pending content API response:', response);
      return response;
    },
    {
      onSuccess: (response) => {
        console.log('AdminPanel pending content API success:', response);
      },
      onError: (error) => {
        console.error('AdminPanel pending content API error:', error);
        toast.error('Lỗi khi tải nội dung chờ phê duyệt');
      }
    }
  );

  // Mutations
  const updateUserStatusMutation = useMutation(
    (data) => userAPI.updateStatus(data.id, { isActive: data.isActive }),
    {
      onSuccess: () => {
        toast.success('Cập nhật trạng thái thành công!');
        refetchUsers();
      },
      onError: () => {
        toast.error('Lỗi khi cập nhật trạng thái');
      }
    }
  );

  const deleteUserMutation = useMutation(
    (id) => userAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Xóa người dùng thành công!');
        refetchUsers();
      },
      onError: () => {
        toast.error('Lỗi khi xóa người dùng');
      }
    }
  );

  const approveContentMutation = useMutation(
    (id) => contentAPI.approve(id),
    {
      onSuccess: () => {
        toast.success('Phê duyệt nội dung thành công!');
        refetchContent();
      },
      onError: () => {
        toast.error('Lỗi khi phê duyệt nội dung');
      }
    }
  );

  const deleteContentMutation = useMutation(
    (id) => contentAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Xóa nội dung thành công!');
        refetchContent();
      },
      onError: () => {
        toast.error('Lỗi khi xóa nội dung');
      }
    }
  );

  const handleUserStatusToggle = (userId, currentStatus) => {
    if (window.confirm(`Bạn có chắc chắn muốn ${currentStatus ? 'khóa' : 'kích hoạt'} tài khoản này?`)) {
      updateUserStatusMutation.mutate({ id: userId, isActive: !currentStatus });
    }
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleApproveContent = (contentId, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn phê duyệt "${title}"?`)) {
      approveContentMutation.mutate(contentId);
    }
  };

  const handleDeleteContent = (contentId, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${title}"?`)) {
      deleteContentMutation.mutate(contentId);
    }
  };

  const getRoleLabel = (role) => {
    return role === 'teacher' ? 'Giáo viên' : 'Học sinh';
  };

  const getStatusLabel = (isActive) => {
    return isActive ? 'Hoạt động' : 'Đã khóa';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản lý hệ thống</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Quản lý người dùng
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Nội dung chờ phê duyệt
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
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
                      <option value="">Tất cả vai trò</option>
                      <option value="teacher">Giáo viên</option>
                      <option value="student">Học sinh</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                {usersLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày tham gia
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(usersData?.data.data) && usersData.data.data.length > 0 ? (
                          usersData.data.data.map((user) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-sm font-medium text-blue-600">
                                        {user.fullName?.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.fullName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.phone}
                                    </div>
                                    {user.email && (
                                      <div className="text-sm text-gray-400">
                                        {user.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'teacher' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {getRoleLabel(user.role)}
                                </span>
                                {user.school && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {user.school}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {getStatusLabel(user.isActive)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                                    disabled={updateUserStatusMutation.isLoading}
                                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md ${
                                      user.isActive
                                        ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                                    }`}
                                  >
                                    {user.isActive ? <XCircle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                                    {user.isActive ? 'Khóa' : 'Kích hoạt'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user._id, user.fullName)}
                                    disabled={deleteUserMutation.isLoading}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center">
                              <div className="text-center">
                                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  Không có người dùng nào
                                </h3>
                                <p className="text-gray-500">
                                  {searchTerm || roleFilter 
                                    ? 'Không tìm thấy người dùng phù hợp với bộ lọc.'
                                    : 'Chưa có người dùng nào trong hệ thống.'
                                  }
                                </p>
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

            {activeTab === 'content' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Nội dung chờ phê duyệt ({pendingContent?.data?.length || 0})
                </h3>

                {contentLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(pendingContent?.data.data) && pendingContent.data.data.length > 0 ? (
                      pendingContent.data.data.map((content) => (
                        <div key={content._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900 mb-2">
                                {content.title}
                              </h4>
                              {content.description && (
                                <div 
                                  className="text-gray-600 mb-2"
                                  dangerouslySetInnerHTML={{ __html: content.description }}
                                />
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Tác giả: {content.author?.fullName}</span>
                                <span>Danh mục: {content.category}</span>
                                <span>Loại: {content.subCategory}</span>
                                <span>Ngày đăng: {new Date(content.createdAt).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handleApproveContent(content._id, content.title)}
                                disabled={approveContentMutation.isLoading}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Phê duyệt
                              </button>
                              <button
                                onClick={() => handleDeleteContent(content._id, content.title)}
                                disabled={deleteContentMutation.isLoading}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Không có nội dung chờ phê duyệt
                        </h3>
                        <p className="text-gray-500">
                          Tất cả nội dung đã được phê duyệt hoặc chưa có nội dung nào được đăng tải.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 