import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: false,
  },
  designSnapshot: {
    // Store design data at time of order
    canvasData: mongoose.Schema.Types.Mixed,
    previews: {
      front: {
        url: String,
        publicId: String,
      },
      back: {
        url: String,
        publicId: String,
      },
    },
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: 'India',
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
      },
      couponCode: String,
      shippingCharges: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    payment: {
      method: {
        type: String,
        enum: ['razorpay', 'cod'],
        default: 'razorpay',
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      paidAt: Date,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'printing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    shipping: {
      provider: {
        type: String,
        default: 'shiprocket',
      },
      trackingNumber: String,
      shipmentId: String,
      estimatedDelivery: Date,
      shippedAt: Date,
      deliveredAt: Date,
    },
    invoice: {
      url: String,
      publicId: String,
      generatedAt: Date,
    },
    notes: {
      customer: String,
      admin: String,
    },
    cancelReason: String,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });

// Generate order ID
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.orderId = `TP${year}${month}${random}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
