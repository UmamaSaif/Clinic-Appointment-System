import Clinic from '../models/Clinic.js';
import { Parser } from 'papaparse';

export const createClinic = async (req, res) => {
  try {
    const clinic = await Clinic.create(req.body);
    res.status(201).json(clinic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClinics = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const clinics = await Clinic.find(query);
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClinic = async (req, res) => {
  try {
    await Clinic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportClinicsCSV = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    const csv = Parser.unparse(clinics);
    res.header('Content-Type', 'text/csv');
    res.attachment('clinics.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};