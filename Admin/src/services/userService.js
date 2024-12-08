import api from './api';

export const getUsers = async (search = '', role = '') => {
  const response = await api.get(`/users?search=${search}&role=${role}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const exportUsersCSV = async () => {
  const response = await api.get('/users/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'users.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};