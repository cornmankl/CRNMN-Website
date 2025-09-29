import mongoose from 'mongoose';

const webhookSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'URL must be a valid HTTP/HTTPS URL'
        }
    },
    events: [{
        type: String,
        required: true,
        enum: [
            'product.created',
            'product.updated',
            'product.deleted',
            'order.created',
            'order.updated',
            'order.cancelled',
            'payment.completed',
            'payment.failed',
            'delivery.started',
            'delivery.completed',
            'review.created',
            'review.updated'
        ]
    }],
    secret: {
        type: String,
        required: true,
        default: function () {
            return require('crypto').randomBytes(32).toString('hex');
        }
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    retryAttempts: {
        type: Number,
        default: 3,
        min: 1,
        max: 10
    },
    timeout: {
        type: Number,
        default: 5000, // 5 seconds
        min: 1000,
        max: 30000
    },
    headers: {
        type: Map,
        of: String
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Indexes
webhookSchema.index({ partner: 1, isActive: 1 });
webhookSchema.index({ events: 1, isActive: 1 });
webhookSchema.index({ createdAt: -1 });

// Methods
webhookSchema.methods.generateSignature = function (payload) {
    const crypto = require('crypto');
    return crypto
        .createHmac('sha256', this.secret)
        .update(JSON.stringify(payload))
        .digest('hex');
};

webhookSchema.methods.verifySignature = function (payload, signature) {
    const expectedSignature = this.generateSignature(payload);
    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
};

webhookSchema.methods.shouldDeliver = function (event) {
    return this.isActive && this.events.includes(event);
};

// Static methods
webhookSchema.statics.findByEvent = function (event) {
    return this.find({
        events: event,
        isActive: true
    });
};

webhookSchema.statics.findByPartner = function (partnerId) {
    return this.find({
        partner: partnerId,
        isActive: true
    });
};

// Transform JSON output
webhookSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.secret;
        delete ret.__v;
        return ret;
    }
});

export const Webhook = mongoose.model('Webhook', webhookSchema);
