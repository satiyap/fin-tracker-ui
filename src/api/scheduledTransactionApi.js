import api from './authApi';

export const getAllScheduledTransactions = async () => {
  try {
    const response = await api.get('/scheduled-transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch scheduled transactions' };
  }
};

export const getScheduledTransactionById = async (id) => {
  try {
    const response = await api.get(`/scheduled-transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch scheduled transaction' };
  }
};

export const getScheduledTransactionsByAccountId = async (accountId) => {
  try {
    const response = await api.get(`/scheduled-transactions/account/${accountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch account scheduled transactions' };
  }
};

export const getScheduledTransactionsByUserId = async (userId) => {
  try {
    const response = await api.get(`/scheduled-transactions/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user scheduled transactions' };
  }
};

export const getUpcomingScheduledTransactions = async (date) => {
  try {
    const response = await api.get(`/scheduled-transactions/upcoming?date=${date}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch upcoming scheduled transactions' };
  }
};

export const createScheduledTransaction = async (transactionData) => {
  try {
    const response = await api.post('/scheduled-transactions', transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create scheduled transaction' };
  }
};

export const updateScheduledTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(`/scheduled-transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update scheduled transaction' };
  }
};

export const deleteScheduledTransaction = async (id) => {
  try {
    await api.delete(`/scheduled-transactions/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete scheduled transaction' };
  }
};

export const executeScheduledTransaction = async (id) => {
  try {
    const response = await api.post(`/scheduled-transactions/${id}/execute`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to execute scheduled transaction' };
  }
};