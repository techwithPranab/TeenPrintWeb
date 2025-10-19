import Review from '../models/Review.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';

/**
 * Get all reviews for a product
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const rating = req.query.rating; // Filter by rating

    const query = { product: productId, status: 'approved' };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName profilePicture')
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-helpful.users'); // Don't expose who marked as helpful

    const total = await Review.countDocuments(query);

    // Calculate rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingDistribution = {};
    ratingStats.forEach((stat) => {
      ratingDistribution[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

/**
 * Create a new review
 */
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { orderId, rating, title, comment, images } = req.body;
    const userId = req.user.id;

    // Verify the order exists and belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: { $in: ['delivered', 'completed'] }, // Only allow reviews for completed orders
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order or order not eligible for review',
      });
    }

    // Check if user already reviewed this product from this order
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
      order: orderId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product for this order',
      });
    }

    // Create the review
    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId,
      rating,
      title,
      comment,
      images: images || [],
    });

    // Update product rating
    await updateProductRating(productId);

    // Populate user data for response
    await review.populate('user', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review },
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message,
    });
  }
};

/**
 * Update a review
 */
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: userId },
      { rating, title, comment, images },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName profilePicture');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you do not have permission to update it',
      });
    }

    // Update product rating
    await updateProductRating(review.product);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review },
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message,
    });
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you do not have permission to delete it',
      });
    }

    // Update product rating
    await updateProductRating(review.product);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};

/**
 * Mark review as helpful
 */
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user already marked this review as helpful
    const hasMarked = review.helpful.users.includes(userId);

    if (hasMarked) {
      // Remove from helpful
      review.helpful.users = review.helpful.users.filter(
        (id) => id.toString() !== userId
      );
      review.helpful.count = Math.max(0, review.helpful.count - 1);
    } else {
      // Add to helpful
      review.helpful.users.push(userId);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: hasMarked ? 'Removed from helpful' : 'Marked as helpful',
      data: {
        helpfulCount: review.helpful.count,
        isHelpful: !hasMarked,
      },
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review helpful status',
      error: error.message,
    });
  }
};

/**
 * Get user's reviews
 */
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name slug images')
      .populate('order', 'orderId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message,
    });
  }
};

/**
 * Admin: Get all reviews with filtering
 */
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const product = req.query.product;
    const rating = req.query.rating;

    const query = {};
    if (status) query.status = status;
    if (product) query.product = product;
    if (rating) query.rating = parseInt(rating);

    const reviews = await Review.find(query)
      .populate('product', 'name slug')
      .populate('user', 'firstName lastName email')
      .populate('order', 'orderId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

/**
 * Admin: Update review status
 */
export const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, adminResponse } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected',
      });
    }

    const updateData = { status };
    if (adminResponse && adminResponse.comment) {
      updateData.adminResponse = {
        comment: adminResponse.comment,
        respondedAt: new Date(),
        respondedBy: req.user.id,
      };
    }

    const review = await Review.findByIdAndUpdate(reviewId, updateData, {
      new: true,
    }).populate('product', 'name slug');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Update product rating if status changed
    if (status === 'approved' || status === 'rejected') {
      await updateProductRating(review.product);
    }

    res.json({
      success: true,
      message: 'Review status updated successfully',
      data: { review },
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status',
      error: error.message,
    });
  }
};

/**
 * Helper function to update product rating
 */
const updateProductRating = async (productId) => {
  try {
    const result = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const rating = result[0] || { averageRating: 0, count: 0 };

    await Product.findByIdAndUpdate(productId, {
      'rating.average': Math.round(rating.averageRating * 10) / 10, // Round to 1 decimal
      'rating.count': rating.count,
    });
  } catch (error) {
    console.error('Update product rating error:', error);
  }
};
