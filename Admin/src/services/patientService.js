import api from './api';

export const getPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post('/patients', patientData);
  return response.data;
};

export const generateReport = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/report`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'patient-report.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const scheduleFollowUp = async (patientId, reminderData) => {
  const response = await api.post(`/patients/${patientId}/follow-up`, reminderData);
  return response.data;
};