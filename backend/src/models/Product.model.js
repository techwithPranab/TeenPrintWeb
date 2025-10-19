import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sizes: [
      {
        name: {
          type: String,
          required: true, // e.g., 'S', 'M', 'L', 'XL'
        },
        priceModifier: {
          type: Number,
          default: 0, // Additional price for this size
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    colors: [
      {
        name: {
          type: String,
          required: true, // e.g., 'White', 'Black'
        },
        hexCode: {
          type: String,
          required: true, // e.g., '#FFFFFF'
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    mockups: {
      front: {
        url: String,
        publicId: String,
      },
      back: {
        url: String,
        publicId: String,
      },
      side: {
        url: String,
        publicId: String,
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        alt: String,
      },
    ],
    designArea: {
      // Area where design can be placed
      front: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        width: { type: Number, default: 300 },
        height: { type: Number, default: 300 },
      },
      back: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        width: { type: Number, default: 300 },
        height: { type: Number, default: 300 },
      },
    },
    specifications: {
      type: Map,
      of: String, // e.g., { material: 'Cotton', weight: '180 GSM' }
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ isActive: 1, isFeatured: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
