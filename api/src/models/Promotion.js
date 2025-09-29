import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'free_shipping', 'buy_one_get_one'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  usageLimit: {
    type: Number,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
promotionSchema.index({ code: 1 });
promotionSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
promotionSchema.index({ partner: 1, createdAt: -1 });

export const Promotion = mongoose.model('Promotion', promotionSchema);
