import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Image, 
  Sparkles,
  Lightbulb,
  ChefHat,
  Star,
  Clock,
  Users,
  TrendingUp,
  Gift,
  Heart
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  imageUrl?: string;
}

interface EnhancedAIAssistantProps {
  onClose?: () => void;
  onAddToCart?: (item: any) => void;
}

export function EnhancedAIAssistant({ onClose, onAddToCart }: EnhancedAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI corn expert! 🌽 I can help you find the perfect dish, suggest combinations, answer questions about our menu, and even recommend based on your mood or dietary preferences. What can I help you with today?",
      timestamp: new Date(),
      suggestions: [
        "What's popular today?",
        "I'm feeling spicy!",
        "Show me vegetarian options",
        "What goes well with corn soup?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('popular') || lowerInput.includes('best')) {
      return {
        content: "Our most popular dishes today are:\n\n🔥 **Spicy Corn Fritters** - Crispy and perfectly spiced (RM 12.00)\n⭐ **Sweet Corn Delight** - Our signature dish with butter and herbs (RM 8.50)\n👑 **Grilled Corn Special** - Premium grilled corn with garlic mayo (RM 15.50)\n\nWould you like me to add any of these to your cart?",
        suggestions: ["Add Spicy Corn Fritters", "Tell me about Sweet Corn Delight", "What's in the Grilled Corn Special?"]
      };
    }

    if (lowerInput.includes('spicy') || lowerInput.includes('hot')) {
      return {
        content: "Perfect! Here are our spiciest options:\n\n🌶️ **Spicy Corn Fritters** - Jalapeño and spices (RM 12.00)\n🔥 **Hot Corn Salsa** - Fresh corn with habanero peppers (RM 9.00)\n⚡ **Spicy Corn Chowder** - Creamy soup with a kick (RM 11.50)\n\nAll are marked with our spice level indicators!",
        suggestions: ["Add Spicy Corn Fritters", "What's the spice level?", "Show me mild options too"]
      };
    }

    if (lowerInput.includes('vegetarian') || lowerInput.includes('veggie')) {
      return {
        content: "Great choice! All our corn dishes are vegetarian-friendly! 🌱\n\n🥗 **Corn Salad Supreme** - Fresh and healthy (RM 11.00)\n🌽 **Sweet Corn Delight** - Classic vegetarian option (RM 8.50)\n🍲 **Corn Soup Bowl** - Creamy and comforting (RM 9.50)\n\nWe also have vegan options available!",
        suggestions: ["Show me vegan options", "Add Corn Salad Supreme", "What about protein options?"]
      };
    }

    if (lowerInput.includes('soup') || lowerInput.includes('warm')) {
      return {
        content: "Perfect for a cozy meal! Our soup options:\n\n🍲 **Corn Soup Bowl** - Creamy with fresh herbs (RM 9.50)\n🌶️ **Spicy Corn Chowder** - Warm and comforting (RM 11.50)\n🥣 **Corn & Vegetable Soup** - Light and healthy (RM 10.00)\n\nAll served hot and ready in 5-8 minutes!",
        suggestions: ["Add Corn Soup Bowl", "What sides go well?", "Tell me about the chowder"]
      };
    }

    if (lowerInput.includes('combination') || lowerInput.includes('goes well')) {
      return {
        content: "Excellent question! Here are some perfect combinations:\n\n🍽️ **Classic Combo**: Sweet Corn Delight + Corn Soup Bowl\n🌶️ **Spicy Combo**: Spicy Corn Fritters + Hot Corn Salsa\n👑 **Premium Combo**: Grilled Corn Special + Corn Salad Supreme\n\nI can also create custom combinations based on your preferences!",
        suggestions: ["Create a custom combo", "What about dessert?", "Show me the Classic Combo"]
      };
    }

    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('expensive')) {
      return {
        content: "Our pricing is very reasonable! 💰\n\n💚 **Budget-friendly**: RM 7.50 - RM 10.00\n⭐ **Mid-range**: RM 10.00 - RM 13.00\n👑 **Premium**: RM 13.00 - RM 16.00\n\nWe also have daily specials and combo deals to save you more!",
        suggestions: ["Show me daily specials", "What combo deals are available?", "Tell me about loyalty rewards"]
      };
    }

    if (lowerInput.includes('time') || lowerInput.includes('wait') || lowerInput.includes('ready')) {
      return {
        content: "We're super fast! ⚡\n\n⏱️ **Preparation times**:\n• Salads & Cold items: 2-3 minutes\n• Hot dishes: 5-8 minutes\n• Grilled items: 8-12 minutes\n• Custom orders: 10-15 minutes\n\nWe'll notify you when your order is ready!",
        suggestions: ["What's the fastest option?", "Can I track my order?", "Tell me about delivery times"]
      };
    }

    // Default response
    return {
      content: "That's interesting! I'd love to help you with that. Could you tell me more about what you're looking for? I can help with:\n\n🍽️ Menu recommendations\n🌶️ Spice level preferences\n🥗 Dietary requirements\n💰 Budget-friendly options\n⏱️ Quick preparation times\n🎁 Special combinations",
      suggestions: ["Show me the full menu", "I'm new here", "What's your specialty?"]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  return (
    <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)] h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Corn Expert
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-[var(--neon-green)] text-black">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.type === 'user'
                    ? "bg-[var(--neon-green)] text-black"
                    : "bg-[var(--neutral-800)] text-white"
                )}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "text-xs mr-2 mb-1",
                          message.type === 'user'
                            ? "border-black text-black hover:bg-black/10"
                            : "border-[var(--neutral-600)] text-[var(--neutral-300)] hover:bg-[var(--neutral-700)]"
                        )}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--neutral-800)] rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[var(--neutral-400)] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[var(--neutral-400)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-[var(--neutral-400)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-[var(--neutral-400)] text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about our menu, get recommendations, or ask anything!"
              className="pr-20 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceInput}
                className={cn(
                  "p-1",
                  isListening ? "text-red-500" : "text-[var(--neutral-400)]"
                )}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("What's popular today?")}
            className="border-[var(--neutral-600)] text-[var(--neutral-300)]"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Popular
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("I'm feeling spicy!")}
            className="border-[var(--neutral-600)] text-[var(--neutral-300)]"
          >
            <ChefHat className="w-3 h-3 mr-1" />
            Spicy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("Show me vegetarian options")}
            className="border-[var(--neutral-600)] text-[var(--neutral-300)]"
          >
            <Heart className="w-3 h-3 mr-1" />
            Vegetarian
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick("What combo deals are available?")}
            className="border-[var(--neutral-600)] text-[var(--neutral-300)]"
          >
            <Gift className="w-3 h-3 mr-1" />
            Deals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
