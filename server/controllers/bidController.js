import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { getIO } from '../socket/socket.js';

// @desc    Place a bid on a gig
// @route   POST /api/bids
// @access  Private
const placeBid = asyncHandler(async (req, res) => {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    // Check if user is the owner
    if (gig.ownerId.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot bid on your own gig');
    }

    // Check if gig is open
    if (gig.status !== 'open') {
        res.status(400);
        throw new Error('This gig is no longer open for bidding');
    }

    // Check if already bid (redundant with unique index, but good for custom error message)
    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });

    if (existingBid) {
        res.status(400);
        throw new Error('You have already placed a bid on this gig');
    }

    const bid = await Bid.create({
        gigId,
        freelancerId: req.user._id,
        message,
        price,
    });

    res.status(201).json(bid);
});

// @desc    Get bids for a gig (Owner only)
// @route   GET /api/bids/:gigId
// @access  Private
const getBids = asyncHandler(async (req, res) => {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    // Strict check: Only owner can view bids
    if (gig.ownerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view bids for this gig');
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
        .populate('freelancerId', 'name email')
        .sort({ createdAt: -1 });

    res.json(bids);
});

// @desc    Hire a freelancer (Atomic Transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
const hireFreelancer = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(req.params.bidId).session(session);

        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            res.status(404);
            throw new Error('Bid not found');
        }

        const gig = await Gig.findById(bid.gigId).session(session);

        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            res.status(404);
            throw new Error('Gig not found');
        }

        // 1. Authorization Check
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            res.status(403);
            throw new Error('Not authorized to hire for this gig');
        }

        // 2. Race Condition Check (Is gig still open?)
        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            res.status(400);
            throw new Error('This gig has already been assigned');
        }

        // 3. Perform Updates using the session

        // Update Gig status
        gig.status = 'assigned';
        await gig.save({ session });

        // Update Selected Bid status
        bid.status = 'hired';
        await bid.save({ session });

        // Reject all other bids for this gig
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { $set: { status: 'rejected' } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // 4. Real-time Notification
        try {
            const io = getIO();
            io.to(bid.freelancerId.toString()).emit('notification', {
                type: 'hired',
                message: `You have been hired for ${gig.title}!`,
                gigId: gig._id,
            });
        } catch (error) {
            console.error('Socket notification failed:', error);
            // Do not fail the request if notification fails
        }

        res.json({
            message: 'Freelancer hired successfully',
            gig,
            bid
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// @desc    Get logged in user's bids
// @route   GET /api/bids/my-bids
// @access  Private
const getMyBids = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ freelancerId: req.user._id })
        .populate('gigId', 'title status ownerId')
        .sort({ createdAt: -1 });
    res.json(bids);
});

export { placeBid, getBids, hireFreelancer, getMyBids };
