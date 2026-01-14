import asyncHandler from '../middleware/asyncHandler.js';
import Gig from '../models/Gig.js';

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
const createGig = asyncHandler(async (req, res) => {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const gig = await Gig.create({
        title,
        description,
        budget,
        ownerId: req.user._id,
    });

    res.status(201).json(gig);
});

// @desc    Get all open gigs
// @route   GET /api/gigs?search=keyword
// @access  Public
const getGigs = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            title: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {};

    const gigs = await Gig.find({ ...keyword, status: 'open' })
        .populate('ownerId', 'name email')
        .sort({ createdAt: -1 });

    res.json(gigs);
});

// @desc    Get gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = asyncHandler(async (req, res) => {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

    if (gig) {
        res.json(gig);
    } else {
        res.status(404);
        throw new Error('Gig not found');
    }
});

// @desc    Get logged in user's gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
const getMyGigs = asyncHandler(async (req, res) => {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(gigs);
});

export { createGig, getGigs, getGigById, getMyGigs };
