import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
    {
        gigId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gig',
            required: true
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
            maxlength: [500, 'Message cannot be more than 500 characters']
        },
        price: {
            type: Number,
            required: [true, 'Please add a proposed price']
        },
        status: {
            type: String,
            enum: ['pending', 'hired', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

// Prevent multiple bids from same freelancer on same gig
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model('Bid', bidSchema);
