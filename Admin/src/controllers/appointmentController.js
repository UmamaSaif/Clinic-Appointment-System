import Appointment from '../models/Appointment.js';
import { sendEmail } from '../utils/emailService.js';

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    
    // Send confirmation email
    const patient = await appointment.populate('patient');
    await sendEmail(
      patient.email,
      'Appointment Confirmation',
      `Your appointment has been scheduled for ${appointment.date}`
    );
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { date, doctorId, clinicId } = req.query;
    let query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    if (doctorId) query.doctor = doctorId;
    if (clinicId) query.clinic = clinicId;
    
    const appointments = await Appointment.find(query)
      .populate('patient')
      .populate('doctor')
      .populate('clinic');
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (req.body.status === 'cancelled') {
      const patient = await appointment.populate('patient');
      await sendEmail(
        patient.email,
        'Appointment Cancelled',
        `Your appointment scheduled for ${appointment.date} has been cancelled`
      );
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};