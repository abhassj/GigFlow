
import express from 'express';
import { getGigs, createGig, getGig } from '../controllers/gigController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getGigs)
  .post(protect, createGig);

router.route('/:id')
  .get(getGig);

export default router;
