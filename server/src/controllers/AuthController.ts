// src/controllers/AuthController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SignupPayload, AuthPayload } from '../types/index';

/**
 * Authentication Controller
 * Handles signup and login requests
 * 
 * Note: In a production app, you'd store users in Cosmos DB
 * This is a simplified example that could be extended
 */
export class AuthController {
  // In-memory user store (replace with Cosmos DB in production)
  private static users: Map<string, any> = new Map();

  /**
   * Signup endpoint
   * Creates a new user account
   */
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body as SignupPayload;

      // Validation
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: 'Email, password, and name are required',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters',
        });
        return;
      }

      // Check if user exists
      if (this.users.has(email)) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists',
        });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const userId = `user-${Date.now()}`;
      const user = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
      };

      this.users.set(email, user);

      // Generate JWT
      const jwtSecret = process.env.JWT_SECRET || '';
      const token = jwt.sign(
        { userId, email },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        message: 'Signup successful',
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        error: 'Signup failed',
      });
    }
  }

  /**
   * Login endpoint
   * Authenticates user and returns JWT token
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as AuthPayload;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      // Find user
      const user = this.users.get(email);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Generate JWT
      const jwtSecret = process.env.JWT_SECRET || '';
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
      });
    }
  }

  /**
   * Get current user info
   * Protected route - requires valid JWT
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      // Find user by ID
      let user = null;
      for (const [, u] of this.users) {
        if (u.id === req.user.userId) {
          user = u;
          break;
        }
      }

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user',
      });
    }
  }
}
