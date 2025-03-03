import { useState, useEffect, useCallback } from 'react';
import { 
  getAllTransactions, 
  getTransactionsByAccountId, 
  getTransactionsByDateRange,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../api/transactionApi';
import { toast } from 'react-toastify';

export const useTransactions = (accountId = null, dateRange = null) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      
      if (accountId) {
        data = await getTransactionsByAccountId(accountId);
      } else if (dateRange && dateRange.start && dateRange.end) {
        data = await getTransactionsByDateRange(dateRange.start, dateRange.end);
      } else {
        data = await getAllTransactions();
      }
      
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
      toast.error(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [accountId, dateRange]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await createTransaction(transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      toast.success('Transaction added successfully');
      return newTransaction;
    } catch (err) {
      toast.error(err.message || 'Failed to add transaction');
      throw err;
    }
  };

  const editTransaction = async (id, transactionData) => {
    try {
      const updatedTransaction = await updateTransaction(id, transactionData);
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      toast.success('Transaction updated successfully');
      return updatedTransaction;
    } catch (err) {
      toast.error(err.message || 'Failed to update transaction');
      throw err;
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => 
        prev.filter(transaction => transaction.id !== id)
      );
      toast.success('Transaction deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete transaction');
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction
  };
};