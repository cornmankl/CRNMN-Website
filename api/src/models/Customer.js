import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  preferences: {
    dietary: [String],
    allergies: [String],
    favoriteItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
customerSchema.index({ email: 1 });
customerSchema.index({ partner: 1, createdAt: -1 });
customerSchema.index({ isActive: 1 });

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export const Customer = mongoose.model('Customer', customerSchema);
