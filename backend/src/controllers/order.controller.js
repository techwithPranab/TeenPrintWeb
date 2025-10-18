import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Coupon from '../models/Coupon.model.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/razorpay.service.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/email.service.js';

/**
 * Create order
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name slug mockups basePrice salePrice')
      .populate('items.design', 'name previews canvasData');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipping address',
      });
    }

    // Create order data
    const orderData = {
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        design: item.design?._id,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        customizations: item.customizations,
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India',
      },
      itemsTotal: cart.itemsTotal,
      discount: cart.discount,
      taxAmount: cart.taxAmount,
      shippingCharges: cart.shippingCharges,
      totalAmount: cart.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
    };

    // If coupon was applied, save it
    if (cart.coupon) {
      orderData.coupon = cart.coupon;
    }

    // Create order
    const order = await Order.create(orderData);

    // For online payment, create Razorpay order
    if (paymentMethod === 'razorpay') {
      try {
        const razorpayOrder = await createRazorpayOrder({
          amount: order.totalAmount,
          orderId: order.orderId,
          receipt: order.orderId,
        });

        order.paymentDetails.razorpayOrderId = razorpayOrder.id;
        await order.save();

        // Clear cart
        cart.items = [];
        cart.coupon = null;
        cart.itemsTotal = 0;
        cart.discount = 0;
        cart.taxAmount = 0;
        cart.total = 0;
        await cart.save();

        res.status(201).json({
          success: true,
          message: 'Order created successfully',
          data: {
            order,
            razorpayOrderId: razorpayOrder.id,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
          },
        });
      } catch (error) {
        // Delete order if Razorpay order creation fails
        await Order.findByIdAndDelete(order._id);
        throw error;
      }
    } else {
      // For COD, mark order as confirmed
      order.orderStatus = 'confirmed';
      await order.save();

      // Update coupon usage if used
      if (order.coupon) {
        await Coupon.findByIdAndUpdate(order.coupon, {
          $inc: { usedCount: 1 },
        });
      }

      // Clear cart
      cart.items = [];
      cart.coupon = null;
      cart.itemsTotal = 0;
      cart.discount = 0;
      cart.taxAmount = 0;
      cart.total = 0;
      await cart.save();

      // Send confirmation email
      try {
        await sendOrderConfirmationEmail(req.user.email, order);
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the order if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: { order },
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Verify payment
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update order
    const order = await Order.findOne({
      'paymentDetails.razorpayOrderId': razorpayOrderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = 'completed';
    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.razorpaySignature = razorpaySignature;
    order.orderStatus = 'confirmed';
    await order.save();

    // Update coupon usage if used
    if (order.coupon) {
      await Coupon.findByIdAndUpdate(order.coupon, {
        $inc: { usedCount: 1 },
      });
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(req.user.email, order);
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the order if email fails
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

/**
 * Get user orders
 */
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId };
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('items.product', 'name slug mockups')
      .populate('items.design', 'name previews')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number.parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      $or: [{ _id: orderId }, { orderId: orderId }],
    })
      .populate('items.product', 'name slug mockups basePrice salePrice')
      .populate('items.design', 'name previews canvasData')
      .populate('coupon', 'code discountType discountValue');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      $or: [{ _id: orderId }, { orderId: orderId }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed', 'processing'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled',
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Send notification email
    try {
      await sendOrderStatusEmail(req.user.email, order);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};
