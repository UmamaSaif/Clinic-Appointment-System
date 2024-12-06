import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialty')
      .populate('doctor');
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Search doctors with advanced filtering
router.get('/search', auth, async (req, res) => {
  try {
    const { name, specialty, availableDate, availableTime } = req.query;
    
    let query = { role: 'doctor' };
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    const doctors = await User.find(query)
      .select('name specialty')
      .populate({
        path: 'doctor',
        select: 'consultationFee availability qualifications experience rating'
      });

    // Filter by availability if date/time is provided
    let filteredDoctors = doctors;
    if (availableDate) {
      filteredDoctors = doctors.filter(doctor => {
        const availability = doctor.doctor?.availability || [];
        return availability.some(slot => {
          const slotDate = new Date(slot.date).toISOString().split('T')[0];
          const queryDate = new Date(availableDate).toISOString().split('T')[0];
          
          if (availableTime) {
            return slotDate === queryDate && 
                   slot.slots.some(timeSlot => 
                     timeSlot.time === availableTime && !timeSlot.isBooked
                   );
          }
          return slotDate === queryDate;
        });
      });
    }

    res.json(filteredDoctors.map(doctor => ({
      _id: doctor._id,
      name: doctor.name,
      specialty: doctor.specialty,
      consultationFee: doctor.doctor?.consultationFee || 0,
      qualifications: doctor.doctor?.qualifications || [],
      experience: doctor.doctor?.experience || 0,
      rating: doctor.doctor?.rating || 0,
      availability: doctor.doctor?.availability || []
    })));
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({ message: 'Error searching doctors' });
  }
});

// Get doctor's availability
router.get('/:id/availability', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findOne({ user: req.params.id })
      .select('availability');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    let availability = doctor.availability;
    if (date) {
      availability = availability.filter(slot => {
        const slotDate = new Date(slot.date).toISOString().split('T')[0];
        const queryDate = new Date(date).toISOString().split('T')[0];
        return slotDate === queryDate;
      });
    }

    res.json(availability);
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({ message: 'Error fetching doctor availability' });
  }
});

export default router;