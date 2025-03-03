import { useState, useEffect, useCallback } from 'react';
import { 
  getAllCategories, 
  getCategoriesByType, 
  createCategory,
  updateCategory,
  deleteCategory
} from '../api/categoryApi';
import { toast } from 'react-toastify';

export const useCategories = (type = null) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      
      if (type) {
        data = await getCategoriesByType(type);
      } else {
        data = await getAllCategories();
      }
      
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      toast.error(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (categoryData) => {
    try {
      const newCategory = await createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added successfully');
      return newCategory;
    } catch (err) {
      toast.error(err.message || 'Failed to add category');
      throw err;
    }
  };

  const editCategory = async (id, categoryData) => {
    try {
      const updatedCategory = await updateCategory(id, categoryData);
      setCategories(prev => 
        prev.map(category => 
          category.id === id ? updatedCategory : category
        )
      );
      toast.success('Category updated successfully');
      return updatedCategory;
    } catch (err) {
      toast.error(err.message || 'Failed to update category');
      throw err;
    }
  };

  const removeCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(prev => 
        prev.filter(category => category.id !== id)
      );
      toast.success('Category deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory
  };
};