import express from 'express';
import * as designController from '../controllers/design.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All design routes require authentication
router.post('/', authenticate, designController.saveDesign);
router.get('/:id', authenticate, designController.getDesign);
router.put('/:id', authenticate, designController.updateDesign);
router.delete('/:id', authenticate, designController.deleteDesign);
router.get('/user/:userId?', authenticate, designController.getUserDesigns);

export default router;
