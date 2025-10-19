import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary only if credentials are provided
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-cloud-name' &&
  process.env.CLOUDINARY_API_KEY !== 'your-cloudinary-api-key' &&
  process.env.CLOUDINARY_API_SECRET !== 'your-cloudinary-api-secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  // Test connection
  const testConnection = async () => {
    try {
      await cloudinary.api.ping();
      console.log('Cloudinary connected successfully');
    } catch (error) {
      console.error('Cloudinary connection error:', error.message);
    }
  };

  testConnection();
} else {
  console.log('Cloudinary not configured - image upload features will be disabled');
}

export { cloudinary as default };
