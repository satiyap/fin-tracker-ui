import api from './authApi';

export const getAllInvestments = async () => {
  try {
    const response = await api.get('/investments');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch investments' };
  }
};

export const getInvestmentById = async (id) => {
  try {
    const response = await api.get(`/investments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch investment' };
  }
};

export const getInvestmentsByUserId = async (userId) => {
  try {
    const response = await api.get(`/investments/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user investments' };
  }
};

export const getInvestmentsByType = async (type) => {
  try {
    const response = await api.get(`/investments/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch investments by type' };
  }
};

export const createInvestment = async (investmentData) => {
  try {
    const response = await api.post('/investments', investmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create investment' };
  }
};

export const updateInvestment = async (id, investmentData) => {
  try {
    const response = await api.put(`/investments/${id}`, investmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update investment' };
  }
};

export const deleteInvestment = async (id) => {
  try {
    await api.delete(`/investments/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete investment' };
  }
};

export const updateInvestmentValue = async (id, value) => {
  try {
    const response = await api.put(`/investments/${id}/value?value=${value}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update investment value' };
  }
};

export const calculateReturnRate = async (id) => {
  try {
    const response = await api.get(`/investments/${id}/return-rate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to calculate return rate' };
  }
};