import express from 'express';
import * as contactController from '../controllers/contact.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// Public route - submit contact form
router.post('/', contactController.submitContactForm);

// Admin routes - require authentication and admin role
router.get('/', authenticate, isAdmin, contactController.getAllContacts);
router.get('/:id', authenticate, isAdmin, contactController.getContactById);
router.put('/:id/status', authenticate, isAdmin, contactController.updateContactStatus);
router.delete('/:id', authenticate, isAdmin, contactController.deleteContact);

export default router;
