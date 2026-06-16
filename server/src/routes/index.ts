// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './auth';
import itemRoutes from './items';

const router = Router();

/**
 * API Routes
 * Base URL: /api
 */

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
