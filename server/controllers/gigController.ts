
import { Request, Response } from 'express';
import Gig from '../models/Gig';

// @desc    Get all open gigs (with search)
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = { status: 'open' };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const gigs = await Gig.find(query).populate('ownerId', 'name').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req: any, res: Response) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: gig,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single gig details
// @route   GET /api/gigs/:id
// @access  Public
export const getGig = async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name');

    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: 'Invalid Gig ID' });
  }
};
