import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/item/:itemId', authenticate, cartController.updateCartItem);
router.delete('/item/:itemId', authenticate, cartController.removeFromCart);
router.post('/coupon/apply', authenticate, cartController.applyCoupon);
router.delete('/coupon', authenticate, cartController.removeCoupon);
router.delete('/clear', authenticate, cartController.clearCart);

export default router;
