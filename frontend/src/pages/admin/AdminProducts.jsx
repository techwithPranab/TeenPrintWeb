import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  RefreshCw,
  X,
  Save,
  Upload,
} from 'lucide-react';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  setCurrentProduct,
  clearError,
  clearSuccessMessage,
} from '../../features/admin/adminSlice';
import { fetchCategories } from '../../features/categories/categorySlice';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { 
    adminProducts, 
    adminProductsPagination, 
    currentProduct, 
    loading, 
    error, 
    successMessage 
  } = useSelector((state) => state.admin);
  const { categories } = useSelector((state) => state.categories);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    inStock: '',
    page: 1,
    limit: 10,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FFFFFF'],
    mockupImages: [],
    tags: [],
    inStock: true,
    featured: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
    dispatch(fetchAdminProducts(filters));
  };

  const openModal = (mode, product = null) => {
    setModalMode(mode);
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || '',
        sizes: product.sizes || ['S', 'M', 'L', 'XL'],
        colors: product.colors || ['#000000', '#FFFFFF'],
        mockupImages: product.mockupImages || [],
        tags: product.tags || [],
        inStock: product.inStock !== undefined ? product.inStock : true,
        featured: product.featured || false,
      });
      dispatch(setCurrentProduct(product));
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#FFFFFF'],
        mockupImages: [],
        tags: [],
        inStock: true,
        featured: false,
      });
      dispatch(setCurrentProduct(null));
    }
    setImagePreview(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#000000', '#FFFFFF'],
      mockupImages: [],
      tags: [],
      inStock: true,
      featured: false,
    });
    setImagePreview(null);
    dispatch(setCurrentProduct(null));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (files) => {
    // In a real implementation, you would upload to your server or cloud storage
    // For now, we'll just show a preview
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // Add to mockupImages array
        setFormData(prev => ({
          ...prev,
          mockupImages: [...prev.mockupImages, e.target.result],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (modalMode === 'create') {
      dispatch(createAdminProduct(productData));
    } else if (modalMode === 'edit') {
      dispatch(updateAdminProduct({ 
        productId: currentProduct._id, 
        productData 
      }));
    }
    
    closeModal();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteAdminProduct(productId));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog
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
          
          <button
            onClick={() => openModal('create')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
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
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Stock Status</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
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

      {/* Products Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && adminProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : adminProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <p>No products found</p>
                      <button
                        onClick={() => openModal('create')}
                        className="mt-2 text-blue-600 hover:text-blue-500"
                      >
                        Create your first product
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                adminProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.mockupImages && product.mockupImages[0] ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.mockupImages[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.featured 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.featured ? 'Featured' : 'Regular'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', product)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Product"
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
        {adminProductsPagination && adminProductsPagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(adminProductsPagination.page - 1)}
                disabled={adminProductsPagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(adminProductsPagination.page + 1)}
                disabled={adminProductsPagination.page === adminProductsPagination.pages}
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
                    {(adminProductsPagination.page - 1) * adminProductsPagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      adminProductsPagination.page * adminProductsPagination.limit,
                      adminProductsPagination.total
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{adminProductsPagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from(
                    { length: adminProductsPagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === adminProductsPagination.page
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

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {modalMode === 'create' && 'Add New Product'}
                      {modalMode === 'edit' && 'Edit Product'}
                      {modalMode === 'view' && 'Product Details'}
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          disabled={modalMode === 'view'}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          disabled={modalMode === 'view'}
                          rows={4}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => handleFormChange('price', e.target.value)}
                            disabled={modalMode === 'view'}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => handleFormChange('category', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inStock}
                            onChange={(e) => handleFormChange('inStock', e.target.checked)}
                            disabled={modalMode === 'view'}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">In Stock</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => handleFormChange('featured', e.target.checked)}
                            disabled={modalMode === 'view'}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">Featured</span>
                        </label>
                      </div>
                    </div>

                    {/* Images and Additional Info */}
                    <div className="space-y-4">
                      {/* Image Upload */}
                      {modalMode !== 'view' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Images
                          </label>
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center ${
                              dragActive 
                                ? 'border-blue-400 bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                          >
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                Drag and drop images here, or{' '}
                                <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                                  browse
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e.target.files)}
                                    className="hidden"
                                  />
                                </label>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Display uploaded images */}
                      {formData.mockupImages.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uploaded Images
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {formData.mockupImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                                {modalMode !== 'view' && (
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('mockupImages', index)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sizes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Available Sizes
                        </label>
                        <div className="space-y-2">
                          {formData.sizes.map((size, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={size}
                                onChange={(e) => handleArrayChange('sizes', index, e.target.value)}
                                disabled={modalMode === 'view'}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                              />
                              {modalMode !== 'view' && (
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('sizes', index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          {modalMode !== 'view' && (
                            <button
                              type="button"
                              onClick={() => addArrayItem('sizes', 'XS')}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              + Add Size
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Available Colors
                        </label>
                        <div className="space-y-2">
                          {formData.colors.map((color, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => handleArrayChange('colors', index, e.target.value)}
                                disabled={modalMode === 'view'}
                                className="w-8 h-8 border border-gray-300 rounded disabled:opacity-50"
                              />
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => handleArrayChange('colors', index, e.target.value)}
                                disabled={modalMode === 'view'}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                              />
                              {modalMode !== 'view' && (
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('colors', index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          {modalMode !== 'view' && (
                            <button
                              type="button"
                              onClick={() => addArrayItem('colors', '#000000')}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              + Add Color
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {modalMode !== 'view' && (
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {modalMode === 'create' ? 'Create Product' : 'Update Product'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
