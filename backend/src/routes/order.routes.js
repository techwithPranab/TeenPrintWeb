import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All order routes require authentication
router.post('/', authenticate, orderController.createOrder);
router.post('/verify-payment', authenticate, orderController.verifyPayment);
router.get('/', authenticate, orderController.getOrders);
router.get('/:orderId', authenticate, orderController.getOrderById);
router.put('/:orderId/cancel', authenticate, orderController.cancelOrder);

export default router;
