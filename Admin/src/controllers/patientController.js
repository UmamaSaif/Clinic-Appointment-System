import Patient from '../models/Patient.js';
import { jsPDF } from 'jspdf';
import { Parser } from 'papaparse';
import { scheduleReminder } from '../utils/emailService.js';

export const generatePatientReport = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('appointments');
    
    const doc = new jsPDF();
    doc.text(`Patient Report - ${patient.name}`, 10, 10);
    doc.text(`Email: ${patient.email}`, 10, 20);
    doc.text(`Contact: ${patient.contactNumber}`, 10, 30);
    
    // Add medical history
    let yPos = 50;
    patient.medicalHistory.forEach(record => {
      doc.text(`Condition: ${record.condition}`, 10, yPos);
      doc.text(`Diagnosis: ${record.diagnosis}`, 10, yPos + 10);
      yPos += 30;
    });

    const pdfBuffer = doc.output();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=patient-report.pdf');
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportPatientsCSV = async (req, res) => {
  try {
    const patients = await Patient.find();
    const csv = Parser.unparse(patients);
    res.header('Content-Type', 'text/csv');
    res.attachment('patients.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scheduleFollowUp = async (req, res) => {
  try {
    const { patientId, date, subject, message } = req.body;
    const patient = await Patient.findById(patientId);
    
    await scheduleReminder(new Date(date), {
      to: patient.email,
      subject,
      text: message
    });

    res.json({ message: 'Follow-up reminder scheduled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};