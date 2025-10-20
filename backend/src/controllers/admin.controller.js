import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Coupon from '../models/Coupon.model.js';
import Contact from '../models/Contact.model.js';
import { sendOrderStatusEmail } from '../services/email.service.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const query = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Get order statistics
    const totalOrders = await Order.countDocuments(query);
    const pendingOrders = await Order.countDocuments({ ...query, orderStatus: 'pending' });
    const completedOrders = await Order.countDocuments({ ...query, orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ ...query, orderStatus: 'cancelled' });

    // Get revenue statistics
    const revenueData = await Order.aggregate([
      { $match: { ...query, paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, averageOrderValue: 0 };

    // Get user statistics
    const totalUsers = await User.countDocuments(query);
    const totalProducts = await Product.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name')
      .sort('-createdAt')
      .limit(10);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          slug: '$product.slug',
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue: revenue.totalRevenue,
          averageOrderValue: revenue.averageOrderValue,
          totalUsers,
          totalProducts,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message,
    });
  }
};

/**
 * Get analytics data with charts and predictions
 */
export const getAnalyticsData = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));

    // Revenue trend data
    const revenueTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          date: '$_id',
          revenue: 1,
          orders: 1,
          _id: 0
        }
      }
    ]);

    // Order trend data
    const orderTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          date: '$_id',
          orders: 1,
          _id: 0
        }
      }
    ]);

    // Order status distribution
    const orderStatusData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0
        }
      }
    ]);

    // Top products by revenue
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          quantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: { $substr: ['$product.name', 0, 20] },
          revenue: 1,
          quantity: 1
        }
      }
    ]);

    // Calculate growth metrics
    const currentPeriodRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const previousPeriodRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousPeriodStart, $lt: startDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const currentRevenue = currentPeriodRevenue[0]?.total || 0;
    const previousRevenue = previousPeriodRevenue[0]?.total || 0;
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Order growth
    const currentPeriodOrders = await Order.countDocuments({ createdAt: { $gte: startDate } });
    const previousPeriodOrders = await Order.countDocuments({
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });
    const orderGrowth = previousPeriodOrders > 0 ? ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100 : 0;

    // Average order value
    const averageOrderValue = currentPeriodOrders > 0 ? currentRevenue / currentPeriodOrders : 0;

    // Conversion rate (simplified - orders vs estimated visitors)
    const conversionRate = Math.min(currentPeriodOrders * 0.1, 5); // Simplified calculation

    // Customer metrics
    const totalUsers = await User.countDocuments();
    const newCustomers = await User.countDocuments({ createdAt: { $gte: startDate } });
    const returningCustomers = await Order.distinct('user', { createdAt: { $gte: startDate } }).then(users => users.length);

    // Customer retention (simplified)
    const retentionRate = returningCustomers > 0 ? (returningCustomers / Math.max(totalUsers * 0.1, 1)) * 100 : 0;

    // Average lifetime value (simplified)
    const averageLifetimeValue = averageOrderValue * 2.5; // Simplified calculation

    // Inventory metrics
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ inStock: true, stockQuantity: { $lte: 10 } });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });
    const averageStockLevel = await Product.aggregate([
      { $match: { inStock: true } },
      {
        $group: {
          _id: null,
          avgStock: { $avg: '$stockQuantity' }
        }
      }
    ]).then(result => result[0]?.avgStock || 0);

    // Stock turnover rate (simplified)
    const stockTurnoverRate = topProducts.length > 0 ? topProducts.reduce((sum, product) => sum + product.quantity, 0) / totalProducts : 0;

    // Predictions (simplified algorithms)
    const nextMonthRevenue = currentRevenue * (1 + revenueGrowth / 100);
    const nextMonthOrders = Math.round(currentPeriodOrders * (1 + orderGrowth / 100));

    // Top performing category (simplified)
    const topCategory = 'T-Shirts'; // This would be calculated from actual data

    res.json({
      success: true,
      data: {
        // Growth metrics
        revenueGrowth,
        orderGrowth,
        averageOrderValue,
        conversionRate,

        // Chart data
        revenueTrend,
        orderTrend,
        orderStatusDistribution: orderStatusData,
        topProducts,

        // Customer metrics
        customerMetrics: {
          newCustomers,
          returningCustomers,
          retentionRate,
          averageLifetimeValue
        },

        // Inventory metrics
        inventoryMetrics: {
          lowStockItems: lowStockProducts,
          outOfStockItems: outOfStockProducts,
          averageStockLevel: Math.round(averageStockLevel),
          stockTurnoverRate
        },

        // Predictions
        predictions: {
          nextMonthRevenue,
          nextMonthOrders,
          orderGrowth,
          topCategory
        }
      }
    });
  } catch (error) {
    console.error('Get analytics data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message,
    });
  }
};

