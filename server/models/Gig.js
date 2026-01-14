import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [2000, 'Description cannot be more than 2000 characters']
        },
        budget: {
            type: Number,
            required: [true, 'Please add a budget']
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['open', 'assigned'],
            default: 'open'
        }
    },
    {
        timestamps: true
    }
);

// Index for search optimization
gigSchema.index({ title: 'text' });

export default mongoose.model('Gig', gigSchema);
