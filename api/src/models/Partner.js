import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Website must be a valid URL'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended', 'inactive'],
        default: 'pending'
    },
    tier: {
        type: String,
        enum: ['basic', 'premium', 'enterprise'],
        default: 'basic'
    },
    permissions: [{
        type: String,
        enum: [
            'products:read',
            'products:write',
            'orders:read',
            'orders:write',
            'customers:read',
            'customers:write',
            'payments:read',
            'payments:write',
            'delivery:read',
            'delivery:write',
            'reviews:read',
            'reviews:write',
            'promotions:read',
            'promotions:write',
            'analytics:read',
            'webhooks:write'
        ]
    }],
    rateLimit: {
        type: Number,
        default: 1000, // requests per hour
        min: 1,
        max: 10000
    },
    webhookUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Webhook URL must be a valid URL'
        }
    },
    webhookSecret: {
        type: String,
        trim: true
    },
    sandboxMode: {
        type: Boolean,
        default: true
    },
    contactInfo: {
        phone: {
            type: String,
            trim: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },
    integrationSettings: {
        grabFood: {
            enabled: { type: Boolean, default: false },
            apiKey: String,
            webhookUrl: String
        },
        foodPanda: {
            enabled: { type: Boolean, default: false },
            apiKey: String,
            webhookUrl: String
        },
        quickbooks: {
            enabled: { type: Boolean, default: false },
            clientId: String,
            clientSecret: String,
            accessToken: String,
            refreshToken: String
        },
        hubspot: {
            enabled: { type: Boolean, default: false },
            apiKey: String,
            portalId: String
        },
        mailchimp: {
            enabled: { type: Boolean, default: false },
            apiKey: String,
            listId: String
        }
    },
    billingInfo: {
        plan: {
            type: String,
            enum: ['free', 'basic', 'premium', 'enterprise'],
            default: 'free'
        },
        monthlyLimit: {
            type: Number,
            default: 1000
        },
        overageRate: {
            type: Number,
            default: 0.01 // $0.01 per request over limit
        },
        nextBillingDate: Date,
        lastPaymentDate: Date,
        totalSpent: {
            type: Number,
            default: 0
        }
    },
    analytics: {
        totalRequests: {
            type: Number,
            default: 0
        },
        successfulRequests: {
            type: Number,
            default: 0
        },
        failedRequests: {
            type: Number,
            default: 0
        },
        lastRequestAt: Date,
        averageResponseTime: {
            type: Number,
            default: 0
        }
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Indexes
partnerSchema.index({ email: 1 });
partnerSchema.index({ status: 1 });
partnerSchema.index({ tier: 1 });
partnerSchema.index({ 'billingInfo.plan': 1 });

// Virtual for full address
partnerSchema.virtual('fullAddress').get(function () {
    const addr = this.contactInfo?.address;
    if (!addr) return '';

    const parts = [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
        .filter(Boolean);
    return parts.join(', ');
});

// Methods
partnerSchema.methods.updateAnalytics = function (success, responseTime) {
    this.analytics.totalRequests += 1;
    if (success) {
        this.analytics.successfulRequests += 1;
    } else {
        this.analytics.failedRequests += 1;
    }

    // Update average response time
    const total = this.analytics.totalRequests;
    const current = this.analytics.averageResponseTime;
    this.analytics.averageResponseTime = ((current * (total - 1)) + responseTime) / total;

    this.analytics.lastRequestAt = new Date();
    return this.save();
};

partnerSchema.methods.canMakeRequest = function () {
    if (this.status !== 'active') return false;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Check if we're in a new billing cycle
    if (!this.billingInfo.nextBillingDate || this.billingInfo.nextBillingDate <= now) {
        this.billingInfo.nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        this.analytics.totalRequests = 0;
        this.analytics.successfulRequests = 0;
        this.analytics.failedRequests = 0;
        return this.save().then(() => true);
    }

    return this.analytics.totalRequests < this.billingInfo.monthlyLimit;
};

partnerSchema.methods.getUsageStats = function () {
    const total = this.analytics.totalRequests;
    const success = this.analytics.successfulRequests;
    const failed = this.analytics.failedRequests;

    return {
        total,
        successful: success,
        failed,
        successRate: total > 0 ? (success / total) * 100 : 0,
        remaining: Math.max(0, this.billingInfo.monthlyLimit - total),
        averageResponseTime: this.analytics.averageResponseTime
    };
};

// Static methods
partnerSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() });
};

partnerSchema.statics.findActive = function () {
    return this.find({ status: 'active' });
};

partnerSchema.statics.findByTier = function (tier) {
    return this.find({ tier });
};

// Pre-save middleware
partnerSchema.pre('save', function (next) {
    if (this.isNew && !this.billingInfo.nextBillingDate) {
        const now = new Date();
        this.billingInfo.nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    next();
});

// Transform JSON output
partnerSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.integrationSettings;
        delete ret.__v;
        return ret;
    }
});

export const Partner = mongoose.model('Partner', partnerSchema);
