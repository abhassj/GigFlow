
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Bid from '../models/Bid';
import Gig from '../models/Gig';
import { sendNotification } from '../socket/socket';

// @desc    Create a bid on a gig
export const createBid = async (req: any, res: Response) => {
  try {
    const { gigId, message, price } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.status !== 'open') return res.status(400).json({ success: false, message: 'Gig is closed' });
    if (gig.ownerId.toString() === req.user.id) return res.status(400).json({ success: false, message: 'Cannot bid on own gig' });

    const bid = await Bid.create({ gigId, message, price, freelancerId: req.user.id });
    res.status(201).json({ success: true, data: bid });
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Already bid on this gig' });
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get bids for a gig
export const getBidsForGig = async (req: any, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.ownerId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.status(200).json({ success: true, data: bids });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Hire a freelancer (ATOMIC TRANSACTION)
// @route   PATCH /api/bids/:bidId/hire
export const hireFreelancer = async (req: any, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId).populate('freelancerId', 'name');
    if (!bid) throw new Error('Bid not found');

    const gig = await Gig.findById(bid.gigId);
    if (!gig) throw new Error('Gig not found');

    // Security: Only owner can hire
    if (gig.ownerId.toString() !== req.user.id) {
      throw new Error('Not authorized to hire for this project');
    }

    // Race condition check: Is gig already assigned?
    if (gig.status === 'assigned') {
      throw new Error('Gig has already been assigned to another freelancer');
    }

    // 1. Mark Gig as Assigned
    gig.status = 'assigned';
    await gig.save({ session });

    // 2. Mark selected bid as Hired
    bid.status = 'hired';
    await bid.save({ session });

    // 3. Reject all other pending bids for this gig
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id }, status: 'pending' },
      { $set: { status: 'rejected' } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // 4. Real-time Notification via Socket.io
    sendNotification(
      bid.freelancerId._id.toString(), 
      `Congratulations! You've been hired for "${gig.title}"`,
      { gigId: gig._id, bidId: bid._id }
    );

    res.status(200).json({ success: true, message: 'Hiring complete and confirmed' });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
};
