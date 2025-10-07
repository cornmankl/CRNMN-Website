import { useUserStore } from '../../../store';
import { authService } from '../services/authService';
import { LoginCredentials, RegisterData } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } = useUserStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      clearUser();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user anyway
      clearUser();
      navigate(ROUTES.HOME);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await authService.requestPasswordReset({ email });
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: any) => {
    try {
      setLoading(true);
      await authService.changePassword(data);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearUser();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    requestPasswordReset,
    updateProfile,
    changePassword,
    checkAuth,
  };
};
