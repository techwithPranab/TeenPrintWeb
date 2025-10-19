import api from '../../services/api';

// Dashboard APIs
export const getDashboardStats = (dateRange) => {
  const params = {};
  if (dateRange?.startDate) params.startDate = dateRange.startDate;
  if (dateRange?.endDate) params.endDate = dateRange.endDate;
  
  return api.get('/admin/dashboard', { params });
};

// Orders APIs
export const getAllOrders = (params) => {
  return api.get('/admin/orders', { params });
};

export const updateOrderStatus = (orderId, statusData) => {
  return api.put(`/admin/orders/${orderId}/status`, statusData);
};

// Users APIs
export const getAllUsers = (params) => {
  return api.get('/admin/users', { params });
};

export const updateUserRole = (userId, roleData) => {
  return api.put(`/admin/users/${userId}/role`, roleData);
};

// Products APIs
export const getAllProducts = (params) => {
  return api.get('/admin/products', { params });
};

export const createProduct = (productData) => {
  return api.post('/admin/products', productData);
};

export const updateProduct = (productId, productData) => {
  return api.put(`/admin/products/${productId}`, productData);
};

export const deleteProduct = (productId) => {
  return api.delete(`/admin/products/${productId}`);
};

// Coupons APIs
export const getAllCoupons = () => {
  return api.get('/admin/coupons');
};

export const createCoupon = (couponData) => {
  return api.post('/admin/coupons', couponData);
};

export const updateCoupon = (couponId, couponData) => {
  return api.put(`/admin/coupons/${couponId}`, couponData);
};

export const deleteCoupon = (couponId) => {
  return api.delete(`/admin/coupons/${couponId}`);
};

// Contacts APIs
export const getAllContacts = (params) => {
  return api.get('/admin/contacts', { params });
};

export const getContactById = (contactId) => {
  return api.get(`/admin/contacts/${contactId}`);
};

export const updateContactStatus = (contactId, statusData) => {
  return api.put(`/admin/contacts/${contactId}/status`, statusData);
};

export const deleteContact = (contactId) => {
  return api.delete(`/admin/contacts/${contactId}`);
};
