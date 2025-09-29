import { supabase } from '../supabase/client';

export interface AIUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'premium';
  aiPermissions: {
    chat: boolean;
    imageGeneration: boolean;
    websiteModification: boolean;
    advancedFeatures: boolean;
  };
  usage: {
    chatMessages: number;
    imagesGenerated: number;
    websiteModifications: number;
    lastUsed: Date;
  };
  preferences: {
    language: 'en' | 'ms' | 'zh';
    responseStyle: 'casual' | 'professional' | 'friendly';
    model: 'gpt-4' | 'claude-3' | 'glm-4';
  };
}

export class AIAuthService {
  private static instance: AIAuthService;
  private currentUser: AIUser | null = null;

  static getInstance(): AIAuthService {
    if (!AIAuthService.instance) {
      AIAuthService.instance = new AIAuthService();
    }
    return AIAuthService.instance;
  }

  async authenticateUser(): Promise<AIUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log('No authenticated user found');
        return null;
      }

      // Get user profile from database (with error handling for missing tables)
      let profile = null;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('ai_user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('Error fetching user profile (table may not exist):', profileError);
        } else {
          profile = profileData;
        }
      } catch (tableError) {
        console.warn('AI user profiles table may not exist:', tableError);
      }

      // Create or update user profile
      const aiUser: AIUser = {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.user_metadata?.name || 'User',
        role: profile?.role || 'user',
        aiPermissions: {
          chat: true,
          imageGeneration: profile?.role === 'premium' || profile?.role === 'admin',
          websiteModification: profile?.role === 'admin',
          advancedFeatures: profile?.role === 'premium' || profile?.role === 'admin'
        },
        usage: {
          chatMessages: profile?.chat_messages || 0,
          imagesGenerated: profile?.images_generated || 0,
          websiteModifications: profile?.website_modifications || 0,
          lastUsed: profile?.last_used ? new Date(profile.last_used) : new Date()
        },
        preferences: {
          language: profile?.language || 'en',
          responseStyle: profile?.response_style || 'friendly',
          model: profile?.preferred_model || 'gpt-4'
        }
      };

      // Save/update profile in database (with error handling)
      try {
        await this.saveUserProfile(aiUser);
      } catch (saveError) {
        console.warn('Failed to save user profile:', saveError);
      }
      
      this.currentUser = aiUser;
      return aiUser;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async saveUserProfile(user: AIUser): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_user_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          chat_messages: user.usage.chatMessages,
          images_generated: user.usage.imagesGenerated,
          website_modifications: user.usage.websiteModifications,
          last_used: user.usage.lastUsed.toISOString(),
          language: user.preferences.language,
          response_style: user.preferences.responseStyle,
          preferred_model: user.preferences.model,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.warn('Error saving user profile (table may not exist):', error);
        // Don't throw error, just log it
      }
    } catch (error) {
      console.warn('Error saving user profile (table may not exist):', error);
      // Don't throw error, just log it
    }
  }

  async checkPermission(permission: keyof AIUser['aiPermissions']): Promise<boolean> {
    if (!this.currentUser) {
      await this.authenticateUser();
    }

    if (!this.currentUser) {
      return false;
    }

    return this.currentUser.aiPermissions[permission];
  }

  async updateUsage(type: 'chat' | 'image' | 'modification'): Promise<void> {
    if (!this.currentUser) return;

    switch (type) {
      case 'chat':
        this.currentUser.usage.chatMessages++;
        break;
      case 'image':
        this.currentUser.usage.imagesGenerated++;
        break;
      case 'modification':
        this.currentUser.usage.websiteModifications++;
        break;
    }

    this.currentUser.usage.lastUsed = new Date();
    await this.saveUserProfile(this.currentUser);
  }

  async upgradeUser(role: 'premium' | 'admin'): Promise<boolean> {
    if (!this.currentUser) return false;

    try {
      const { error } = await supabase
        .from('ai_user_profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', this.currentUser.id);

      if (error) {
        console.error('Error upgrading user:', error);
        return false;
      }

      this.currentUser.role = role;
      this.updatePermissions();
      return true;
    } catch (error) {
      console.error('Error upgrading user:', error);
      return false;
    }
  }

  private updatePermissions(): void {
    if (!this.currentUser) return;

    switch (this.currentUser.role) {
      case 'user':
        this.currentUser.aiPermissions = {
          chat: true,
          imageGeneration: false,
          websiteModification: false,
          advancedFeatures: false
        };
        break;
      case 'premium':
        this.currentUser.aiPermissions = {
          chat: true,
          imageGeneration: true,
          websiteModification: false,
          advancedFeatures: true
        };
        break;
      case 'admin':
        this.currentUser.aiPermissions = {
          chat: true,
          imageGeneration: true,
          websiteModification: true,
          advancedFeatures: true
        };
        break;
    }
  }

  getCurrentUser(): AIUser | null {
    return this.currentUser;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    await supabase.auth.signOut();
  }

  // Rate limiting
  async checkRateLimit(type: 'chat' | 'image' | 'modification'): Promise<{ allowed: boolean; resetTime?: Date }> {
    if (!this.currentUser) {
      return { allowed: false };
    }

    const limits = {
      user: { chat: 50, image: 5, modification: 0 },
      premium: { chat: 200, image: 50, modification: 0 },
      admin: { chat: 1000, image: 200, modification: 100 }
    };

    const userLimits = limits[this.currentUser.role];
    const currentUsage = this.currentUser.usage;

    let currentCount = 0;
    switch (type) {
      case 'chat':
        currentCount = currentUsage.chatMessages;
        break;
      case 'image':
        currentCount = currentUsage.imagesGenerated;
        break;
      case 'modification':
        currentCount = currentUsage.websiteModifications;
        break;
    }

    const limit = userLimits[type];
    const allowed = currentCount < limit;

    if (!allowed) {
      // Reset at midnight
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return { allowed: false, resetTime: tomorrow };
    }

    return { allowed: true };
  }

  // Usage analytics
  async getUsageStats(): Promise<{
    daily: { chat: number; image: number; modification: number };
    weekly: { chat: number; image: number; modification: number };
    monthly: { chat: number; image: number; modification: number };
  }> {
    if (!this.currentUser) {
      return { daily: { chat: 0, image: 0, modification: 0 }, weekly: { chat: 0, image: 0, modification: 0 }, monthly: { chat: 0, image: 0, modification: 0 } };
    }

    try {
      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching usage stats:', error);
        return { daily: { chat: 0, image: 0, modification: 0 }, weekly: { chat: 0, image: 0, modification: 0 }, monthly: { chat: 0, image: 0, modification: 0 } };
      }

      const now = new Date();
      const daily = data?.filter(log => {
        const logDate = new Date(log.created_at);
        return logDate.toDateString() === now.toDateString();
      }) || [];

      const weekly = data?.filter(log => {
        const logDate = new Date(log.created_at);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return logDate >= weekAgo;
      }) || [];

      const monthly = data || [];

      return {
        daily: {
          chat: daily.filter(log => log.type === 'chat').length,
          image: daily.filter(log => log.type === 'image').length,
          modification: daily.filter(log => log.type === 'modification').length
        },
        weekly: {
          chat: weekly.filter(log => log.type === 'chat').length,
          image: weekly.filter(log => log.type === 'image').length,
          modification: weekly.filter(log => log.type === 'modification').length
        },
        monthly: {
          chat: monthly.filter(log => log.type === 'chat').length,
          image: monthly.filter(log => log.type === 'image').length,
          modification: monthly.filter(log => log.type === 'modification').length
        }
      };
    } catch (error) {
      console.error('Error calculating usage stats:', error);
      return { daily: { chat: 0, image: 0, modification: 0 }, weekly: { chat: 0, image: 0, modification: 0 }, monthly: { chat: 0, image: 0, modification: 0 } };
    }
  }

  async logUsage(type: 'chat' | 'image' | 'modification', metadata?: Record<string, any>): Promise<void> {
    if (!this.currentUser) return;

    try {
      const { error } = await supabase
        .from('ai_usage_logs')
        .insert({
          user_id: this.currentUser.id,
          type,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error logging usage:', error);
      }
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  }
}

import React from 'react';

// Hook for using AI Auth
export const useAIAuth = () => {
  const [user, setUser] = React.useState<AIUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const aiAuth = AIAuthService.getInstance();

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const authenticatedUser = await aiAuth.authenticateUser();
        setUser(authenticatedUser);
      } catch (error) {
        console.warn('Failed to initialize AI auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes safely
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        try {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const authenticatedUser = await aiAuth.authenticateUser();
            setUser(authenticatedUser);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        } catch (error) {
          console.warn('Failed to handle auth state change:', error);
        }
      });

      return () => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.warn('Failed to unsubscribe from auth changes:', error);
        }
      };
    } catch (error) {
      console.warn('Failed to set up auth listener:', error);
      return () => {};
    }
  }, [aiAuth]);

  return {
    user,
    loading,
    checkPermission: aiAuth.checkPermission.bind(aiAuth),
    updateUsage: aiAuth.updateUsage.bind(aiAuth),
    upgradeUser: aiAuth.upgradeUser.bind(aiAuth),
    checkRateLimit: aiAuth.checkRateLimit.bind(aiAuth),
    getUsageStats: aiAuth.getUsageStats.bind(aiAuth),
    logUsage: aiAuth.logUsage.bind(aiAuth),
    signOut: aiAuth.signOut.bind(aiAuth)
  };
};