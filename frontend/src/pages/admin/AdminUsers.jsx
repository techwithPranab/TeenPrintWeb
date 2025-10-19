import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  ShieldOff,
  Check,
  X,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  fetchAdminUsers,
  updateUserRole,
  setCurrentUser,
  clearError,
  clearSuccessMessage,
} from '../../features/admin/adminSlice';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const {
    users,
    usersPagination,
    currentUser,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    page: 1,
    limit: 10,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'
  const [userFormData, setUserFormData] = useState({
    role: '',
    isActive: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const userRoles = [
    { value: 'user', label: 'Customer', color: 'bg-gray-100 text-gray-800' },
    { value: 'admin', label: 'Admin', color: 'bg-blue-100 text-blue-800' },
    { value: 'superadmin', label: 'Super Admin', color: 'bg-purple-100 text-purple-800' },
  ];

  useEffect(() => {
    dispatch(fetchAdminUsers(filters));
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
    dispatch(fetchAdminUsers(filters));
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    if (user) {
      dispatch(setCurrentUser(user));
      setUserFormData({
        role: user.role || 'user',
        isActive: user.isActive !== false,
      });
    } else {
      dispatch(setCurrentUser(null));
      setUserFormData({
        role: 'user',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserFormData({
      role: 'user',
      isActive: true,
    });
    dispatch(setCurrentUser(null));
  };

  const handleUserUpdate = (e) => {
    e.preventDefault();
    
    const updateData = {
      userId: currentUser._id,
      role: userFormData.role,
      isActive: userFormData.isActive,
    };

    dispatch(updateUserRole(updateData));
    closeModal();
  };

  const handleToggleUserStatus = (userId, currentStatus) => {
    // TODO: Implement toggleUserStatus action
    console.log('Toggle user status:', userId, currentStatus);
    // dispatch(toggleUserStatus({
    //   userId,
    //   isActive: !currentStatus,
    // }));
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      // TODO: Implement deleteUser action
      console.log('Delete user:', userToDelete._id);
      // dispatch(deleteUser(userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const getRoleColor = (role) => {
    const roleConfig = userRoles.find(r => r.value === role);
    return roleConfig ? roleConfig.color : 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    const roleConfig = userRoles.find(r => r.value === role);
    return roleConfig ? roleConfig.label : role;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
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
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Roles</option>
            {userRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
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

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <UserPlus className="w-12 h-12 text-gray-300 mb-4" />
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' || user.role === 'superadmin' ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : null}
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive !== false ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View User"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user._id, user.isActive !== false)}
                          className={`${
                            user.isActive !== false ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={user.isActive !== false ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive !== false ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
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
        {usersPagination && usersPagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(usersPagination.page - 1)}
                disabled={usersPagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(usersPagination.page + 1)}
                disabled={usersPagination.page === usersPagination.pages}
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
                    {(usersPagination.page - 1) * usersPagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      usersPagination.page * usersPagination.limit,
                      usersPagination.total
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{usersPagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from(
                    { length: usersPagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === usersPagination.page
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

      {/* User Modal */}
      {showModal && currentUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {modalMode === 'view' && `User Details`}
                    {modalMode === 'edit' && `Edit User`}
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
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-700">
                          {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {currentUser.firstName} {currentUser.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {getRoleLabel(currentUser.role)} • {currentUser.isActive !== false ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h5>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="text-sm text-gray-900 flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {currentUser.email}
                            </dd>
                          </div>
                          {currentUser.phone && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Phone</dt>
                              <dd className="text-sm text-gray-900 flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {currentUser.phone}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Account Information</h5>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">User ID</dt>
                            <dd className="text-sm text-gray-900">{currentUser._id}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Joined</dt>
                            <dd className="text-sm text-gray-900 flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatDate(currentUser.createdAt)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                            <dd className="text-sm text-gray-900">
                              {currentUser.lastLogin ? formatDate(currentUser.lastLogin) : 'Never'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Addresses */}
                    {currentUser.addresses && currentUser.addresses.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Addresses</h5>
                        <div className="space-y-3">
                          {currentUser.addresses.map((address, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start">
                                <MapPin className="w-4 h-4 mt-1 mr-2 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{address.fullName}</p>
                                  <p className="text-sm text-gray-600">
                                    {address.addressLine1}
                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {address.city}, {address.state} {address.postalCode}
                                  </p>
                                  <p className="text-sm text-gray-600">{address.country}</p>
                                  {address.phone && (
                                    <p className="text-sm text-gray-500">Phone: {address.phone}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Edit Mode
                  <form onSubmit={handleUserUpdate}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role *
                        </label>
                        <select
                          value={userFormData.role}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {userRoles.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={userFormData.isActive}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          User is active
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      >
                        Update User
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
      {showDeleteModal && userToDelete && (
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
                      Delete User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete user{' '}
                        <span className="font-medium">
                          {userToDelete.firstName} {userToDelete.lastName}
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

export default AdminUsers;
