import api from './api';

export const getClinics = async (search = '') => {
  const response = await api.get(`/clinics?search=${search}`);
  return response.data;
};

export const createClinic = async (clinicData) => {
  const response = await api.post('/clinics', clinicData);
  return response.data;
};

export const updateClinic = async (id, clinicData) => {
  const response = await api.put(`/clinics/${id}`, clinicData);
  return response.data;
};

export const deleteClinic = async (id) => {
  const response = await api.delete(`/clinics/${id}`);
  return response.data;
};

export const exportClinicsCSV = async () => {
  const response = await api.get('/clinics/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'clinics.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};