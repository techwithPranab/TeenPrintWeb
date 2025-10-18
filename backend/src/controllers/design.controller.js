import Design from '../models/Design.model.js';
import Product from '../models/Product.model.js';
import { deleteImage } from '../services/cloudinary.service.js';

/**
 * Save or create design
 */
export const saveDesign = async (req, res) => {
  try {
    const { product, name, canvasData, previews, uploadedImages, isDraft } = req.body;
    const userId = req.user.id;

    // Validate product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const designData = {
      user: userId,
      product,
      name: name || 'Untitled Design',
      canvasData,
      previews,
      uploadedImages: uploadedImages || [],
      isDraft: isDraft !== false,
      status: isDraft !== false ? 'draft' : 'final',
    };

    const design = await Design.create(designData);

    res.status(201).json({
      success: true,
      message: 'Design saved successfully',
      data: { design },
    });
  } catch (error) {
    console.error('Save design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save design',
      error: error.message,
    });
  }
};

/**
 * Get design by ID
 */
export const getDesign = async (req, res) => {
  try {
    const { id } = req.params;

    const design = await Design.findById(id)
      .populate('product', 'name slug mockups designArea')
      .populate('user', 'firstName lastName email');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Check if user owns the design
    if (design.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { design },
    });
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch design',
      error: error.message,
    });
  }
};

/**
 * Update design
 */
export const updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const design = await Design.findById(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Check if user owns the design
    if (design.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update design
    Object.assign(design, updateData);
    await design.save();

    res.json({
      success: true,
      message: 'Design updated successfully',
      data: { design },
    });
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update design',
      error: error.message,
    });
  }
};

/**
 * Delete design
 */
export const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;

    const design = await Design.findById(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Check if user owns the design
    if (design.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Delete uploaded images from Cloudinary
    const deletePromises = [];

    if (design.previews?.front?.publicId) {
      deletePromises.push(deleteImage(design.previews.front.publicId));
    }
    if (design.previews?.back?.publicId) {
      deletePromises.push(deleteImage(design.previews.back.publicId));
    }

    for (const img of design.uploadedImages || []) {
      if (img.publicId) {
        deletePromises.push(deleteImage(img.publicId));
      }
    }

    await Promise.all(deletePromises);

    // Delete design
    await Design.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete design',
      error: error.message,
    });
  }
};

/**
 * Get user's designs
 */
export const getUserDesigns = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Check if user is accessing their own designs or is admin
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const designs = await Design.find({ user: userId })
      .populate('product', 'name slug mockups')
      .sort('-updatedAt');

    res.json({
      success: true,
      data: { designs },
    });
  } catch (error) {
    console.error('Get user designs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch designs',
      error: error.message,
    });
  }
};
