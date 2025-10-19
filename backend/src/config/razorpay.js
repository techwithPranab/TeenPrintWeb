import Razorpay from 'razorpay';

// Initialize Razorpay instance only if credentials are configured
const razorpayInstance = (process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_xxxxxxxxxxxxxx' &&
    process.env.RAZORPAY_KEY_SECRET !== 'your-razorpay-key-secret')
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

if (razorpayInstance) {
  console.log('Razorpay initialized successfully');
} else {
  console.log('Razorpay not configured - payment features will be disabled');
}

export default razorpayInstance;
