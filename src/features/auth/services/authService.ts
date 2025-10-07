import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  PasswordResetRequest,
  PasswordResetConfirm,
  UpdateProfileData,
  ChangePasswordData
} from '../types/auth.types';
import { supabase, supabaseHelpers } from '../../../shared/services/supabase';

class AuthService {
  private baseUrl = import.meta.env.VITE_API_URL || '/api';
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private useSupabase = !!import.meta.env.VITE_SUPABASE_URL;

  // Store tokens
  private setTokens(token: string, refreshToken?: string) {
    localStorage.setItem(this.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Clear tokens
  private clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Use Supabase if configured
      if (this.useSupabase) {
        const { data, error } = await supabaseHelpers.signIn(
          credentials.email,
          credentials.password
        );

        if (error) throw new Error(error.message);
        if (!data.user || !data.session) throw new Error('Login failed');

        const response: AuthResponse = {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            role: data.user.user_metadata?.role || 'user',
            phone: data.user.phone,
            createdAt: new Date(data.user.created_at),
            updatedAt: new Date(data.user.updated_at || data.user.created_at),
          },
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
        };

        this.setTokens(response.token, response.refreshToken);
        return response;
      }

      // Fallback to mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };

      this.setTokens(mockResponse.token, mockResponse.refreshToken);
      return mockResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Use Supabase if configured
      if (this.useSupabase) {
        const { data: authData, error } = await supabaseHelpers.signUp(
          data.email,
          data.password
        );

        if (error) throw new Error(error.message);
        if (!authData.user || !authData.session) throw new Error('Registration failed');

        // Update user metadata with additional info
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: data.name,
            phone: data.phone,
          }
        });

        if (updateError) console.warn('Failed to update user metadata:', updateError);

        const response: AuthResponse = {
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            name: data.name,
            phone: data.phone,
            role: 'user',
            createdAt: new Date(authData.user.created_at),
            updatedAt: new Date(),
          },
          token: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
        };

        this.setTokens(response.token, response.refreshToken);
        return response;
      }

      // Fallback to mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };

      this.setTokens(mockResponse.token, mockResponse.refreshToken);
      return mockResponse;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Call API to invalidate token
      // await fetch(`${this.baseUrl}/auth/logout`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.getToken()}`,
      //   },
      // });
      
      this.clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      this.clearTokens(); // Clear tokens anyway
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');

      // Mock implementation
      return {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Real implementation:
      // const response = await fetch(`${this.baseUrl}/auth/me`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      // if (!response.ok) throw new Error('Failed to get user');
      // return response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  // Request password reset
  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset email sent to:', data.email);
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  // Confirm password reset
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset confirmed');
    } catch (error) {
      console.error('Password reset confirm error:', error);
      throw error;
    }
  }

  // Update profile
  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: '1',
        email: 'user@example.com',
        name: data.name || 'John Doe',
        phone: data.phone,
        avatar: data.avatar,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email verified');
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
