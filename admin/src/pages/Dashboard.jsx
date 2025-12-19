import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { FileText, Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { contentAPI, userAPI } from '../services/api';
import { useAuthStore } from '../store';

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery(
    'admin-stats',
    async () => {
      const [contentRes, userRes, pendingRes] = await Promise.all([
        contentAPI.getAll({ limit: 1000 }),
        userAPI.getAll({ limit: 1000 }),
        contentAPI.getAll({ isApproved: false, limit: 1000 }),
      ]);

      const allContent = contentRes.data.data || [];
      const allUsers = userRes.data.data || [];
      const pendingContent = pendingRes.data.data || [];

      return {
        totalContent: allContent.length,
        approvedContent: allContent.filter((c) => c.isApproved).length,
        pendingContent: pendingContent.length,
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter((u) => u.isActive).length,
        teachers: allUsers.filter((u) => u.role === 'teacher').length,
        students: allUsers.filter((u) => u.role === 'student').length,
      };
    }
  );

  const statCards = [
    {
      title: 'Tổng tài liệu',
      value: stats?.totalContent || 0,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/content',
    },
    {
      title: 'Đã phê duyệt',
      value: stats?.approvedContent || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/content?isApproved=true',
    },
    {
      title: 'Chờ phê duyệt',
      value: stats?.pendingContent || 0,
      icon: XCircle,
      color: 'bg-yellow-500',
      link: '/content?isApproved=false',
    },
    {
      title: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      link: '/users',
    },
    {
      title: 'Giáo viên',
      value: stats?.teachers || 0,
      icon: Users,
      color: 'bg-indigo-500',
      link: '/users?role=teacher',
    },
    {
      title: 'Học sinh',
      value: stats?.students || 0,
      icon: Users,
      color: 'bg-pink-500',
      link: '/users?role=student',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng, {user?.fullName}
        </h1>
        <p className="text-gray-600">Tổng quan hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Tỷ lệ phê duyệt</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.totalContent > 0
                  ? Math.round((stats.approvedContent / stats.totalContent) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    stats?.totalContent > 0
                      ? (stats.approvedContent / stats.totalContent) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Người dùng hoạt động</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.activeUsers || 0} / {stats?.totalUsers || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${
                    stats?.totalUsers > 0
                      ? (stats.activeUsers / stats.totalUsers) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

