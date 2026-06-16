// src/controllers/ItemController.ts

import { Request, Response } from 'express';
import { ItemService } from '../services/ItemService';
import { CreateItemPayload, UpdateItemPayload } from '../types/index';

export class ItemController {
  /**
   * Create a new item
   * POST /api/items
   */
  static async createItem(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const payload = req.body as CreateItemPayload;

      if (!payload.title || !payload.description) {
        res.status(400).json({
          success: false,
          error: 'Title and description are required',
        });
        return;
      }

      const item = await ItemService.createItem(req.user.userId, payload);

      res.status(201).json({
        success: true,
        data: item,
        message: 'Item created successfully',
      });
    } catch (error) {
      console.error('Create item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create item',
      });
    }
  }

  /**
   * Get all items for the current user
   * GET /api/items
   */
  static async getUserItems(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const items = await ItemService.getUserItems(req.user.userId);

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.error('Get items error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch items',
      });
    }
  }

  /**
   * Get a single item by ID
   * GET /api/items/:id
   */
  static async getItemById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const item = await ItemService.getItemById(id, req.user.userId);

      if (!item) {
        res.status(404).json({
          success: false,
          error: 'Item not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error('Get item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch item',
      });
    }
  }

  /**
   * Update an item
   * PUT /api/items/:id
   */
  static async updateItem(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const payload = req.body as UpdateItemPayload;

      const item = await ItemService.updateItem(id, req.user.userId, payload);

      res.status(200).json({
        success: true,
        data: item,
        message: 'Item updated successfully',
      });
    } catch (error: any) {
      if (error.message === 'Item not found') {
        res.status(404).json({
          success: false,
          error: 'Item not found',
        });
        return;
      }

      console.error('Update item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update item',
      });
    }
  }

  /**
   * Delete an item
   * DELETE /api/items/:id
   */
  static async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const { id } = req.params;
      await ItemService.deleteItem(id, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Item not found') {
        res.status(404).json({
          success: false,
          error: 'Item not found',
        });
        return;
      }

      console.error('Delete item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete item',
      });
    }
  }

  /**
   * Get items by status
   * GET /api/items/status/:status
   */
  static async getItemsByStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const { status } = req.params;
      const validStatuses = ['pending', 'in-progress', 'completed'];

      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
        });
        return;
      }

      const items = await ItemService.getItemsByStatus(
        req.user.userId,
        status as 'pending' | 'in-progress' | 'completed'
      );

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.error('Get items by status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch items',
      });
    }
  }

  /**
   * Get overdue items
   * GET /api/items/overdue
   */
  static async getOverdueItems(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const items = await ItemService.getOverdueItems(req.user.userId);

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.error('Get overdue items error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch overdue items',
      });
    }
  }
}
