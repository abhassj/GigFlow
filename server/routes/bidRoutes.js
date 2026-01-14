import express from 'express';
import { placeBid, getBids, hireFreelancer, getMyBids } from '../controllers/bidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeBid);
router.get('/my-bids', protect, getMyBids); // Must be before /:gigId
router.get('/:gigId', protect, getBids);
router.patch('/:bidId/hire', protect, hireFreelancer);

export default router;
