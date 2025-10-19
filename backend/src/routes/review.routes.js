import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// Public routes
router.get('/products/:productId', reviewController.getProductReviews);

// Protected routes (require authentication)
router.post('/products/:productId', authenticate, reviewController.createReview);
router.put('/:reviewId', authenticate, reviewController.updateReview);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);
router.post('/:reviewId/helpful', authenticate, reviewController.markReviewHelpful);
router.get('/user', authenticate, reviewController.getUserReviews);

// Admin routes
router.get('/', authenticate, isAdmin, reviewController.getAllReviews);
router.put('/:reviewId/status', authenticate, isAdmin, reviewController.updateReviewStatus);

export default router;
