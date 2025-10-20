import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Calendar,
  Percent,
  Users,
  CheckCircle,
  X,
  Save,
  Copy,
  Tag,
} from 'lucide-react';
import {
  fetchAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  setCurrentCoupon,
  clearError,
  clearSuccessMessage,
} from '../../features/admin/adminSlice';

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const {
    coupons,
    couponsPagination,
    currentCoupon,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    page: 1,
    limit: 10,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true,
    description: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const couponTypes = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed Amount' },
  ];

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    dispatch(fetchAdminCoupons(filters));
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
    dispatch(fetchAdminCoupons(filters));
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const openModal = (mode, coupon = null) => {
    setModalMode(mode);
    if (coupon) {
      dispatch(setCurrentCoupon(coupon));
      setFormData({
        code: coupon.code || '',
        type: coupon.type || 'percentage',
        value: coupon.value || '',
        minOrderAmount: coupon.minOrderAmount || '',
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        usageLimit: coupon.usageLimit || '',
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
        isActive: coupon.isActive !== false,
        description: coupon.description || '',
      });
    } else {
      dispatch(setCurrentCoupon(null));
      setFormData({
        code: generateCouponCode(),
        type: 'percentage',
        value: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        expiryDate: '',
        isActive: true,
        description: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      expiryDate: '',
      isActive: true,
      description: '',
    });
    dispatch(setCurrentCoupon(null));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const couponData = {
      ...formData,
      value: parseFloat(formData.value),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
    };

    if (modalMode === 'create') {
      dispatch(createAdminCoupon(couponData));
    } else if (modalMode === 'edit') {
      dispatch(updateAdminCoupon({ 
        couponId: currentCoupon._id, 
        couponData 
      }));
    }
    closeModal();
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (couponToDelete) {
      dispatch(deleteAdminCoupon(couponToDelete._id));
      setShowDeleteModal(false);
      setCouponToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
  };

  const copyCouponCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could show a toast notification here
    } catch (err) {
      console.error('Failed to copy coupon code:', err);
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
    });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getStatusColor = (coupon) => {
    if (!coupon.isActive) return 'bg-gray-100 text-gray-800';
    if (coupon.expiryDate && isExpired(coupon.expiryDate)) return 'bg-red-100 text-red-800';
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatus = (coupon) => {
    if (!coupon.isActive) return 'Inactive';
    if (coupon.expiryDate && isExpired(coupon.expiryDate)) return 'Expired';
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'Exhausted';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage discount coupons and promotional codes
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={() => openModal('create')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
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
              placeholder="Search coupons..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Types</option>
            {couponTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
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

      {/* Coupons Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (!coupons || coupons.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                      Loading coupons...
                    </div>
                  </td>
                </tr>
              ) : (!coupons || coupons.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Tag className="w-12 h-12 text-gray-300 mb-4" />
                      <p>No coupons found</p>
                      <button
                        onClick={() => openModal('create')}
                        className="mt-2 text-blue-600 hover:text-blue-900"
                      >
                        Create your first coupon
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {coupon.code}
                            <button
                              onClick={() => copyCouponCode(coupon.code)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Copy code"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          {coupon.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {coupon.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.type === 'percentage' ? (
                          <span className="flex items-center">
                            <Percent className="w-4 h-4 mr-1 text-green-600" />
                            {coupon.value}%
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="w-4 h-4 mr-1 text-green-600 font-bold text-sm flex items-center justify-center">₹</span>
                            {formatCurrency(coupon.value)}
                          </span>
                        )}
                      </div>
                      {coupon.minOrderAmount && (
                        <div className="text-sm text-gray-500">
                          Min: {formatCurrency(coupon.minOrderAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {coupon.usedCount || 0}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </div>
                      {coupon.usageLimit && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                ((coupon.usedCount || 0) / coupon.usageLimit) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coupon.expiryDate ? (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(coupon.expiryDate)}
                        </div>
                      ) : (
                        'No expiry'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(coupon)}`}>
                        {getStatus(coupon) === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {getStatus(coupon) === 'Inactive' && <X className="w-3 h-3 mr-1" />}
                        {getStatus(coupon)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', coupon)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Coupon"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', coupon)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Coupon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(coupon)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
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
        {couponsPagination && couponsPagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(couponsPagination.page - 1)}
                disabled={couponsPagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(couponsPagination.page + 1)}
                disabled={couponsPagination.page === couponsPagination.pages}
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
                    {(couponsPagination.page - 1) * couponsPagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      couponsPagination.page * couponsPagination.limit,
                      couponsPagination.total
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{couponsPagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from(
                    { length: couponsPagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === couponsPagination.page
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

      {/* Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {modalMode === 'create' && 'Create New Coupon'}
                    {modalMode === 'edit' && 'Edit Coupon'}
                    {modalMode === 'view' && 'Coupon Details'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {modalMode === 'view' && currentCoupon ? (
                  // View Mode
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900 flex items-center">
                            {currentCoupon.code}
                            <button
                              onClick={() => copyCouponCode(currentCoupon.code)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Copy code"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                          </h4>
                          {currentCoupon.description && (
                            <p className="text-gray-600 mt-1">{currentCoupon.description}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentCoupon)}`}>
                          {getStatus(currentCoupon)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Discount Details</h5>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Type</dt>
                            <dd className="text-sm text-gray-900 flex items-center">
                              {currentCoupon.type === 'percentage' ? (
                                <>
                                  <Percent className="w-4 h-4 mr-1 text-green-600" />
                                  Percentage
                                </>
                              ) : (
                                <>
                                  <span className="w-4 h-4 mr-1 text-green-600 font-bold text-sm flex items-center justify-center">₹</span>
                                  Fixed Amount
                                </>
                              )}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Value</dt>
                            <dd className="text-sm text-gray-900">
                              {currentCoupon.type === 'percentage' 
                                ? `${currentCoupon.value}%` 
                                : formatCurrency(currentCoupon.value)
                              }
                            </dd>
                          </div>
                          {currentCoupon.minOrderAmount && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Minimum Order</dt>
                              <dd className="text-sm text-gray-900">{formatCurrency(currentCoupon.minOrderAmount)}</dd>
                            </div>
                          )}
                          {currentCoupon.maxDiscountAmount && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Maximum Discount</dt>
                              <dd className="text-sm text-gray-900">{formatCurrency(currentCoupon.maxDiscountAmount)}</dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Usage & Validity</h5>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Usage Count</dt>
                            <dd className="text-sm text-gray-900 flex items-center">
                              <Users className="w-4 h-4 mr-1 text-gray-400" />
                              {currentCoupon.usedCount || 0}
                              {currentCoupon.usageLimit && ` / ${currentCoupon.usageLimit}`}
                            </dd>
                          </div>
                          {currentCoupon.expiryDate && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                              <dd className="text-sm text-gray-900 flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                {formatDate(currentCoupon.expiryDate)}
                              </dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created</dt>
                            <dd className="text-sm text-gray-900">{formatDate(currentCoupon.createdAt)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Create/Edit Mode
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Coupon Code *
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              value={formData.code}
                              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                              required
                              className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter coupon code"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, code: generateCouponCode() }))}
                              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                            >
                              Generate
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                          </label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {couponTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {formData.type === 'percentage' ? 'Percentage *' : 'Amount *'}
                          </label>
                          <input
                            type="number"
                            value={formData.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                            required
                            min="0"
                            max={formData.type === 'percentage' ? '100' : undefined}
                            step={formData.type === 'percentage' ? '0.01' : '1'}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder={formData.type === 'percentage' ? '10' : '100'}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Order Amount
                          </label>
                          <input
                            type="number"
                            value={formData.minOrderAmount}
                            onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                            min="0"
                            step="1"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Discount Amount
                          </label>
                          <input
                            type="number"
                            value={formData.maxDiscountAmount}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                            min="0"
                            step="1"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="1000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usage Limit
                          </label>
                          <input
                            type="number"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                            min="1"
                            step="1"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                          min={today}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Optional description for the coupon"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Coupon is active
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {modalMode === 'create' ? 'Create Coupon' : 'Update Coupon'}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && couponToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleDeleteCancel}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Coupon
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete coupon{' '}
                        <span className="font-medium text-gray-900">
                          {couponToDelete.code}
                        </span>
                        ? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
