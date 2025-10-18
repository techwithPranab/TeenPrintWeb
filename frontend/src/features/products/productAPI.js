import api from '../../services/api';

/**
 * Get all products with filters
 */
export const getProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  const response = await api.get('/products/featured', { params: { limit } });
  return response.data;
};

/**
 * Get product by slug
 */
export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (categoryId, params) => {
  const response = await api.get(`/products/category/${categoryId}`, { params });
  return response.data;
};
