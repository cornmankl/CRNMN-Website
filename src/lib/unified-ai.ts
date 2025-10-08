/**
 * Unified AI Service
 * Supports multiple AI providers: Gemini, GLM-4.6, Claude
 */

import { sendGLMChat, GLMMessage, GLMChatOptions } from './glm-ai';

export type AIProvider = 'gemini' | 'glm' | 'claude';

export interface UnifiedMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface UnifiedAIOptions {
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * Send a message to the AI with automatic provider selection
 */
export async function sendAIMessage(
  messages: UnifiedMessage[],
  options: UnifiedAIOptions = {}
): Promise<string> {
  const { provider = 'glm', temperature = 0.7, maxTokens = 4096, stream = false } = options;

  switch (provider) {
    case 'glm':
      return sendGLMChat(
        messages as GLMMessage[],
        {
          temperature,
          max_tokens: maxTokens,
          stream,
        } as GLMChatOptions
      );

    case 'gemini':
      return sendGeminiMessage(messages, { temperature, maxTokens });

    case 'claude':
      throw new Error('Claude provider not yet implemented');

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

/**
 * Gemini AI integration (placeholder)
 */
async function sendGeminiMessage(
  messages: UnifiedMessage[],
  options: { temperature?: number; maxTokens?: number }
): Promise<string> {
  // This would integrate with existing Gemini code
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  // Convert messages to Gemini format
  const lastMessage = messages[messages.length - 1];
  const result = await model.generateContent(lastMessage.content);
  const response = await result.response;
  
  return response.text();
}

/**
 * Get menu recommendations from AI
 */
export async function getAIMenuRecommendations(
  userPreferences: string,
  menuItems?: any[],
  provider: AIProvider = 'glm'
): Promise<string> {
  const menuContext = menuItems
    ? `Available menu items:\n${menuItems.map((item, i) => 
        `${i + 1}. ${item.name} - RM${item.price} (${item.category})`
      ).join('\n')}`
    : '';

  const messages: UnifiedMessage[] = [
    {
      role: 'system',
      content: `You are a helpful AI assistant for CRNMN Restaurant, specializing in Malaysian corn-based dishes. 
      Recommend menu items based on customer preferences, dietary restrictions, and taste preferences.
      Be friendly, informative, and culturally sensitive.
      ${menuContext}`,
    },
    {
      role: 'user',
      content: userPreferences,
    },
  ];

  return sendAIMessage(messages, {
    provider,
    temperature: 0.8,
    maxTokens: 1024,
  });
}

/**
 * Answer customer questions
 */
export async function answerCustomerQuestion(
  question: string,
  context?: string,
  provider: AIProvider = 'glm'
): Promise<string> {
  const messages: UnifiedMessage[] = [
    {
      role: 'system',
      content: `You are CRNMN Restaurant's AI assistant. Help customers with:
      - Menu inquiries and recommendations
      - Order information and tracking
      - Restaurant location and hours (Kuala Lumpur, Malaysia)
      - Food preparation and ingredients
      - Dietary restrictions and allergens
      - Pricing and promotions
      
      Opening hours: 10:00 AM - 10:00 PM daily
      Location: Kuala Lumpur, Malaysia
      Delivery available via GrabFood and Foodpanda
      
      Be concise, helpful, and friendly. If unsure, suggest contacting staff.
      ${context ? `Additional context: ${context}` : ''}`,
    },
    {
      role: 'user',
      content: question,
    },
  ];

  return sendAIMessage(messages, {
    provider,
    temperature: 0.6,
    maxTokens: 512,
  });
}

/**
 * Generate catchy product description
 */
export async function generateProductDescription(
  productName: string,
  ingredients: string[],
  category: string,
  provider: AIProvider = 'glm'
): Promise<string> {
  const messages: UnifiedMessage[] = [
    {
      role: 'system',
      content: 'You are a professional food writer for a premium Malaysian restaurant specializing in corn dishes.',
    },
    {
      role: 'user',
      content: `Create an appealing, mouth-watering description for:
      
      Name: ${productName}
      Category: ${category}
      Ingredients: ${ingredients.join(', ')}
      
      Write 2-3 engaging sentences highlighting taste, texture, and what makes it special.`,
    },
  ];

  return sendAIMessage(messages, {
    provider,
    temperature: 0.9,
    maxTokens: 256,
  });
}

/**
 * Multi-turn AI conversation
 */
export class AIConversation {
  private messages: UnifiedMessage[] = [];
  private provider: AIProvider;
  private systemPrompt: string;

  constructor(systemPrompt?: string, provider: AIProvider = 'glm') {
    this.provider = provider;
    this.systemPrompt = systemPrompt || 
      'You are a helpful AI assistant for CRNMN Restaurant. Provide accurate, friendly responses about our corn-based menu.';
    
    this.messages.push({
      role: 'system',
      content: this.systemPrompt,
    });
  }

  async send(message: string): Promise<string> {
    this.messages.push({
      role: 'user',
      content: message,
    });

    const response = await sendAIMessage(this.messages, {
      provider: this.provider,
    });

    this.messages.push({
      role: 'assistant',
      content: response,
    });

    return response;
  }

  getHistory(): UnifiedMessage[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [{
      role: 'system',
      content: this.systemPrompt,
    }];
  }

  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  getProvider(): AIProvider {
    return this.provider;
  }
}

export default {
  send: sendAIMessage,
  getRecommendations: getAIMenuRecommendations,
  answer: answerCustomerQuestion,
  generateDescription: generateProductDescription,
  Conversation: AIConversation,
};
