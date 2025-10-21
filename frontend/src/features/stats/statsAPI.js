import api from '../../services/api';

// Get statistics for about page
export const getStats = async () => {
  try {
    const response = await api.get('/stats/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};
