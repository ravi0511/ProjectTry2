// src/services/ItemService.ts

import { getContainer } from '../config/cosmos';
import { Item } from '../models/Item';
import { CreateItemPayload, UpdateItemPayload } from '../types/index';

export class ItemService {
  /**
   * Create a new item
   */
  static async createItem(
    userId: string,
    payload: CreateItemPayload
  ): Promise<Item> {
    try {
      const container = getContainer();
      const item = new Item(userId, payload.title, payload.description, payload.dueDate);
      const document = item.toDocument();

      const { resource } = await container.items.create(document);

      if (!resource) {
        throw new Error('Failed to create item');
      }

      return Item.fromDocument(resource);
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  /**
   * Get all items for a user
   */
  static async getUserItems(userId: string): Promise<Item[]> {
    try {
      const container = getContainer();

      const query = `
        SELECT * FROM c
        WHERE c.userId = @userId
        ORDER BY c.createdAt DESC
      `;

      const { resources } = await container.items
        .query(query, {
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll();

      return resources.map((doc) => Item.fromDocument(doc));
    } catch (error) {
      console.error('Error fetching user items:', error);
      throw error;
    }
  }

  /**
   * Get a single item by ID
   */
  static async getItemById(itemId: string, userId: string): Promise<Item | null> {
    try {
      const container = getContainer();

      // Cosmos DB requires partition key value for point reads
      const { resource } = await container.item(itemId, userId).read();

      if (!resource) {
        return null;
      }

      return Item.fromDocument(resource);
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  /**
   * Update an item
   */
  static async updateItem(
    itemId: string,
    userId: string,
    payload: UpdateItemPayload
  ): Promise<Item> {
    try {
      const container = getContainer();

      // Get existing item
      const existingItem = await this.getItemById(itemId, userId);
      if (!existingItem) {
        throw new Error('Item not found');
      }

      // Update fields
      if (payload.title) existingItem.title = payload.title;
      if (payload.description) existingItem.description = payload.description;
      if (payload.status) existingItem.setStatus(payload.status);
      if (payload.dueDate) existingItem.dueDate = payload.dueDate;
      existingItem.updatedAt = new Date();

      const updatedDocument = existingItem.toDocument();
      const { resource } = await container.item(itemId, userId).replace(updatedDocument);

      if (!resource) {
        throw new Error('Failed to update item');
      }

      return Item.fromDocument(resource);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  /**
   * Delete an item
   */
  static async deleteItem(itemId: string, userId: string): Promise<boolean> {
    try {
      const container = getContainer();

      // Verify item exists and belongs to user
      const item = await this.getItemById(itemId, userId);
      if (!item) {
        throw new Error('Item not found');
      }

      await container.item(itemId, userId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  /**
   * Get items by status
   */
  static async getItemsByStatus(
    userId: string,
    status: 'pending' | 'in-progress' | 'completed'
  ): Promise<Item[]> {
    try {
      const container = getContainer();

      const query = `
        SELECT * FROM c
        WHERE c.userId = @userId AND c.status = @status
        ORDER BY c.dueDate ASC, c.createdAt DESC
      `;

      const { resources } = await container.items
        .query(query, {
          parameters: [
            { name: '@userId', value: userId },
            { name: '@status', value: status },
          ],
        })
        .fetchAll();

      return resources.map((doc) => Item.fromDocument(doc));
    } catch (error) {
      console.error('Error fetching items by status:', error);
      throw error;
    }
  }

  /**
   * Get overdue items (dueDate in past)
   */
  static async getOverdueItems(userId: string): Promise<Item[]> {
    try {
      const container = getContainer();
      const now = new Date();

      const query = `
        SELECT * FROM c
        WHERE c.userId = @userId
          AND c.status != 'completed'
          AND c.dueDate < @now
        ORDER BY c.dueDate ASC
      `;

      const { resources } = await container.items
        .query(query, {
          parameters: [
            { name: '@userId', value: userId },
            { name: '@now', value: now.toISOString() },
          ],
        })
        .fetchAll();

      return resources.map((doc) => Item.fromDocument(doc));
    } catch (error) {
      console.error('Error fetching overdue items:', error);
      throw error;
    }
  }
}
