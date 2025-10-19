import api from '../../services/api';

// Get reviews for a product
export const getProductReviews = async (productId, params = {}) => {
  try {
    const response = await api.get(`/reviews/products/${productId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new review
export const createReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/reviews/products/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mark review as helpful
export const markReviewHelpful = async (reviewId) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's reviews
export const getUserReviews = async (params = {}) => {
  try {
    const response = await api.get('/reviews/user', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getUserReviews,
};
