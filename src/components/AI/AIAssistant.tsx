import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Image, 
  Settings, 
  Trash2,
  Sparkles,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useAIStore } from '../../store';
import { AIService } from '../../utils/ai/aiService';
import { ImageGenerator } from './ImageGenerator';
import { AISettings } from './AISettings';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'image' | 'code' | 'error';
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const { 
    chatHistory, 
    addChatMessage, 
    setAILoading, 
    userPreferences 
  } = useAIStore();

  // Initialize AI Service
  const aiService = new AIService();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    if (chatHistory.length > 0) {
      const formattedMessages = chatHistory.map(msg => ({
        id: msg.id,
        content: msg.response,
        role: msg.type as 'user' | 'assistant',
        timestamp: msg.timestamp,
        type: 'text' as const
      }));
      setMessages(formattedMessages);
    }
  }, [chatHistory]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setAILoading(true);

    try {
      // Send to AI service
      const response = await aiService.sendMessage(inputMessage, {
        userPreferences,
        context: 'cornman_website',
        includeImages: showImageGenerator
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        type: response.type || 'text',
        metadata: {
          model: response.model,
          tokens: response.tokens,
          processingTime: response.processingTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save to store
      addChatMessage(inputMessage, response.content, 'user');
      addChatMessage(inputMessage, response.content, 'bot');

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAILoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-4 top-4 bottom-4 w-full max-w-4xl bg-[var(--neutral-900)] border border-[var(--neutral-800)] rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--neutral-800)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full neon-bg flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Assistant</h2>
              <p className="text-sm text-[var(--neutral-400)]">Powered by Gemini Pro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageGenerator(!showImageGenerator)}
              className="text-[var(--neutral-400)] hover:text-white"
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-[var(--neutral-400)] hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-[var(--neutral-400)] hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[var(--neutral-400)] hover:text-white"
            >
              ×
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-b border-[var(--neutral-800)] p-4">
            <AISettings />
          </div>
        )}

        {/* Image Generator Panel */}
        {showImageGenerator && (
          <div className="border-b border-[var(--neutral-800)] p-4">
            <ImageGenerator />
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full neon-bg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Welcome to AI Assistant</h3>
                <p className="text-[var(--neutral-400)] mb-6">
                  I'm here to help you with your CRNMN corn ordering experience!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                  <Button
                    variant="outline"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => setInputMessage("What's on the menu today?")}
                  >
                    <div>
                      <div className="font-semibold">Menu Inquiry</div>
                      <div className="text-xs text-[var(--neutral-400)]">Ask about our corn varieties</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => setInputMessage("How do I track my order?")}
                  >
                    <div>
                      <div className="font-semibold">Order Tracking</div>
                      <div className="text-xs text-[var(--neutral-400)]">Get help with your order</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => setInputMessage("What are your delivery areas?")}
                  >
                    <div>
                      <div className="font-semibold">Delivery Info</div>
                      <div className="text-xs text-[var(--neutral-400)]">Check delivery coverage</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => setInputMessage("Generate a corn image")}
                  >
                    <div>
                      <div className="font-semibold">AI Image</div>
                      <div className="text-xs text-[var(--neutral-400)]">Create custom corn images</div>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full neon-bg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <Card className={`${
                      message.role === 'user' 
                        ? 'bg-[var(--neon-green)] text-black' 
                        : message.type === 'error'
                        ? 'bg-red-900/20 border-red-800'
                        : 'bg-[var(--neutral-800)]'
                    }`}>
                      <CardContent className="p-3">
                        {message.type === 'image' ? (
                          <div className="space-y-2">
                            <img 
                              src={message.content} 
                              alt="AI Generated" 
                              className="rounded-lg max-w-full h-auto"
                            />
                          </div>
                        ) : (
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeHighlight]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--neutral-700)]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--neutral-400)]">
                              {formatTimestamp(message.timestamp)}
                            </span>
                            {message.metadata?.model && (
                              <Badge variant="secondary" className="text-xs">
                                {message.metadata.model}
                              </Badge>
                            )}
                            {message.metadata?.processingTime && (
                              <Badge variant="outline" className="text-xs">
                                {message.metadata.processingTime}ms
                              </Badge>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content, message.id)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[var(--neutral-700)] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full neon-bg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <Card className="bg-[var(--neutral-800)]">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-[var(--neutral-400)]">AI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-[var(--neutral-800)]">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CRNMN corn ordering..."
                className="pr-20"
                disabled={isLoading}
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleRecording}
                  className={`h-6 w-6 p-0 ${
                    isRecording ? 'text-red-500' : 'text-[var(--neutral-400)]'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-[var(--neutral-500)] mt-2">
            Press Enter to send, Shift+Enter for new line. Use voice input with the mic button.
          </p>
        </div>
      </div>
    </div>
  );
};