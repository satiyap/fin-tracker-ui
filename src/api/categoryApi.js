import api from './authApi';

export const getAllCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch categories' };
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch category' };
  }
};

export const getCategoriesByType = async (type) => {
  try {
    const response = await api.get(`/categories/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch categories by type' };
  }
};

export const getRootCategories = async () => {
  try {
    const response = await api.get('/categories/root');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch root categories' };
  }
};

export const getSubcategories = async (parentId) => {
  try {
    const response = await api.get(`/categories/subcategories/${parentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch subcategories' };
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create category' };
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update category' };
  }
};

export const deleteCategory = async (id) => {
  try {
    await api.delete(`/categories/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete category' };
  }
};