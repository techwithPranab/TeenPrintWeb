import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';

// Get statistics for the about page
export const getStats = async (req, res) => {
  try {
    // Get total customers count
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get average rating from orders (assuming orders have ratings)
    const ordersWithRating = await Order.find({ rating: { $exists: true, $ne: null } });
    const averageRating = ordersWithRating.length > 0
      ? (ordersWithRating.reduce((sum, order) => sum + order.rating, 0) / ordersWithRating.length).toFixed(1)
      : '0.0';

    // Get total categories count
    const totalCategories = await Category.countDocuments();

    const stats = {
      totalCustomers: totalCustomers > 0 ? `${(totalCustomers / 1000).toFixed(0)}K+` : '0',
      totalOrders: totalOrders > 0 ? `${(totalOrders / 1000).toFixed(0)}K+` : '0',
      totalProducts: totalProducts > 0 ? `${totalProducts}+` : '0',
      averageRating: `${averageRating}/5`,
      totalCategories: totalCategories > 0 ? `${totalCategories}+` : '0'
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
