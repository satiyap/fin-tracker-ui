import { useState, useEffect, useCallback } from 'react';
import { 
  getAllScheduledTransactions, 
  getScheduledTransactionsByUserId, 
  createScheduledTransaction,
  updateScheduledTransaction,
  deleteScheduledTransaction,
  executeScheduledTransaction
} from '../api/scheduledTransactionApi';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useScheduledTransactions = () => {
  const [scheduledTransactions, setScheduledTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchScheduledTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      
      if (currentUser?.id) {
        data = await getScheduledTransactionsByUserId(currentUser.id);
      } else {
        data = await getAllScheduledTransactions();
      }
      
      setScheduledTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch scheduled transactions');
      toast.error(err.message || 'Failed to fetch scheduled transactions');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchScheduledTransactions();
  }, [fetchScheduledTransactions]);

  const addScheduledTransaction = async (transactionData) => {
    try {
      const newTransaction = await createScheduledTransaction(transactionData);
      setScheduledTransactions(prev => [...prev, newTransaction]);
      toast.success('Scheduled transaction added successfully');
      return newTransaction;
    } catch (err) {
      toast.error(err.message || 'Failed to add scheduled transaction');
      throw err;
    }
  };

  const editScheduledTransaction = async (id, transactionData) => {
    try {
      const updatedTransaction = await updateScheduledTransaction(id, transactionData);
      setScheduledTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      toast.success('Scheduled transaction updated successfully');
      return updatedTransaction;
    } catch (err) {
      toast.error(err.message || 'Failed to update scheduled transaction');
      throw err;
    }
  };

  const removeScheduledTransaction = async (id) => {
    try {
      await deleteScheduledTransaction(id);
      setScheduledTransactions(prev => 
        prev.filter(transaction => transaction.id !== id)
      );
      toast.success('Scheduled transaction deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete scheduled transaction');
      throw err;
    }
  };

  const executeTransaction = async (id) => {
    try {
      const result = await executeScheduledTransaction(id);
      
      // Update the next due date in the local state
      const updatedTransactions = scheduledTransactions.map(transaction => {
        if (transaction.id === id) {
          // Assuming the API returns the updated scheduled transaction
          return { ...transaction, nextDueDate: result.nextDueDate };
        }
        return transaction;
      });
      
      setScheduledTransactions(updatedTransactions);
      toast.success('Transaction executed successfully');
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to execute transaction');
      throw err;
    }
  };

  return {
    scheduledTransactions,
    loading,
    error,
    fetchScheduledTransactions,
    addScheduledTransaction,
    editScheduledTransaction,
    removeScheduledTransaction,
    executeTransaction
  };
};