import api from './api';

export const getCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);

// Admin only
export const createCategory = (category) => api.post('/admin/categories', category);
export const updateCategory = (id, category) => api.put(`/admin/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);
