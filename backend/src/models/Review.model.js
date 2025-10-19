import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true, // Only users who purchased can review
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
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
    isVerified: {
      type: Boolean,
      default: true, // Verified purchase
    },
    helpful: {
      count: {
        type: Number,
        default: 0,
      },
      users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Auto-approve for now
    },
    adminResponse: {
      comment: String,
      respondedAt: Date,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per user per product per order
reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });

// Prevent duplicate reviews
reviewSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existingReview = await mongoose.model('Review').findOne({
      product: this.product,
      user: this.user,
      order: this.order,
    });

    if (existingReview) {
      const error = new Error('You have already reviewed this product for this order');
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
