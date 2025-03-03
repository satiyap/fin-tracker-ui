import { useState, useEffect, useCallback } from 'react';
import { 
  getAllInvestments, 
  getInvestmentsByUserId, 
  createInvestment,
  updateInvestment,
  deleteInvestment,
  updateInvestmentValue
} from '../api/investmentApi';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      
      if (currentUser?.id) {
        data = await getInvestmentsByUserId(currentUser.id);
      } else {
        data = await getAllInvestments();
      }
      
      setInvestments(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch investments');
      toast.error(err.message || 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const addInvestment = async (investmentData) => {
    try {
      const newInvestment = await createInvestment(investmentData);
      setInvestments(prev => [...prev, newInvestment]);
      toast.success('Investment added successfully');
      return newInvestment;
    } catch (err) {
      toast.error(err.message || 'Failed to add investment');
      throw err;
    }
  };

  const editInvestment = async (id, investmentData) => {
    try {
      const updatedInvestment = await updateInvestment(id, investmentData);
      setInvestments(prev => 
        prev.map(investment => 
          investment.id === id ? updatedInvestment : investment
        )
      );
      toast.success('Investment updated successfully');
      return updatedInvestment;
    } catch (err) {
      toast.error(err.message || 'Failed to update investment');
      throw err;
    }
  };

  const removeInvestment = async (id) => {
    try {
      await deleteInvestment(id);
      setInvestments(prev => 
        prev.filter(investment => investment.id !== id)
      );
      toast.success('Investment deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete investment');
      throw err;
    }
  };

  const updateValue = async (id, value) => {
    try {
      const updatedInvestment = await updateInvestmentValue(id, value);
      setInvestments(prev => 
        prev.map(investment => 
          investment.id === id ? updatedInvestment : investment
        )
      );
      toast.success('Investment value updated successfully');
      return updatedInvestment;
    } catch (err) {
      toast.error(err.message || 'Failed to update investment value');
      throw err;
    }
  };

  return {
    investments,
    loading,
    error,
    fetchInvestments,
    addInvestment,
    editInvestment,
    removeInvestment,
    updateValue
  };
};