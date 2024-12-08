import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  createClinic,
  getClinics,
  updateClinic,
  deleteClinic,
  exportClinicsCSV
} from '../controllers/clinicController.js';

const router = express.Router();

router.use(protect);
router.get('/', getClinics);
router.get('/export', admin, exportClinicsCSV);
router.post('/', admin, createClinic);
router.put('/:id', admin, updateClinic);
router.delete('/:id', admin, deleteClinic);

export default router;