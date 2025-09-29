import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    category: {
        type: String,
        required: true,
        enum: ['appetizer', 'main', 'dessert', 'beverage', 'combo'],
        index: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    availability: {
        inStock: {
            type: Boolean,
            default: true,
            index: true
        },
        quantity: {
            type: Number,
            default: 0,
            min: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    nutrition: {
        calories: {
            type: Number,
            min: 0
        },
        protein: {
            type: Number,
            min: 0
        },
        carbs: {
            type: Number,
            min: 0
        },
        fat: {
            type: Number,
            min: 0
        },
        fiber: {
            type: Number,
            min: 0
        },
        sugar: {
            type: Number,
            min: 0
        },
        sodium: {
            type: Number,
            min: 0
        }
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            trim: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    allergens: [{
        type: String,
        enum: [
            'gluten',
            'dairy',
            'eggs',
            'nuts',
            'peanuts',
            'soy',
            'fish',
            'shellfish',
            'sesame'
        ]
    }],
    dietary: [{
        type: String,
        enum: [
            'vegetarian',
            'vegan',
            'gluten-free',
            'dairy-free',
            'keto',
            'paleo',
            'halal',
            'kosher'
        ]
    }],
    preparationTime: {
        type: Number, // in minutes
        min: 0
    },
    servingSize: {
        type: String,
        trim: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: String,
            trim: true
        },
        isOptional: {
            type: Boolean,
            default: false
        }
    }],
    variants: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        priceModifier: {
            type: Number,
            default: 0
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    pricing: {
        basePrice: {
            type: Number,
            required: true,
            min: 0
        },
        discountPrice: {
            type: Number,
            min: 0
        },
        discountPercentage: {
            type: Number,
            min: 0,
            max: 100
        },
        discountValidUntil: {
            type: Date
        }
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isFeatured: {
        type: Boolean,
        default: false,
        index: true
    },
    sortOrder: {
        type: Number,
        default: 0,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ 'availability.inStock': 1, isActive: 1 });
productSchema.index({ 'ratings.average': -1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ sortOrder: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for current price
productSchema.virtual('currentPrice').get(function () {
    if (this.pricing.discountPrice &&
        (!this.pricing.discountValidUntil || this.pricing.discountValidUntil > new Date())) {
        return this.pricing.discountPrice;
    }
    return this.pricing.basePrice;
});

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function () {
    if (this.pricing.discountPrice &&
        (!this.pricing.discountValidUntil || this.pricing.discountValidUntil > new Date())) {
        return this.pricing.basePrice - this.pricing.discountPrice;
    }
    return 0;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function () {
    const primary = this.images.find(img => img.isPrimary);
    return primary || this.images[0] || null;
});

// Methods
productSchema.methods.updateStock = function (quantity) {
    this.availability.quantity = Math.max(0, quantity);
    this.availability.inStock = quantity > 0;
    this.availability.lastUpdated = new Date();
    return this.save();
};

productSchema.methods.addStock = function (quantity) {
    this.availability.quantity += quantity;
    this.availability.inStock = this.availability.quantity > 0;
    this.availability.lastUpdated = new Date();
    return this.save();
};

productSchema.methods.removeStock = function (quantity) {
    this.availability.quantity = Math.max(0, this.availability.quantity - quantity);
    this.availability.inStock = this.availability.quantity > 0;
    this.availability.lastUpdated = new Date();
    return this.save();
};

productSchema.methods.updateRating = function (newRating) {
    const totalRating = this.ratings.average * this.ratings.count;
    this.ratings.count += 1;
    this.ratings.average = (totalRating + newRating) / this.ratings.count;
    return this.save();
};

productSchema.methods.isOnSale = function () {
    return this.pricing.discountPrice &&
        (!this.pricing.discountValidUntil || this.pricing.discountValidUntil > new Date());
};

productSchema.methods.getNutritionPerServing = function () {
    const serving = this.servingSize || '1 serving';
    return {
        serving,
        calories: this.nutrition.calories,
        protein: this.nutrition.protein,
        carbs: this.nutrition.carbs,
        fat: this.nutrition.fat,
        fiber: this.nutrition.fiber,
        sugar: this.nutrition.sugar,
        sodium: this.nutrition.sodium
    };
};

// Static methods
productSchema.statics.findByCategory = function (category, options = {}) {
    const query = { category, isActive: true };
    return this.find(query, null, options);
};

productSchema.statics.findInStock = function (options = {}) {
    const query = {
        'availability.inStock': true,
        isActive: true
    };
    return this.find(query, null, options);
};

productSchema.statics.findOnSale = function (options = {}) {
    const now = new Date();
    const query = {
        $or: [
            { 'pricing.discountPrice': { $exists: true, $ne: null } },
            { 'pricing.discountValidUntil': { $gt: now } }
        ],
        isActive: true
    };
    return this.find(query, null, options);
};

productSchema.statics.findFeatured = function (options = {}) {
    const query = { isFeatured: true, isActive: true };
    return this.find(query, null, options);
};

productSchema.statics.search = function (searchTerm, options = {}) {
    const query = {
        $text: { $search: searchTerm },
        isActive: true
    };
    return this.find(query, { score: { $meta: 'textScore' } }, options)
        .sort({ score: { $meta: 'textScore' } });
};

// Pre-save middleware
productSchema.pre('save', function (next) {
    // Ensure only one primary image
    if (this.images && this.images.length > 0) {
        const primaryImages = this.images.filter(img => img.isPrimary);
        if (primaryImages.length > 1) {
            // Keep only the first primary image
            this.images.forEach((img, index) => {
                if (index > 0) img.isPrimary = false;
            });
        }
    }

    // Calculate discount percentage
    if (this.pricing.discountPrice && this.pricing.basePrice > 0) {
        this.pricing.discountPercentage = Math.round(
            ((this.pricing.basePrice - this.pricing.discountPrice) / this.pricing.basePrice) * 100
        );
    }

    next();
});

// Transform JSON output
productSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

export const Product = mongoose.model('Product', productSchema);
