import api from './api';

// Upload services
export const uploadImage = async (formData) => {
  const response = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
