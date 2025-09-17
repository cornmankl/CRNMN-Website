

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Settings, 
  Trash2,
  Sparkles,
  Copy,
  Check,
  X,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap,
  MessageSquare,
  Image as ImageIcon,
  Code,
  FileText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useAIStore } from '../../store';
import { AIService } from '../../utils/ai/aiService';
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
  isTyping?: boolean;
  feedback?: 'liked' | 'disliked' | null;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const [quickActions] = useState([
    { id: 'menu', label: 'Menu Inquiry', icon: '🌽', prompt: "What's on the menu today?" },
    { id: 'order', label: 'Order Tracking', icon: '📦', prompt: "How do I track my order?" },
    { id: 'delivery', label: 'Delivery Info', icon: '🚚', prompt: "What are your delivery areas?" },
    { id: 'image', label: 'AI Image', icon: '🎨', prompt: "Generate a corn image" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
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
  }, [messages, typingMessage]);

  // Typing indicator component
  const TypingIndicator: React.FC = () => (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full neon-bg flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-black" />
      </div>
      <Card className="bg-[var(--neutral-800)]">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-[var(--neutral-400)]">AI is thinking...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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

  // Simulate typing effect
  const simulateTyping = useCallback((text: string, callback: (message: Message) => void) => {
    const words = text.split(' ');
    let currentText = '';
    let wordIndex = 0;

    const typeNextWord = () => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        wordIndex++;
        
        const typingMsg: Message = {
          id: 'typing',
          content: currentText,
          role: 'assistant',
          timestamp: new Date(),
          type: 'text',
          isTyping: true
        };
        
        setTypingMessage(typingMsg);
        
        // Random delay between 50-200ms per word
        const delay = Math.random() * 150 + 50;
        setTimeout(typeNextWord, delay);
      } else {
        // Typing complete
        setTypingMessage(null);
        const finalMessage: Message = {
          id: Date.now().toString(),
          content: text,
          role: 'assistant',
          timestamp: new Date(),
          type: 'text'
        };
        callback(finalMessage);
      }
    };

    typeNextWord();
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
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setAILoading(true);

    try {
      // Send to AI service
      const response = await aiService.sendMessage(currentInput, {
        userPreferences,
        context: 'cornman_website',
      });

      // Simulate typing effect
      simulateTyping(response.content, (finalMessage) => {
        const assistantMessage: Message = {
          ...finalMessage,
          metadata: {
            model: response.model,
            tokens: response.tokens,
            processingTime: response.processingTime
          }
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Save to store
        addChatMessage(currentInput, response.content, 'user');
        addChatMessage(currentInput, response.content, 'bot');

        // Play notification sound if not muted
        if (!isMuted && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      });

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

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const handleFeedback = (messageId: string, feedback: 'liked' | 'disliked') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        type: msg.type
      }))
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crnmn-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareChat = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CRNMN AI Chat',
          text: `Check out my conversation with CRNMN AI Assistant!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      const chatText = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
      ).join('\n\n');
      
      try {
        await navigator.clipboard.writeText(chatText);
        // Show success message
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
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
      <div className={`fixed right-4 top-4 bottom-4 w-full max-w-4xl bg-[var(--neutral-900)] border border-[var(--neutral-800)] rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isMinimized ? 'h-16' : isFullscreen ? 'inset-4' : ''
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--neutral-800)] bg-gradient-to-r from-[var(--neutral-900)] to-[var(--neutral-800)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full neon-bg flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">CRNMN AI Assistant</h2>
              <p className="text-sm text-[var(--neutral-400)] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Powered by Gemini Pro
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-[var(--neutral-400)] hover:text-white"
              title={isMuted ? "Unmute notifications" : "Mute notifications"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportChat}
              className="text-[var(--neutral-400)] hover:text-white"
              title="Export chat"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={shareChat}
              className="text-[var(--neutral-400)] hover:text-white"
              title="Share chat"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-[var(--neutral-400)] hover:text-white"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-[var(--neutral-400)] hover:text-white"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[var(--neutral-400)] hover:text-white"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[var(--neutral-400)] hover:text-white"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && !isMinimized && (
          <div className="border-b border-[var(--neutral-800)] p-4 bg-[var(--neutral-800)]/50">
            <AISettings />
          </div>
        )}

        {/* Messages */}
        {!isMinimized && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full neon-bg flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Sparkles className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Welcome to CRNMN AI Assistant! 🌽</h3>
                  <p className="text-[var(--neutral-400)] mb-8 max-w-md mx-auto">
                    I'm your intelligent corn ordering assistant. I can help you with menu inquiries, 
                    order tracking, delivery information, and much more!
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        className="text-left justify-start h-auto p-4 hover:bg-[var(--neon-green)]/10 hover:border-[var(--neon-green)]/50 transition-all duration-200"
                        onClick={() => handleQuickAction(action.prompt)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{action.icon}</span>
                          <div>
                            <div className="font-semibold text-white">{action.label}</div>
                            <div className="text-xs text-[var(--neutral-400)]">Click to start</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
                    <div className="p-3 rounded-lg bg-[var(--neutral-800)]/50">
                      <MessageSquare className="w-6 h-6 text-[var(--neon-green)] mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">Smart Chat</div>
                      <div className="text-xs text-[var(--neutral-400)]">Natural conversations</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--neutral-800)]/50">
                      <ImageIcon className="w-6 h-6 text-[var(--neon-green)] mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">AI Images</div>
                      <div className="text-xs text-[var(--neutral-400)]">Generate corn visuals</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--neutral-800)]/50">
                      <Zap className="w-6 h-6 text-[var(--neon-green)] mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">Fast Response</div>
                      <div className="text-xs text-[var(--neutral-400)]">Instant answers</div>
                    </div>
                  </div>
                </div>
              ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full neon-bg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <Card className={`transition-all duration-200 hover:shadow-lg ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-green)]/80 text-black' 
                        : message.type === 'error'
                        ? 'bg-red-900/20 border-red-800'
                        : 'bg-[var(--neutral-800)] hover:bg-[var(--neutral-750)]'
                    }`}>
                      <CardContent className="p-4">
                        {message.type === 'image' ? (
                          <div className="space-y-3">
                            <img 
                              src={message.content} 
                              alt="AI Generated" 
                              className="rounded-lg max-w-full h-auto shadow-lg"
                            />
                            <div className="text-xs text-[var(--neutral-400)]">
                              Generated by AI
                            </div>
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
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--neutral-700)]">
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
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {message.role === 'assistant' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(message.id, 'liked')}
                                  className={`h-6 w-6 p-0 ${
                                    message.feedback === 'liked' ? 'text-green-500' : 'text-[var(--neutral-400)] hover:text-green-500'
                                  }`}
                                  title="Like this response"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(message.id, 'disliked')}
                                  className={`h-6 w-6 p-0 ${
                                    message.feedback === 'disliked' ? 'text-red-500' : 'text-[var(--neutral-400)] hover:text-red-500'
                                  }`}
                                  title="Dislike this response"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content, message.id)}
                              className="h-6 w-6 p-0 text-[var(--neutral-400)] hover:text-white"
                              title="Copy message"
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--neutral-700)] to-[var(--neutral-600)] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Typing Indicator */}
            {typingMessage && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full neon-bg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <Card className="bg-[var(--neutral-800)]">
                  <CardContent className="p-4">
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {typingMessage.content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {isLoading && !typingMessage && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        )}

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