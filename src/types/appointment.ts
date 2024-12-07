export interface Doctor {
    _id: string;
    name: string;
    specialty: string;
  }
  
  export interface Appointment {
    _id: string;
    doctor: Doctor;
    date: string;
    status: string;
    queueNumber: string;
    consultationType: string;
  }
  
  export interface SearchCriteria {
    name: string;
    specialty: string;
    availableDate: string;
    availableTime: string;
  }
  
  export interface AppointmentFormData {
    doctorId: string;
    date: string;
    symptoms: string;
    consultationType: string;
    additionalDetails: string;
  }