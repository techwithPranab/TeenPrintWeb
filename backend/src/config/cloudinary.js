import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
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

export default cloudinary;
