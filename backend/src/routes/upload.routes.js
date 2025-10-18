import express from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload, handleMulterError } from '../middleware/upload.middleware.js';

const router = express.Router();

// All upload routes require authentication
router.post(
  '/design',
  authenticate,
  upload.single('image'),
  handleMulterError,
  uploadController.uploadDesign
);

router.post(
  '/profile',
  authenticate,
  upload.single('image'),
  handleMulterError,
  uploadController.uploadProfile
);

router.delete('/delete', authenticate, uploadController.deleteUpload);

export default router;
