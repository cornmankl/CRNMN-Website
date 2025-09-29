import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'MYR',
    uppercase: true
  },
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'ewallet', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  gateway: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay', 'fpx', 'grabpay'],
    required: true
  },
  gatewayResponse: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  refunds: [{
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
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
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ partner: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);
