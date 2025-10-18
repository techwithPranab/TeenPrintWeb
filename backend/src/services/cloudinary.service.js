import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadImage = async (fileBuffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'teenprint',
          resource_type: 'auto',
          transformation: options.transformation || [
            { quality: 'auto', fetch_format: 'auto' },
          ],
          ...options,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
      );

      const readableStream = Readable.from(fileBuffer);
      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload design image
 */
export const uploadDesignImage = async (fileBuffer, userId) => {
  return await uploadImage(fileBuffer, {
    folder: `teenprint/designs/${userId}`,
    transformation: [
      { width: 2000, height: 2000, crop: 'limit' },
      { quality: 'auto:good', fetch_format: 'auto' },
    ],
  });
};

/**
 * Upload product mockup
 */
export const uploadProductMockup = async (fileBuffer, productSlug) => {
  return await uploadImage(fileBuffer, {
    folder: `teenprint/products/${productSlug}`,
    transformation: [
      { width: 1500, height: 1500, crop: 'limit' },
      { quality: 'auto:best', fetch_format: 'auto' },
    ],
  });
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (fileBuffer, userId) => {
  return await uploadImage(fileBuffer, {
    folder: `teenprint/users/${userId}`,
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Public ID of the image
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Generate optimized URL with transformations
 */
export const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: options.quality || 'auto', fetch_format: 'auto' },
      options.width && { width: options.width },
      options.height && { height: options.height },
      options.crop && { crop: options.crop },
    ].filter(Boolean),
    secure: true,
  });
};

/**
 * Generate thumbnail
 */
export const generateThumbnail = (publicId, width = 300, height = 300) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality: 'auto:low', fetch_format: 'auto' },
    ],
    secure: true,
  });
};
