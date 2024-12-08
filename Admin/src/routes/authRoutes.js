import express from 'express';
import { login, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/google', googleLogin);

export default router;