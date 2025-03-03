import api from './authApi';

export const getAllAccounts = async () => {
  try {
    const response = await api.get('/accounts');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch accounts' };
  }
};

export const getAccountById = async (id) => {
  try {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch account' };
  }
};

export const getAccountsByUserId = async (userId) => {
  try {
    const response = await api.get(`/accounts/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user accounts' };
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await api.post('/accounts', accountData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create account' };
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await api.put(`/accounts/${id}`, accountData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update account' };
  }
};

export const deleteAccount = async (id) => {
  try {
    await api.delete(`/accounts/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};