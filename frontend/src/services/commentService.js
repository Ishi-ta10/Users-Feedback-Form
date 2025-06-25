import api from './api';

// Comment services
export const getCommentsByFeedbackId = async (feedbackId) => {
  const response = await api.get(`/feedback/${feedbackId}/comments`);
  return response.data;
};

export const addComment = async (feedbackId, commentData) => {
  const response = await api.post(`/feedback/${feedbackId}/comments`, commentData);
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await api.put(`/comments/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};
