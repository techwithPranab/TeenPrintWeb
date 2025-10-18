import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import Coupon from '../models/Coupon.model.js';
import Design from '../models/Design.model.js';

/**
 * Calculate cart totals
 */
const calculateCartTotals = async (cart) => {
  let itemsTotal = 0;
  let totalDiscount = 0;

  for (const item of cart.items) {
    const itemPrice = item.price * item.quantity;
    itemsTotal += itemPrice;
  }

  // Calculate coupon discount
  if (cart.coupon) {
    const coupon = await Coupon.findById(cart.coupon);
    if (coupon && coupon.isActive) {
      // Check if coupon is valid
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        cart.coupon = null;
      } else if (coupon.validFrom && new Date(coupon.validFrom) > new Date()) {
        cart.coupon = null;
      } else if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
        cart.coupon = null;
      } else if (coupon.minOrderValue && itemsTotal < coupon.minOrderValue) {
        cart.coupon = null;
      } else {
        // Calculate discount
        if (coupon.discountType === 'percentage') {
          totalDiscount = (itemsTotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) {
            totalDiscount = Math.min(totalDiscount, coupon.maxDiscountAmount);
          }
        } else if (coupon.discountType === 'flat') {
          totalDiscount = coupon.discountValue;
        }
      }
    } else {
      cart.coupon = null;
    }
  }

  const taxAmount = ((itemsTotal - totalDiscount) * cart.taxRate) / 100;
  const total = itemsTotal - totalDiscount + taxAmount + cart.shippingCharges;

  cart.itemsTotal = itemsTotal;
  cart.discount = totalDiscount;
  cart.taxAmount = taxAmount;
  cart.total = total;

  return cart;
};

/**
 * Get cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name slug mockups basePrice salePrice specifications')
      .populate('items.design', 'name previews')
      .populate('coupon', 'code discountType discountValue');

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await Cart.create({ user: userId, items: [] });
    } else {
      // Recalculate totals
      cart = await calculateCartTotals(cart);
      await cart.save();
    }

    res.json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message,
    });
  }
};

/**
 * Add to cart
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, designId, quantity, selectedSize, selectedColor, customizations } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Validate design if provided
    if (designId) {
      const design = await Design.findById(designId);
      if (!design) {
        return res.status(404).json({
          success: false,
          message: 'Design not found',
        });
      }
      if (design.user.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Design does not belong to user',
        });
      }
    }

    const price = product.salePrice || product.basePrice;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.design?.toString() === designId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        design: designId,
        quantity: quantity || 1,
        price,
        selectedSize,
        selectedColor,
        customizations,
      });
    }

    // Recalculate totals
    cart = await calculateCartTotals(cart);
    await cart.save();

    // Populate cart before sending
    await cart.populate('items.product', 'name slug mockups basePrice salePrice');
    await cart.populate('items.design', 'name previews');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: { cart },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message,
    });
  }
};

/**
 * Update cart item
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    item.quantity = quantity;

    // Recalculate totals
    cart = await calculateCartTotals(cart);
    await cart.save();

    // Populate cart before sending
    await cart.populate('items.product', 'name slug mockups basePrice salePrice');
    await cart.populate('items.design', 'name previews');

    res.json({
      success: true,
      message: 'Cart item updated',
      data: { cart },
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message,
    });
  }
};

/**
 * Remove from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items.pull(itemId);

    // Recalculate totals
    cart = await calculateCartTotals(cart);
    await cart.save();

    // Populate cart before sending
    await cart.populate('items.product', 'name slug mockups basePrice salePrice');
    await cart.populate('items.design', 'name previews');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: { cart },
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message,
    });
  }
};

/**
 * Apply coupon
 */
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code',
      });
    }

    // Validate coupon
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit reached',
      });
    }

    if (coupon.validFrom && new Date(coupon.validFrom) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not yet valid',
      });
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired',
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    if (coupon.minOrderValue && cart.itemsTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required`,
      });
    }

    cart.coupon = coupon._id;

    // Recalculate totals with coupon
    cart = await calculateCartTotals(cart);
    await cart.save();

    // Populate cart before sending
    await cart.populate('items.product', 'name slug mockups basePrice salePrice');
    await cart.populate('items.design', 'name previews');
    await cart.populate('coupon', 'code discountType discountValue');

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: { cart },
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message,
    });
  }
};

/**
 * Remove coupon
 */
export const removeCoupon = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.coupon = null;

    // Recalculate totals without coupon
    cart = await calculateCartTotals(cart);
    await cart.save();

    // Populate cart before sending
    await cart.populate('items.product', 'name slug mockups basePrice salePrice');
    await cart.populate('items.design', 'name previews');

    res.json({
      success: true,
      message: 'Coupon removed',
      data: { cart },
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove coupon',
      error: error.message,
    });
  }
};

/**
 * Clear cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    cart.coupon = null;

    // Recalculate totals
    cart = await calculateCartTotals(cart);
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { cart },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
};
