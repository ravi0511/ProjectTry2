// src/components/ItemForm.tsx

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { Item } from './ItemList';

interface ItemFormProps {
  editingItem: Item | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export default function ItemForm({
  editingItem,
  onSubmitSuccess,
  onCancel,
}: ItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        description: editingItem.description,
        dueDate: editingItem.dueDate
          ? new Date(editingItem.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
      });
    }
    setError(null);
  }, [editingItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
      };

      if (formData.dueDate) {
        payload.dueDate = new Date(formData.dueDate).toISOString();
      }

      if (editingItem) {
        await axiosInstance.put(`/items/${editingItem.id}`, payload);
      } else {
        await axiosInstance.post('/items', payload);
      }

      onSubmitSuccess();
      setFormData({ title: '', description: '', dueDate: '' });
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Failed to save item. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card card-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">
        {editingItem ? 'Edit Item' : 'Create New Item'}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Enter item title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input h-24 resize-none"
            placeholder="Enter item description"
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Due Date (Optional)
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? 'Saving...'
              : editingItem
                ? 'Update Item'
                : 'Create Item'}
          </button>

          {editingItem && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
