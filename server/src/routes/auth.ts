// src/routes/auth.ts

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { verifyToken } from '../middleware/auth';

const router = Router();

/**
 * Authentication Routes
 */

// Public routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', verifyToken, AuthController.getCurrentUser);

export default router;
