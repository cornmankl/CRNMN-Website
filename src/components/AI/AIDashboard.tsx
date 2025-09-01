import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Bot, 
  Settings, 
  Image, 
  Wand2, 
  TestTube,
  BarChart3,
  
  Zap
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { AISettings } from './AISettings';
import { ImageGenerator } from './ImageGenerator';
import { WebsiteModifier } from './WebsiteModifier';
import { AITestPanel } from './AITestPanel';
import { GeminiFeatures } from './GeminiFeatures';
import { AIAuthGuard, AIUsageStats } from './AIAuthGuard';
import { useAIAuth } from '../../utils/ai/aiAuth';

export const AIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { user: aiUser, loading } = useAIAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Bot className="w-8 h-8 animate-pulse text-[var(--neon-green)] mx-auto mb-4" />
          <p className="text-[var(--neutral-400)]">Loading AI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Dashboard</h1>
          <p className="text-[var(--neutral-400)]">
            Manage and interact with AI features
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {aiUser && (
            <Badge variant="secondary" className="text-sm">
              {aiUser.role === 'user' ? 'Free Plan' : aiUser.role === 'premium' ? 'Premium Plan' : 'Admin'}
            </Badge>
          )}
          
          <Button
            onClick={() => setIsAssistantOpen(true)}
            className="btn-primary"
          >
            <Bot className="w-4 h-4 mr-2" />
            Open AI Assistant
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {aiUser && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[var(--neutral-800)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{aiUser.usage.chatMessages}</div>
                  <div className="text-xs text-[var(--neutral-400)]">Chat Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--neutral-800)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Image className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{aiUser.usage.imagesGenerated}</div>
                  <div className="text-xs text-[var(--neutral-400)]">Images Generated</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--neutral-800)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{aiUser.usage.websiteModifications}</div>
                  <div className="text-xs text-[var(--neutral-400)]">Website Changes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--neutral-800)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {aiUser.role === 'user' ? 'Free' : aiUser.role === 'premium' ? 'Pro' : 'Admin'}
                  </div>
                  <div className="text-xs text-[var(--neutral-400)]">Plan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-[var(--neutral-800)]">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="gemini" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Gemini
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="modifier" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Modifier
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="bg-[var(--neutral-800)]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full neon-bg flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Start a Conversation</h3>
                <p className="text-[var(--neutral-400)] mb-6">
                  Click the button below to open the AI Assistant and start chatting
                </p>
                <Button
                  onClick={() => setIsAssistantOpen(true)}
                  className="btn-primary"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Open AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>

          {aiUser && <AIUsageStats user={aiUser} />}
        </TabsContent>

        <TabsContent value="gemini" className="space-y-4">
          <AIAuthGuard requiredPermission="advancedFeatures">
            <GeminiFeatures />
          </AIAuthGuard>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <AIAuthGuard requiredPermission="imageGeneration">
            <ImageGenerator />
          </AIAuthGuard>
        </TabsContent>

        <TabsContent value="modifier" className="space-y-4">
          <AIAuthGuard requiredPermission="websiteModification">
            <WebsiteModifier />
          </AIAuthGuard>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AISettings />
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <AITestPanel />
        </TabsContent>
      </Tabs>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        user={aiUser}
      />
    </div>
  );
};