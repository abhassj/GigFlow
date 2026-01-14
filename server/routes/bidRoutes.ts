
import express from 'express';
import { createBid, getBidsForGig, hireFreelancer } from '../controllers/bidController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', createBid);
router.get('/:gigId', getBidsForGig);
router.patch('/:bidId/hire', hireFreelancer);

export default router;
