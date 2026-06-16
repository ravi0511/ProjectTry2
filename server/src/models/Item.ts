// src/models/Item.ts

import { Item as ItemType } from '../types/index';

/**
 * Item Model
 * Represents a task/item document in Cosmos DB
 */
export class Item implements ItemType {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    userId: string,
    title: string,
    description: string,
    dueDate?: Date
  ) {
    this.id = this.generateId();
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.status = 'pending';
    this.dueDate = dueDate;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Generate unique ID using timestamp and random string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update item status
   */
  setStatus(status: 'pending' | 'in-progress' | 'completed'): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Update item details
   */
  update(title: string, description: string, dueDate?: Date): void {
    this.title = title;
    this.description = description;
    if (dueDate) {
      this.dueDate = dueDate;
    }
    this.updatedAt = new Date();
  }

  /**
   * Convert to plain object for storage
   */
  toDocument(): any {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Create Item instance from stored document
   */
  static fromDocument(doc: any): Item {
    const item = new Item(doc.userId, doc.title, doc.description, doc.dueDate);
    item.id = doc.id;
    item.status = doc.status;
    item.createdAt = new Date(doc.createdAt);
    item.updatedAt = new Date(doc.updatedAt);
    return item;
  }
}
