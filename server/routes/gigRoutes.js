import express from 'express';
import { createGig, getGigs, getGigById, getMyGigs } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getGigs)
    .post(protect, createGig);

// Must be before /:id to avoid conflict
router.get('/my-gigs', protect, getMyGigs);

router.route('/:id')
    .get(getGigById);

export default router;
