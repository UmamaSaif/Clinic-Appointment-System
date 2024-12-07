import api from '../config/axios';
import { Appointment, AppointmentFormData } from '../types/appointment';

export const fetchAppointments = async () => {
  try {
    const response = await api.get<Appointment[]>('/api/appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData: AppointmentFormData) => {
  try {
    const response = await api.post<Appointment>('/api/appointments', appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};