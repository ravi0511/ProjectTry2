// src/components/Dashboard.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { getStoredUser } from '../utils/storage';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import type { Item } from './ItemList';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items when status filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.status === statusFilter));
    }
  }, [items, statusFilter]);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get('/items');
      setItems(response.data.data || []);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Failed to load items. Please try again.'
      );
      console.error('Error fetching items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Task Management Dashboard
            </h1>
            <p className="text-gray-600">Welcome, {user.name}!</p>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchItems}
              className="mt-2 text-red-600 font-medium hover:underline text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Item Form */}
        <ItemForm
          editingItem={editingItem}
          onSubmitSuccess={() => {
            fetchItems();
            setEditingItem(null);
          }}
          onCancel={() => setEditingItem(null)}
        />

        {/* Status Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'pending'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending ({items.filter((i) => i.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'in-progress'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            In Progress ({items.filter((i) => i.status === 'in-progress').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Completed ({items.filter((i) => i.status === 'completed').length})
          </button>
        </div>

        {/* Items List */}
        {isLoading ? (
          <div className="card card-lg text-center py-12">
            <p className="text-gray-500 text-lg">Loading items...</p>
          </div>
        ) : (
          <ItemList
            items={filteredItems}
            onItemUpdated={fetchItems}
            onEditItem={setEditingItem}
          />
        )}
      </main>
    </div>
  );
}
