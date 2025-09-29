-- AI Features Database Schema
-- This file contains the SQL schema for AI-related features

-- AI User Profiles Table
CREATE TABLE IF NOT EXISTS ai_user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'premium', 'admin')),
  chat_messages INTEGER DEFAULT 0,
  images_generated INTEGER DEFAULT 0,
  website_modifications INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ms', 'zh')),
  response_style TEXT DEFAULT 'friendly' CHECK (response_style IN ('casual', 'professional', 'friendly')),
  preferred_model TEXT DEFAULT 'gpt-4' CHECK (preferred_model IN ('gpt-4', 'claude-3', 'glm-4')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- AI Usage Logs Table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('chat', 'image', 'modification')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat History Table
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('user', 'bot')),
  model TEXT,
  tokens INTEGER,
  processing_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Generated Images Table
CREATE TABLE IF NOT EXISTS ai_generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style TEXT DEFAULT 'realistic' CHECK (style IN ('realistic', 'artistic', 'menu')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Modifications Table
CREATE TABLE IF NOT EXISTS website_modifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('content', 'styling', 'layout', 'component', 'feature')),
  target TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('add', 'remove', 'modify', 'replace')),
  data JSONB NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'failed', 'reverted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Settings Table
CREATE TABLE IF NOT EXISTS ai_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE ai_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_modifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

-- AI User Profiles Policies
CREATE POLICY "Users can view own AI profile" ON ai_user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own AI profile" ON ai_user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI profile" ON ai_user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Usage Logs Policies
CREATE POLICY "Users can view own usage logs" ON ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs" ON ai_usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Chat History Policies
CREATE POLICY "Users can view own chat history" ON ai_chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history" ON ai_chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history" ON ai_chat_history
  FOR DELETE USING (auth.uid() = user_id);

-- AI Generated Images Policies
CREATE POLICY "Users can view own generated images" ON ai_generated_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated images" ON ai_generated_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated images" ON ai_generated_images
  FOR DELETE USING (auth.uid() = user_id);

-- Website Modifications Policies
CREATE POLICY "Users can view own modifications" ON website_modifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own modifications" ON website_modifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own modifications" ON website_modifications
  FOR UPDATE USING (auth.uid() = user_id);

-- AI Settings Policies
CREATE POLICY "Users can view own AI settings" ON ai_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own AI settings" ON ai_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI settings" ON ai_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_user_profiles_user_id ON ai_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id ON ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_session_id ON ai_chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_images_user_id ON ai_generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_website_modifications_user_id ON website_modifications(user_id);
CREATE INDEX IF NOT EXISTS idx_website_modifications_status ON website_modifications(status);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_ai_user_profiles_updated_at BEFORE UPDATE ON ai_user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_modifications_updated_at BEFORE UPDATE ON website_modifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON ai_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user AI usage stats
CREATE OR REPLACE FUNCTION get_user_ai_stats(user_uuid UUID)
RETURNS TABLE (
  total_chat_messages BIGINT,
  total_images_generated BIGINT,
  total_modifications BIGINT,
  daily_chat_messages BIGINT,
  weekly_chat_messages BIGINT,
  monthly_chat_messages BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM ai_usage_logs WHERE user_id = user_uuid AND type = 'chat') as total_chat_messages,
    (SELECT COUNT(*) FROM ai_usage_logs WHERE user_id = user_uuid AND type = 'image') as total_images_generated,
    (SELECT COUNT(*) FROM ai_usage_logs WHERE user_id = user_uuid AND type = 'modification') as total_modifications,
    (SELECT COUNT(*) FROM ai_usage_logs WHERE user_id = user_uuid AND type = 'chat' AND created_at >= CURRENT_DATE) as daily_chat_messages,
    (SELECT COUNT(*) FROM ai_usage_logs WHERE user_id = user_uuid AND type = 'chat' AND created_at >= CURRENT_DATE - INTERVAL '7 days') as weekly_chat_messages,
    (SELECT COUNT(*) FROM ai_usage_logs WHERE user_id = user_uuid AND type = 'chat' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_chat_messages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user rate limits
CREATE OR REPLACE FUNCTION check_user_rate_limit(user_uuid UUID, usage_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  daily_count BIGINT;
  limit_count INTEGER;
BEGIN
  -- Get user role
  SELECT role INTO user_role FROM ai_user_profiles WHERE user_id = user_uuid;
  
  -- Set limits based on role
  CASE user_role
    WHEN 'user' THEN
      CASE usage_type
        WHEN 'chat' THEN limit_count := 50;
        WHEN 'image' THEN limit_count := 5;
        WHEN 'modification' THEN limit_count := 0;
        ELSE limit_count := 0;
      END CASE;
    WHEN 'premium' THEN
      CASE usage_type
        WHEN 'chat' THEN limit_count := 200;
        WHEN 'image' THEN limit_count := 50;
        WHEN 'modification' THEN limit_count := 0;
        ELSE limit_count := 0;
      END CASE;
    WHEN 'admin' THEN
      CASE usage_type
        WHEN 'chat' THEN limit_count := 1000;
        WHEN 'image' THEN limit_count := 200;
        WHEN 'modification' THEN limit_count := 100;
        ELSE limit_count := 0;
      END CASE;
    ELSE
      limit_count := 0;
  END CASE;
  
  -- Get today's usage count
  SELECT COUNT(*) INTO daily_count 
  FROM ai_usage_logs 
  WHERE user_id = user_uuid 
    AND type = usage_type 
    AND created_at >= CURRENT_DATE;
  
  -- Return true if under limit
  RETURN daily_count < limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;