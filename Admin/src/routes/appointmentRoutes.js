import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createAppointment,
  getAppointments,
  updateAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

router.use(protect);
router.post('/', createAppointment);
router.get('/', getAppointments);
router.put('/:id', updateAppointment);

export default router;