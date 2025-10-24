import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';

/**
 * Create Razorpay Order
 * @param {Object} orderData - Order data
 * @param {Number} orderData.amount - Amount in rupees
 * @param {String} orderData.orderId - Our order ID
 * @param {String} orderData.receipt - Receipt ID
 * @param {Object} orderData.customerInfo - Customer details (optional)
 */
export const createRazorpayOrder = async ({ amount, orderId, receipt, customerInfo }) => {
  if (!razorpayInstance) {
    throw new Error('Razorpay not configured');
  }
  
  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: receipt || orderId,
    };

    if (customerInfo) {
      options.notes = {
        orderId: orderId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
      };
    }

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
  if (!razorpayInstance) {
    throw new Error('Razorpay not configured');
  }
  
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
