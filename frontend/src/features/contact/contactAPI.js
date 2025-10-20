import api from '../../services/api';
import axios from 'axios';

// Get the base URL for direct calls without auth
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

// Submit contact form
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get contact information (public endpoint - no auth required)
export const getContactInfo = async () => {
  try {
    // Use axios directly without the auth interceptor for this public endpoint
    const response = await axios.get(`${API_BASE_URL}/contact/info`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  submitContactForm,
  getContactInfo,
};
