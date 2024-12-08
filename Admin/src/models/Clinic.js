import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  doctors: [{
    name: String,
    specialization: String,
    schedule: [{
      day: String,
      startTime: String,
      endTime: String
    }]
  }],
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Clinic = mongoose.model('Clinic', clinicSchema);
export default Clinic;