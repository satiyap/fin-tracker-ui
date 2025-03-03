import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as loginApi, register as registerApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      auth.login(
        { id: response.userId, username: response.username },
        response.token
      );
      navigate('/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerApi(userData);
      navigate('/login');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    navigate('/login');
  };

  return {
    currentUser: auth.currentUser,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    login,
    register,
    logout
  };
};