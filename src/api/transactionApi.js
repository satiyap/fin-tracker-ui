import api from './authApi';

export const getAllTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transactions' };
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transaction' };
  }
};

export const getTransactionsByAccountId = async (accountId) => {
  try {
    const response = await api.get(`/transactions/account/${accountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch account transactions' };
  }
};

export const getTransactionsByDateRange = async (start, end) => {
  try {
    const response = await api.get(`/transactions/date-range?start=${start}&end=${end}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transactions by date range' };
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create transaction' };
  }
};

export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update transaction' };
  }
};

export const deleteTransaction = async (id) => {
  try {
    await api.delete(`/transactions/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete transaction' };
  }
};

export const getTransactionsByUserIdAndDateRange = async (userId, startDate, endDate) => {
  try {
    const response = await api.get(`/transactions`, {
      params: {
        userId,
        startDate,
        endDate
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};