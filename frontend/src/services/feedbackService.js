import api from './api';

// Feedback services
export const getAllFeedback = async (params = {}) => {
  try {
    console.log('Fetching all feedback with params:', params);
    const response = await api.get('/feedback', { params });
    console.log('Raw API response status:', response.status);
    
    // Make sure we're correctly handling the response structure
    const result = response.data;
    
    // Log the first item to help with debugging
    if (result && result.data && result.data.length > 0) {
      console.log('Sample feedback item:', {
        id: result.data[0]._id,
        title: result.data[0].title,
        user: result.data[0].user?.name || 'Unknown',
        category: result.data[0].category?.name || 'Uncategorized',
        hasComments: result.data[0].comments?.length > 0
      });
    }
    
    if (result && result.data && Array.isArray(result.data)) {
      console.log(`getAllFeedback: Got ${result.data.length} items in standard format`);
      return result;
    } else if (Array.isArray(result)) {
      console.log(`getAllFeedback: Got ${result.length} items in direct array format`);
      return { success: true, data: result };
    } else {
      console.warn('Unexpected response format in getAllFeedback:', result);
      return { success: false, data: [] };
    }
  } catch (error) {
    console.error('Error in getAllFeedback:', error);
    throw error;
  }
};

export const getFeedbackById = async (id) => {
  const response = await api.get(`/feedback/${id}`);
  return response.data;
};

export const createFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const updateFeedback = async (id, feedbackData) => {
  const response = await api.put(`/feedback/${id}`, feedbackData);
  return response.data;
};

export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedback/${id}`);
  return response.data;
};

export const upvoteFeedback = async (id) => {
  const response = await api.put(`/feedback/${id}/upvote`);
  return response.data;
};

export const getMyFeedback = async () => {
  try {
    console.log('Fetching current user feedback');
    const response = await api.get('/feedback/my');
    console.log('My feedback raw response:', response);
    
    const result = response.data;
    if (result && result.data && Array.isArray(result.data)) {
      console.log(`getMyFeedback: Got ${result.data.length} items in standard format`);
      return result;
    } else if (Array.isArray(result)) {
      console.log(`getMyFeedback: Got ${result.length} items in direct array format`);
      return { success: true, data: result };
    } else {
      console.warn('Unexpected response format in getMyFeedback:', result);
      return { success: false, data: [] };
    }
  } catch (error) {
    console.error('Error in getMyFeedback:', error);
    throw error;
  }
};
