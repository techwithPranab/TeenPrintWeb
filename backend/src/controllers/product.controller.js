import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import { uploadProductMockup, deleteImage } from '../services/cloudinary.service.js';

/**
 * Get all products with filters
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      isFeatured,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter query
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

/**
 * Get single product by ID or slug
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let product = await Product.findById(id).populate('category');

    if (!product) {
      product = await Product.findOne({ slug: id }).populate('category');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

/**
 * Create new product (Admin only)
 */
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Generate slug from name if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this slug already exists',
      });
    }

    // Create product
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
 * Update product (Admin only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category');

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
 * Delete product (Admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete associated images from Cloudinary
    const deletePromises = [];

    if (product.mockups?.front?.publicId) {
      deletePromises.push(deleteImage(product.mockups.front.publicId));
    }
    if (product.mockups?.back?.publicId) {
      deletePromises.push(deleteImage(product.mockups.back.publicId));
    }
    if (product.images?.length > 0) {
      product.images.forEach((img) => {
        if (img.publicId) {
          deletePromises.push(deleteImage(img.publicId));
        }
      });
    }

    await Promise.all(deletePromises);

    // Delete product
    await Product.findByIdAndDelete(id);

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
 * Upload product mockup (Admin only)
 */
export const uploadMockup = async (req, res) => {
  try {
    const { id } = req.params;
    const { side } = req.body; // 'front', 'back', or 'side'

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete old mockup if exists
    if (product.mockups?.[side]?.publicId) {
      await deleteImage(product.mockups[side].publicId);
    }

    // Upload new mockup
    const uploadResult = await uploadProductMockup(
      req.file.buffer,
      product.slug
    );

    // Update product
    product.mockups = product.mockups || {};
    product.mockups[side] = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };

    await product.save();

    res.json({
      success: true,
      message: 'Mockup uploaded successfully',
      data: {
        mockup: product.mockups[side],
      },
    });
  } catch (error) {
    console.error('Upload mockup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload mockup',
      error: error.message,
    });
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .populate('category', 'name slug')
      .limit(limit)
      .sort('-createdAt');

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message,
    });
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { sort = '-createdAt', limit = 12 } = req.query;

    const products = await Product.find({
      category: categoryId,
      isActive: true,
    })
      .populate('category', 'name slug')
      .sort(sort)
      .limit(Number(limit));

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};
