import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  X,
  Save,
  FileText,
  Download,
} from 'lucide-react';
import {
  fetchAdminOrders,
  updateOrderStatus,
  setCurrentOrder,
  clearError,
  clearSuccessMessage,
} from '../../features/admin/adminSlice';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const {
    orders,
    ordersPagination,
    currentOrder,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'
  const [statusFormData, setStatusFormData] = useState({
    orderStatus: '',
    trackingId: '',
    shippingProvider: '',
  });

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  const shippingProviders = [
    'BlueDart',
    'DTDC',
    'FedEx',
    'DHL',
    'India Post',
    'Aramex',
    'Professional Couriers',
  ];

  useEffect(() => {
    dispatch(fetchAdminOrders(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleRefresh = () => {
    dispatch(fetchAdminOrders(filters));
  };

  const openModal = (mode, order = null) => {
    setModalMode(mode);
    if (order) {
      dispatch(setCurrentOrder(order));
      setStatusFormData({
        orderStatus: order.orderStatus || '',
        trackingId: order.shippingDetails?.trackingId || '',
        shippingProvider: order.shippingDetails?.provider || '',
      });
    } else {
      dispatch(setCurrentOrder(null));
      setStatusFormData({
        orderStatus: '',
        trackingId: '',
        shippingProvider: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setStatusFormData({
      orderStatus: '',
      trackingId: '',
      shippingProvider: '',
    });
    dispatch(setCurrentOrder(null));
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    
    const updateData = {
      orderId: currentOrder._id,
      status: statusFormData.orderStatus,
      trackingInfo: {},
    };

    if (statusFormData.orderStatus === 'shipped') {
      updateData.trackingInfo = {
        trackingId: statusFormData.trackingId,
        shippingProvider: statusFormData.shippingProvider,
      };
    }

    dispatch(updateOrderStatus(updateData));
    closeModal();
  };

  const getStatusColor = (status) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Edit className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadInvoice = (orderId) => {
    // In a real implementation, this would generate and download an invoice
    console.log('Download invoice for order:', orderId);
    // You could make an API call to generate PDF invoice
  };

  const handleExportOrders = () => {
    // Export orders to CSV
    const csv = [
      ['Order ID', 'Customer', 'Total', 'Status', 'Date'].join(','),
      ...orders.map((order) =>
        [
          order.orderId || order._id.slice(-6),
          `"${order.user?.firstName} ${order.user?.lastName}"` || 'N/A',
          order.totalAmount,
          order.orderStatus,
          new Date(order.createdAt).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders and fulfillment
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={handleExportOrders}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          
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

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (!orders || orders.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : (!orders || orders.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <p>No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.firstName} {order.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{order.orderStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', order)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Update Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {ordersPagination && ordersPagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(ordersPagination.page - 1)}
                disabled={ordersPagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(ordersPagination.page + 1)}
                disabled={ordersPagination.page === ordersPagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(ordersPagination.page - 1) * ordersPagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      ordersPagination.page * ordersPagination.limit,
                      ordersPagination.total
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{ordersPagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from(
                    { length: ordersPagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === ordersPagination.page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showModal && currentOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {modalMode === 'view' && `Order #${currentOrder.orderId}`}
                    {modalMode === 'edit' && `Update Order #${currentOrder.orderId}`}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {modalMode === 'view' ? (
                  // View Mode
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Order Information</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                            <dd className="text-sm text-gray-900">#{currentOrder.orderId}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentOrder.orderStatus)}`}>
                                {getStatusIcon(currentOrder.orderStatus)}
                                <span className="ml-1">{currentOrder.orderStatus}</span>
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                            <dd className="text-sm text-gray-900">{currentOrder.paymentStatus}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                            <dd className="text-sm text-gray-900">{formatDate(currentOrder.createdAt)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                            <dd className="text-sm font-medium text-gray-900">{formatCurrency(currentOrder.totalAmount)}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Customer Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="text-sm text-gray-900">
                              {currentOrder.user?.firstName} {currentOrder.user?.lastName}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="text-sm text-gray-900">{currentOrder.user?.email}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="text-sm text-gray-900">{currentOrder.shippingAddress?.phone || 'N/A'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {currentOrder.shippingAddress && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h4>
                        <div className="text-sm text-gray-900">
                          <p>{currentOrder.shippingAddress.fullName}</p>
                          <p>{currentOrder.shippingAddress.addressLine1}</p>
                          {currentOrder.shippingAddress.addressLine2 && (
                            <p>{currentOrder.shippingAddress.addressLine2}</p>
                          )}
                          <p>
                            {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}
                          </p>
                          <p>{currentOrder.shippingAddress.country}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {currentOrder.items?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.product?.name || 'Product'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Size: {item.size}, Color: {item.color}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {item.quantity} × {formatCurrency(item.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(item.quantity * item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Details */}
                    {currentOrder.shippingDetails && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Shipping Details</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Provider</dt>
                            <dd className="text-sm text-gray-900">{currentOrder.shippingDetails.provider}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Tracking ID</dt>
                            <dd className="text-sm text-gray-900">{currentOrder.shippingDetails.trackingId}</dd>
                          </div>
                          {currentOrder.shippingDetails.shippedAt && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Shipped At</dt>
                              <dd className="text-sm text-gray-900">{formatDate(currentOrder.shippingDetails.shippedAt)}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                ) : (
                  // Edit Mode - Status Update Form
                  <form onSubmit={handleStatusUpdate}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order Status *
                        </label>
                        <select
                          value={statusFormData.orderStatus}
                          onChange={(e) => setStatusFormData(prev => ({ ...prev, orderStatus: e.target.value }))}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Select Status</option>
                          {orderStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {statusFormData.orderStatus === 'shipped' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Shipping Provider
                            </label>
                            <select
                              value={statusFormData.shippingProvider}
                              onChange={(e) => setStatusFormData(prev => ({ ...prev, shippingProvider: e.target.value }))}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="">Select Provider</option>
                              {shippingProviders.map((provider) => (
                                <option key={provider} value={provider}>
                                  {provider}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tracking ID
                            </label>
                            <input
                              type="text"
                              value={statusFormData.trackingId}
                              onChange={(e) => setStatusFormData(prev => ({ ...prev, trackingId: e.target.value }))}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter tracking ID"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Update Status
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
