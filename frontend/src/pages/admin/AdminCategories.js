import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/applications', label: 'Applications', icon: '📋' },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/orders', label: 'Orders', icon: '🛒' },
  { to: '/admin/categories', label: 'Categories', icon: '📁' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, formData);
        toast.success('Category updated! 🎉');
      } else {
        await createCategory(formData);
        toast.success('Category created! 🚀');
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', imageUrl: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '', imageUrl: cat.imageUrl || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <DashboardLayout title="Manage Categories" navItems={navItems}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-header">📁 Manage Categories</h1>
          <p className="text-gray-500 mt-1">Add, update or delete product categories</p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '', imageUrl: '' }); setShowModal(true); }}
          className="btn-primary"
        >
          + Add Category
        </button>
      </div>

      {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.categoryId} className="glass-card overflow-hidden group">
                <div className="h-40 bg-gray-100 dark:bg-dark-700 relative">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => handleEdit(cat)} className="p-2 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(cat.categoryId)} className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{cat.description || 'No description available.'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                {editingCategory ? '✏️ Edit Category' : '📁 New Category'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="form-label">Category Name</label>
                  <input
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Electronics"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description..."
                  />
                </div>
                <div>
                  <label className="form-label">Image URL</label>
                  <input
                    className="input-field"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-3">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 py-3">
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </DashboardLayout>
  );
}
