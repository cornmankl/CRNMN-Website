import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Settings, 
  Brain, 
  Globe, 
   
  Zap, 
  Shield,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAIStore } from '../../store';

interface AISettingsProps {
  onSave?: (settings: any) => void;
}

export const AISettings: React.FC<AISettingsProps> = ({ onSave }) => {
  const { userPreferences, updateUserPreferences } = useAIStore();
  
  const [settings, setSettings] = useState({
    // AI Model Settings
    model: 'gemini-pro' as 'gpt-4' | 'claude-3' | 'glm-4' | 'gemini-pro',
    temperature: 0.7,
    maxTokens: 2000,
    
    // Response Settings
    language: 'en' as 'en' | 'ms' | 'zh',
    responseStyle: 'friendly' as 'casual' | 'professional' | 'friendly',
    includeImages: true,
    autoSuggestions: true,
    
    // User Preferences
    categories: userPreferences.categories,
    priceRange: userPreferences.priceRange,
    tags: userPreferences.tags,
    
    // Advanced Settings
    enableVoiceInput: true,
    enableAutoComplete: true,
    enableContextualHelp: true,
    enablePersonalization: true,
    
    // Privacy Settings
    saveChatHistory: true,
    shareAnalytics: false,
    allowDataCollection: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Update user preferences in store
    updateUserPreferences({
      categories: settings.categories,
      priceRange: settings.priceRange,
      tags: settings.tags
    });
    
    // Save other settings to localStorage
    localStorage.setItem('ai-settings', JSON.stringify(settings));
    
    onSave?.(settings);
  };

  const handleReset = () => {
    const defaultSettings = {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2000,
      language: 'en',
      responseStyle: 'friendly',
      includeImages: true,
      autoSuggestions: true,
      categories: [],
      priceRange: [0, 1000] as [number, number],
      tags: [],
      enableVoiceInput: true,
      enableAutoComplete: true,
      enableContextualHelp: true,
      enablePersonalization: true,
      saveChatHistory: true,
      shareAnalytics: false,
      allowDataCollection: false
    };
    
    setSettings(defaultSettings);
  };

  const modelOptions = [
    { value: 'gemini-pro', label: 'Gemini Pro', description: 'Google\'s most advanced AI model' },
    { value: 'gpt-4', label: 'GPT-4', description: 'Most capable, best for complex tasks' },
    { value: 'claude-3', label: 'Claude-3', description: 'Balanced performance and speed' },
    { value: 'glm-4', label: 'GLM-4.5', description: 'Fast and efficient, good for quick responses' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ms', label: 'Bahasa Malaysia', flag: '🇲🇾' },
    { value: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  const styleOptions = [
    { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-[var(--neon-green)]" />
        <h3 className="text-lg font-semibold text-white">AI Settings</h3>
      </div>

      {/* AI Model Settings */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Model</label>
            <Select value={settings.model} onValueChange={(value) => handleSettingChange('model', value)}>
              <SelectTrigger className="bg-[var(--neutral-700)] border-[var(--neutral-600)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-[var(--neutral-400)]">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Creativity Level</label>
            <div className="px-3">
              <Slider
                value={[settings.temperature]}
                onValueChange={(value) => handleSettingChange('temperature', value[0])}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--neutral-400)] mt-1">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Response Length</label>
            <div className="px-3">
              <Slider
                value={[settings.maxTokens]}
                onValueChange={(value) => handleSettingChange('maxTokens', value[0])}
                max={4000}
                min={500}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--neutral-400)] mt-1">
                <span>Short</span>
                <span>Long</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Style */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language & Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Language</label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                <SelectTrigger className="bg-[var(--neutral-700)] border-[var(--neutral-600)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Response Style</label>
              <Select value={settings.responseStyle} onValueChange={(value) => handleSettingChange('responseStyle', value)}>
                <SelectTrigger className="bg-[var(--neutral-700)] border-[var(--neutral-600)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-[var(--neutral-400)]">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Voice Input</div>
                <div className="text-xs text-[var(--neutral-400)]">Enable speech-to-text</div>
              </div>
              <Switch
                checked={settings.enableVoiceInput}
                onCheckedChange={(checked) => handleSettingChange('enableVoiceInput', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Auto Suggestions</div>
                <div className="text-xs text-[var(--neutral-400)]">Show quick prompt suggestions</div>
              </div>
              <Switch
                checked={settings.autoSuggestions}
                onCheckedChange={(checked) => handleSettingChange('autoSuggestions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Image Generation</div>
                <div className="text-xs text-[var(--neutral-400)]">Enable AI image creation</div>
              </div>
              <Switch
                checked={settings.includeImages}
                onCheckedChange={(checked) => handleSettingChange('includeImages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Contextual Help</div>
                <div className="text-xs text-[var(--neutral-400)]">Provide relevant suggestions</div>
              </div>
              <Switch
                checked={settings.enableContextualHelp}
                onCheckedChange={(checked) => handleSettingChange('enableContextualHelp', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Personalization</div>
                <div className="text-xs text-[var(--neutral-400)]">Learn from your preferences</div>
              </div>
              <Switch
                checked={settings.enablePersonalization}
                onCheckedChange={(checked) => handleSettingChange('enablePersonalization', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Save Chat History</div>
                <div className="text-xs text-[var(--neutral-400)]">Store conversations locally</div>
              </div>
              <Switch
                checked={settings.saveChatHistory}
                onCheckedChange={(checked) => handleSettingChange('saveChatHistory', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Share Analytics</div>
                <div className="text-xs text-[var(--neutral-400)]">Help improve AI performance</div>
              </div>
              <Switch
                checked={settings.shareAnalytics}
                onCheckedChange={(checked) => handleSettingChange('shareAnalytics', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Data Collection</div>
                <div className="text-xs text-[var(--neutral-400)]">Allow usage data collection</div>
              </div>
              <Switch
                checked={settings.allowDataCollection}
                onCheckedChange={(checked) => handleSettingChange('allowDataCollection', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} className="btn-primary flex-1">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Current Settings Summary */}
      <Card className="bg-[var(--neutral-800)]">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Current Configuration</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{modelOptions.find(m => m.value === settings.model)?.label}</Badge>
            <Badge variant="outline">{languageOptions.find(l => l.value === settings.language)?.label}</Badge>
            <Badge variant="outline">{styleOptions.find(s => s.value === settings.responseStyle)?.label}</Badge>
            <Badge variant="outline">Temp: {settings.temperature}</Badge>
            <Badge variant="outline">Tokens: {settings.maxTokens}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};