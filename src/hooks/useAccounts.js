import { useState, useEffect, useCallback } from 'react';
import { 
  getAllAccounts, 
  getAccountsByUserId, 
  createAccount,
  updateAccount,
  deleteAccount
} from '../api/accountApi';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      
      if (currentUser?.id) {
        data = await getAccountsByUserId(currentUser.id);
      } else {
        data = await getAllAccounts();
      }
      
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch accounts');
      toast.error(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = async (accountData) => {
    try {
      const newAccount = await createAccount(accountData);
      setAccounts(prev => [...prev, newAccount]);
      toast.success('Account added successfully');
      return newAccount;
    } catch (err) {
      toast.error(err.message || 'Failed to add account');
      throw err;
    }
  };

  const editAccount = async (id, accountData) => {
    try {
      const updatedAccount = await updateAccount(id, accountData);
      setAccounts(prev => 
        prev.map(account => 
          account.id === id ? updatedAccount : account
        )
      );
      toast.success('Account updated successfully');
      return updatedAccount;
    } catch (err) {
      toast.error(err.message || 'Failed to update account');
      throw err;
    }
  };

  const removeAccount = async (id) => {
    try {
      await deleteAccount(id);
      setAccounts(prev => 
        prev.filter(account => account.id !== id)
      );
      toast.success('Account deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
      throw err;
    }
  };

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    editAccount,
    removeAccount
  };
};