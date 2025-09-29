import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    secret: {
        type: String,
        required: true
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
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
    ipWhitelist: [{
        type: String,
        validate: {
            validator: function (v) {
                // Basic IP/CIDR validation
                return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(v);
            },
            message: 'Invalid IP address or CIDR notation'
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        default: null
    },
    lastUsedAt: {
        type: Date,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Indexes
apiKeySchema.index({ partner: 1, isActive: 1 });
apiKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
apiKeySchema.index({ lastUsedAt: 1 });

// Virtual for masked key (for logging)
apiKeySchema.virtual('maskedKey').get(function () {
    return this.key ? this.key.substring(0, 8) + '...' : '';
});

// Methods
apiKeySchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    this.lastUsedAt = new Date();
    return this.save();
};

apiKeySchema.methods.isExpired = function () {
    return this.expiresAt && this.expiresAt < new Date();
};

apiKeySchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission);
};

// Static methods
apiKeySchema.statics.generateKey = function () {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
};

apiKeySchema.statics.generateSecret = function () {
    const crypto = require('crypto');
    return crypto.randomBytes(64).toString('hex');
};

// Pre-save middleware
apiKeySchema.pre('save', function (next) {
    if (this.isNew && !this.key) {
        this.key = this.constructor.generateKey();
    }
    if (this.isNew && !this.secret) {
        this.secret = this.constructor.generateSecret();
    }
    next();
});

// Transform JSON output
apiKeySchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.secret;
        delete ret.__v;
        return ret;
    }
});

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);
