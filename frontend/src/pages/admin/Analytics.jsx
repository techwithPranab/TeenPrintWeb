import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from 'lucide-react';
import { fetchAnalyticsData, clearError } from '../../features/admin/adminSlice';

const Analytics = () => {
  const dispatch = useDispatch();
  const { analyticsData, loading, error } = useSelector((state) => state.admin);

  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    dispatch(fetchAnalyticsData(timeRange));
  }, [dispatch, timeRange]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAnalyticsData(timeRange));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track performance and get predictive insights
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

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

      {analyticsData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.revenueGrowth >= 0 ? '+' : ''}{analyticsData.revenueGrowth.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-full ${analyticsData.revenueGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {analyticsData.revenueGrowth >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                vs previous period
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Order Growth</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.orderGrowth >= 0 ? '+' : ''}{analyticsData.orderGrowth.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-full ${analyticsData.orderGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {analyticsData.orderGrowth >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                vs previous period
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analyticsData.averageOrderValue)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Current period
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Visitors to orders
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Revenue Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Order Trend */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.orderTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  Order Status Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.orderStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.orderStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Top Products by Revenue
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Bar dataKey="revenue" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Predictions Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Predictive Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Revenue Forecast</h4>
                <p className="text-sm text-blue-700">
                  Next month revenue is predicted to be{' '}
                  <span className="font-bold">
                    {formatCurrency(analyticsData.predictions.nextMonthRevenue)}
                  </span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Based on current trends and seasonality
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Order Volume</h4>
                <p className="text-sm text-green-700">
                  Expected orders: <span className="font-bold">{analyticsData.predictions.nextMonthOrders}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {analyticsData.predictions.orderGrowth > 0 ? '+' : ''}{analyticsData.predictions.orderGrowth.toFixed(1)}% growth expected
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Top Performing Category</h4>
                <p className="text-sm text-purple-700">
                  <span className="font-bold">{analyticsData.predictions.topCategory}</span> shows highest growth potential
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Focus marketing efforts here
                </p>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Acquisition */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Customer Acquisition
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Customers</span>
                  <span className="font-medium">{analyticsData.customerMetrics.newCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Returning Customers</span>
                  <span className="font-medium">{analyticsData.customerMetrics.returningCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customer Retention Rate</span>
                  <span className="font-medium">{analyticsData.customerMetrics.retentionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Customer Lifetime Value</span>
                  <span className="font-medium">{formatCurrency(analyticsData.customerMetrics.averageLifetimeValue)}</span>
                </div>
              </div>
            </div>

            {/* Inventory Insights */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Inventory Insights
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Stock Items</span>
                  <span className="font-medium text-orange-600">{analyticsData.inventoryMetrics.lowStockItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Out of Stock Items</span>
                  <span className="font-medium text-red-600">{analyticsData.inventoryMetrics.outOfStockItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Stock Level</span>
                  <span className="font-medium">{analyticsData.inventoryMetrics.averageStockLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock Turnover Rate</span>
                  <span className="font-medium">{analyticsData.inventoryMetrics.stockTurnoverRate.toFixed(1)}x</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
