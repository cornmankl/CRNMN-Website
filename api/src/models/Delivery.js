import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  driver: {
    name: String,
    phone: String,
    vehicle: String,
    licensePlate: String
  },
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String,
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
deliverySchema.index({ order: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ trackingNumber: 1 });
deliverySchema.index({ partner: 1, createdAt: -1 });

export const Delivery = mongoose.model('Delivery', deliverySchema);
