// src/routes/items.ts

import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { verifyToken } from '../middleware/auth';

const router = Router();

/**
 * Item Routes (all protected)
 */

// All item routes require authentication
router.use(verifyToken);

// CRUD operations
router.post('/', ItemController.createItem);
router.get('/', ItemController.getUserItems);
router.get('/status/:status', ItemController.getItemsByStatus);
router.get('/overdue', ItemController.getOverdueItems);
router.get('/:id', ItemController.getItemById);
router.put('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

export default router;
