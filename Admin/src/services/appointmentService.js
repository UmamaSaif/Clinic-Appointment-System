import api from './api';

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

export const getAppointments = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await api.get(`/appointments?${queryString}`);
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/appointments/${id}`, appointmentData);
  return response.data;
};