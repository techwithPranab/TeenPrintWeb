import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';

/**
 * Create Razorpay Order
 * @param {Number} amount - Amount in rupees
 * @param {String} orderId - Our order ID
 * @param {Object} customerInfo - Customer details
 */
export const createRazorpayOrder = async (amount, orderId, customerInfo) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId: orderId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
      },
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    return razorpayOrder;
  } catch (error) {
    throw new Error(`Razorpay order creation failed: ${error.message}`);
  }
};

/**
 * Verify Razorpay Payment Signature
 * @param {String} orderId - Razorpay order ID
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} signature - Razorpay signature
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    throw new Error(`Signature verification failed: ${error.message}`);
  }
};

/**
 * Fetch payment details
 */
export const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error(`Failed to fetch payment details: ${error.message}`);
  }
};

/**
 * Create refund
 */
export const createRefund = async (paymentId, amount = null) => {
  try {
    const refundData = amount ? { amount: amount * 100 } : {}; // Full refund if amount not provided
    const refund = await razorpayInstance.payments.refund(
      paymentId,
      refundData
    );
    return refund;
  } catch (error) {
    throw new Error(`Refund creation failed: ${error.message}`);
  }
};
