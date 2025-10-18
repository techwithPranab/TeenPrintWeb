import api from '../../services/api';

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const logout = () => {
  return api.post('/auth/logout');
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export const updateProfile = (profileData) => {
  return api.put('/auth/profile', profileData);
};

export const updatePassword = (passwordData) => {
  return api.put('/auth/change-password', passwordData);
};

export const refreshToken = (refreshToken) => {
  return api.post('/auth/refresh', { refreshToken });
};

// Google OAuth - redirect to backend
export const initiateGoogleLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  window.location.href = `${apiUrl}/auth/google`;
};
