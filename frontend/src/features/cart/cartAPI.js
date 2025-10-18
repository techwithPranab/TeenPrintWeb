import api from '../../services/api';

/**
 * Get cart
 */
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

/**
 * Add to cart
 */
export const addToCart = async (item) => {
  const response = await api.post('/cart/add', item);
  return response.data;
};

/**
 * Update cart item
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/item/${itemId}`, { quantity });
  return response.data;
};

/**
 * Remove from cart
 */
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/item/${itemId}`);
  return response.data;
};

/**
 * Apply coupon
 */
export const applyCoupon = async (code) => {
  const response = await api.post('/cart/coupon/apply', { code });
  return response.data;
};

/**
 * Remove coupon
 */
export const removeCoupon = async () => {
  const response = await api.delete('/cart/coupon');
  return response.data;
};

/**
 * Clear cart
 */
export const clearCart = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};
