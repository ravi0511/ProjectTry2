// src/components/ItemList.tsx

import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ItemListProps {
  items: Item[];
  onItemUpdated: () => void;
  onEditItem: (item: Item) => void;
}

export default function ItemList({
  items,
  onItemUpdated,
  onEditItem,
}: ItemListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStatusChange = async (
    itemId: string,
    newStatus: 'pending' | 'in-progress' | 'completed'
  ) => {
    try {
      await axiosInstance.put(`/items/${itemId}`, { status: newStatus });
      onItemUpdated();
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setDeletingId(itemId);
    try {
      await axiosInstance.delete(`/items/${itemId}`);
      onItemUpdated();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (items.length === 0) {
    return (
      <div className="card card-lg text-center py-12">
        <p className="text-gray-500 text-lg">No items yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="card card-md hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {item.dueDate && (
                  <div>
                    <span className="font-medium">Due:</span> {formatDate(item.dueDate)}
                  </div>
                )}
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {formatDate(item.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <select
                value={item.status}
                onChange={(e) =>
                  handleStatusChange(
                    item.id,
                    e.target.value as 'pending' | 'in-progress' | 'completed'
                  )
                }
                className="btn btn-secondary btn-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => onEditItem(item)}
                className="btn btn-secondary btn-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="btn btn-danger btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === item.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
