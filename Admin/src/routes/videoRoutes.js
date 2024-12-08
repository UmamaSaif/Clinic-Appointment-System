import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  addVideo,
  getVideos,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';

const router = express.Router();

router.use(protect);
router.get('/', getVideos);
router.post('/', admin, addVideo);
router.put('/:id', admin, updateVideo);
router.delete('/:id', admin, deleteVideo);

export default router;