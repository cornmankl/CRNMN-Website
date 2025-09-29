import mongoose from 'mongoose';

const webhookDeliverySchema = new mongoose.Schema({
    webhookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Webhook',
        required: true,
        index: true
    },
    event: {
        type: String,
        required: true,
        index: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'failed', 'retrying'],
        default: 'pending',
        index: true
    },
    attempts: {
        type: Number,
        default: 0,
        min: 0
    },
    maxAttempts: {
        type: Number,
        default: 3,
        min: 1
    },
    lastAttemptAt: {
        type: Date,
        index: true
    },
    nextRetryAt: {
        type: Date,
        index: true
    },
    responseStatus: {
        type: Number
    },
    responseHeaders: {
        type: Map,
        of: String
    },
    responseBody: {
        type: String
    },
    errorMessage: {
        type: String
    },
    deliveryTime: {
        type: Number // in milliseconds
    },
    isTest: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
webhookDeliverySchema.index({ webhookId: 1, status: 1 });
webhookDeliverySchema.index({ event: 1, status: 1 });
webhookDeliverySchema.index({ nextRetryAt: 1, status: 1 });
webhookDeliverySchema.index({ createdAt: -1 });

// Virtual for retry delay
webhookDeliverySchema.virtual('retryDelay').get(function () {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s, 60s (max)
    const baseDelay = 1000; // 1 second
    const maxDelay = 60000; // 60 seconds
    const delay = Math.min(baseDelay * Math.pow(2, this.attempts), maxDelay);
    return delay;
});

// Methods
webhookDeliverySchema.methods.markAsDelivered = function (responseStatus, responseHeaders, responseBody, deliveryTime) {
    this.status = 'delivered';
    this.responseStatus = responseStatus;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.deliveryTime = deliveryTime;
    this.lastAttemptAt = new Date();
    return this.save();
};

webhookDeliverySchema.methods.markAsFailed = function (errorMessage) {
    this.status = 'failed';
    this.errorMessage = errorMessage;
    this.lastAttemptAt = new Date();
    return this.save();
};

webhookDeliverySchema.methods.scheduleRetry = function () {
    if (this.attempts >= this.maxAttempts) {
        this.status = 'failed';
        this.errorMessage = 'Max retry attempts exceeded';
    } else {
        this.status = 'retrying';
        this.attempts += 1;
        this.nextRetryAt = new Date(Date.now() + this.retryDelay);
    }
    this.lastAttemptAt = new Date();
    return this.save();
};

webhookDeliverySchema.methods.canRetry = function () {
    return this.status === 'retrying' &&
        this.attempts < this.maxAttempts &&
        this.nextRetryAt <= new Date();
};

webhookDeliverySchema.methods.isExpired = function () {
    // Consider failed after 24 hours
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return this.createdAt < new Date(Date.now() - maxAge);
};

// Static methods
webhookDeliverySchema.statics.findPending = function () {
    return this.find({
        status: 'pending',
        nextRetryAt: { $lte: new Date() }
    });
};

webhookDeliverySchema.statics.findRetrying = function () {
    return this.find({
        status: 'retrying',
        nextRetryAt: { $lte: new Date() }
    });
};

webhookDeliverySchema.statics.findByWebhook = function (webhookId, options = {}) {
    const query = { webhookId };
    if (options.status) query.status = options.status;
    if (options.event) query.event = options.event;

    return this.find(query)
        .sort({ createdAt: -1 })
        .limit(options.limit || 100);
};

webhookDeliverySchema.statics.getStats = function (webhookId, startDate, endDate) {
    const match = { webhookId };
    if (startDate) match.createdAt = { $gte: startDate };
    if (endDate) match.createdAt = { ...match.createdAt, $lte: endDate };

    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgDeliveryTime: { $avg: '$deliveryTime' }
            }
        }
    ]);
};

// Pre-save middleware
webhookDeliverySchema.pre('save', function (next) {
    if (this.isNew && this.status === 'pending') {
        this.nextRetryAt = new Date();
    }
    next();
});

// Transform JSON output
webhookDeliverySchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

export const WebhookDelivery = mongoose.model('WebhookDelivery', webhookDeliverySchema);
