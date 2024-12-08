import api from './api';

export const getVideos = async (category = '') => {
  const response = await api.get(`/videos?category=${category}`);
  return response.data;
};

export const addVideo = async (videoData) => {
  const response = await api.post('/videos', videoData);
  return response.data;
};

export const updateVideo = async (id, videoData) => {
  const response = await api.put(`/videos/${id}`, videoData);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await api.delete(`/videos/${id}`);
  return response.data;
};