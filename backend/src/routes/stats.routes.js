import express from 'express';
import * as statsController from '../controllers/stats.controller.js';

const router = express.Router();

// Public route to get statistics
router.get('/stats', statsController.getStats);

export default router;
