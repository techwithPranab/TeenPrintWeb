import api from '../../services/api';

/**
 * Create order
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Verify payment
 */
export const verifyPayment = async (paymentData) => {
  const response = await api.post('/orders/verify-payment', paymentData);
  return response.data;
};

/**
 * Get user orders
 */
export const getOrders = async (params) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
};
