import api from '../config/axios';
import { Doctor } from '../types/appointment';

export const searchDoctors = async (searchParams: Record<string, string>) => {
  try {
    const response = await api.get<Doctor[]>('/api/doctors/search', {
      params: searchParams
    });
    return response.data;
  } catch (error) {
    console.error('Doctor search error:', error);
    throw error;
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await api.get<Doctor[]>('/api/doctors');
    return response.data;
  } catch (error) {
    console.error('Get all doctors error:', error);
    throw error;
  }
};