/**
 * Get all orders (admin)
 */
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { orderId: new RegExp(search, 'i') },
        { 'shippingAddress.fullName': new RegExp(search, 'i') },
        { 'shippingAddress.phone': new RegExp(search, 'i') },
      ];
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name slug')
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
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, trackingId, shippingProvider } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findOne({
      $or: [{ _id: orderId }, { orderId: orderId }],
    }).populate('user', 'email firstName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'shipped' && trackingId) {
      order.shippingDetails = {
        provider: shippingProvider,
        trackingId,
        shippedAt: new Date(),
      };
    }

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    if (orderStatus === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    // Send status update email
    try {
      await sendOrderStatusEmail(order.user.email, order);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

/**
 * Get all users (admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number.parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message,
    });
  }
};

/**
 * Get all coupons
 */
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');

    res.json({
      success: true,
      data: { coupons },
    });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: error.message,
    });
  }
};

/**
 * Create coupon
 */
export const createCoupon = async (req, res) => {
  try {
    const couponData = req.body;

    // Convert code to uppercase
    couponData.code = couponData.code.toUpperCase();

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: couponData.code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists',
      });
    }

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon },
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create coupon',
      error: error.message,
    });
  }
};

/**
 * Update coupon
 */
export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const updateData = req.body;

    // Convert code to uppercase if present
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(couponId, updateData, { new: true, runValidators: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: { coupon },
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon',
      error: error.message,
    });
  }
};

/**
 * Delete coupon
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon',
      error: error.message,
    });
  }
};

/**
 * Get all products (admin)
 */
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, inStock } = req.query;
    console.log('getAllProducts called with:', req.query);
    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { slug: new RegExp(search, 'i') },
      ];
    }
    if (category) query.category = category;
    if (inStock === 'true') query.inStock = true;
    if (inStock === 'false') query.inStock = false;

    const skip = (page - 1) * limit;
    console.log('fetchAdminProducts query:', query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number.parseInt(limit));

    console.log('Found products count:', products.length);
    const total = await Product.countDocuments(query);
    console.log('Total products count:', total);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

/**
 * Create product (admin)
 */
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Generate slug from name if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this slug already exists',
      });
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

/**
 * Update product (admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // Generate new slug if name is being updated
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Check if new slug conflicts with existing product
    if (updateData.slug) {
      const existingProduct = await Product.findOne({
        slug: updateData.slug,
        _id: { $ne: productId },
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this slug already exists',
        });
      }
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

/**
 * Delete product (admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

/**
 * Get all contacts (admin)
 */
export const getAllContacts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const subject = req.query.subject;

    const query = {};
    if (status) query.status = status;
    if (subject) query.subject = subject;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message,
    });
  }
};

/**
 * Get contact message by ID (Admin only)
 */
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      data: { contact },
    });
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: error.message,
    });
  }
};

/**
 * Update contact status (Admin only)
 */
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be unread, read, or replied',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: { contact },
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status',
      error: error.message,
    });
  }
};

/**
 * Delete contact message (Admin only)
 */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message,
    });
  }
};
