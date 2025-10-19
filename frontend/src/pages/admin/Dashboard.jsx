import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { fetchDashboardStats, clearError } from '../../features/admin/adminSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, recentOrders, topProducts, loading, error } = useSelector(
    (state) => state.admin
  );

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    dispatch(fetchDashboardStats(dateRange));
  }, [dispatch, dateRange]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    dispatch(fetchDashboardStats(dateRange));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Start Date"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Completed: {dashboardStats.completedOrders}</span>
                <span className="text-yellow-600">Pending: {dashboardStats.pendingOrders}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardStats.totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                Avg Order: {formatCurrency(dashboardStats.averageOrderValue)}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-2xl font-bold text-gray-900">{dashboardStats.totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <a
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View all
            </a>
          </div>
          
          <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">#{order.orderId}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
            <a
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View all
            </a>
          </div>
          
          <div className="space-y-3">
            {topProducts && topProducts.length > 0 ? (
              topProducts.slice(0, 5).map((product, index) => (
                <div key={product._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-medium rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.totalQuantity} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(product.totalRevenue)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No sales data</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900">Manage Products</p>
              <p className="text-sm text-blue-600">Add, edit, or remove products</p>
            </div>
          </a>
          
          <a
            href="/admin/orders"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <ShoppingCart className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">Process Orders</p>
              <p className="text-sm text-green-600">Update order status</p>
            </div>
          </a>
          
          <a
            href="/admin/users"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Users className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-purple-900">Manage Users</p>
              <p className="text-sm text-purple-600">View and manage customers</p>
            </div>
          </a>
          
          <a
            href="/admin/coupons"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="font-medium text-orange-900">Create Coupons</p>
              <p className="text-sm text-orange-600">Manage discount codes</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
