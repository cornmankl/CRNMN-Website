import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true
    },
    comment: {
        type: String,
        trim: true
    },
    images: [{
        url: String,
        alt: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    helpful: {
        type: Number,
        default: 0,
        min: 0
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    }
}, {
    timestamps: true
});

// Indexes
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ customer: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ partner: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
