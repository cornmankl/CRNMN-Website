/* eslint-disable @typescript-eslint/no-explicit-any */

// Define interfaces for AI service configurations and chat messages
interface AIServiceConfig {
  geminiApiKey?: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  type?: 'text' | 'image' | 'code' | 'error';
  model?: string;
  tokens?: number;
  processingTime?: number;
}

interface UserPreferences {
  categories?: string[];
  priceRange?: [number, number];
  tags?: string[];
  language?: 'en' | 'ms' | 'zh';
  responseStyle?: 'casual' | 'professional' | 'friendly';
}

interface AIContext {
  userPreferences?: UserPreferences;
  context?: string;
}

/**
 * @class AIService
 * @description A versatile AI service class that provides an interface to Google Gemini.
 * It is designed to be extensible and can manage different AI configurations.
 *
 * @example
 * const aiService = new AIService();
 * const response = await aiService.sendMessage("Hello, world!");
 * console.log(response);
 */
export class AIService {
  private config: AIServiceConfig;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  /**
   * Initializes the AIService with configuration for Gemini.
   * API keys are securely retrieved from environment variables.
   */
  constructor() {
    this.config = {
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
      defaultModel: 'gemini-pro',
      maxTokens: 2000,
      temperature: 0.7
    };
  }

  /**
   * Sends a message to the AI service and returns a response
   * @param {string} message - The user's message
   * @param {AIContext} context - Additional context for the AI
   * @returns {Promise<AIResponse>} - The AI response with metadata
   */
  async sendMessage(message: string, context: AIContext = {}): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      if (!this.config.geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Build the prompt with context
      const systemPrompt = this.buildSystemPrompt(context);
      const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;

      const response = await fetch(
        `${this.baseUrl}/models/${this.config.defaultModel}:generateContent?key=${this.config.geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }],
            generationConfig: {
              temperature: this.config.temperature,
              maxOutputTokens: this.config.maxTokens,
              topP: 0.8,
              topK: 10
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from AI service');
      }

      const content = data.candidates[0].content.parts[0].text;
      const tokens = data.usageMetadata?.totalTokenCount || 0;

      return {
        content: this.formatResponse(content, context),
        type: 'text',
        model: this.config.defaultModel,
        tokens,
        processingTime
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      const processingTime = Date.now() - startTime;
      
      return {
        content: this.handleError(error),
        type: 'error',
        model: this.config.defaultModel,
        processingTime
      };
    }
  }

  /**
   * Builds a system prompt based on context and user preferences
   */
  private buildSystemPrompt(context: AIContext): string {
    const basePrompt = `You are CRNMN AI Assistant, a helpful AI assistant for the CRNMN corn ordering website. You help customers with:

1. Menu inquiries and product recommendations
2. Order tracking and delivery information
3. General questions about corn products and services
4. Providing friendly, helpful customer support

Always be polite, helpful, and informative. If you don't know something specific about CRNMN, say so and offer to help in other ways.`;

    if (context.context === 'cornman_website') {
      return `${basePrompt}

You are specifically helping with the CRNMN corn ordering website. Focus on:
- Corn varieties and products
- Ordering process
- Delivery areas and times
- Pricing and promotions
- Customer support`;
    }

    if (context.userPreferences) {
      const { language, responseStyle } = context.userPreferences;
      
      let languageInstruction = '';
      if (language === 'ms') {
        languageInstruction = ' Respond in Bahasa Malaysia when appropriate.';
      } else if (language === 'zh') {
        languageInstruction = ' Respond in Chinese when appropriate.';
      }

      let styleInstruction = '';
      if (responseStyle === 'casual') {
        styleInstruction = ' Use a casual, relaxed tone.';
      } else if (responseStyle === 'professional') {
        styleInstruction = ' Use a professional, business-like tone.';
      } else {
        styleInstruction = ' Use a friendly, warm tone.';
      }

      return `${basePrompt}${languageInstruction}${styleInstruction}`;
    }

    return basePrompt;
  }

  /**
   * Formats the AI response based on context
   */
  private formatResponse(content: string, context: AIContext): string {
    // Add emojis and formatting for better UX
    let formatted = content;

    // Add relevant emojis
    if (content.toLowerCase().includes('menu') || content.toLowerCase().includes('product')) {
      formatted = `🌽 ${formatted}`;
    } else if (content.toLowerCase().includes('order') || content.toLowerCase().includes('delivery')) {
      formatted = `📦 ${formatted}`;
    } else if (content.toLowerCase().includes('help') || content.toLowerCase().includes('support')) {
      formatted = `🤝 ${formatted}`;
    }

    return formatted;
  }

  /**
   * Handles errors and returns user-friendly messages
   */
  private handleError(error: any): string {
    if (error.message?.includes('API key')) {
      return '🔧 AI service is currently being configured. Please try again later.';
    } else if (error.message?.includes('quota')) {
      return '⏳ AI service is temporarily busy. Please try again in a moment.';
    } else if (error.message?.includes('network')) {
      return '🌐 Connection issue. Please check your internet connection and try again.';
    } else {
      return '😅 Sorry, I encountered an issue. Please try rephrasing your question or try again later.';
    }
  }

  /**
   * Generates an image using AI (placeholder for future implementation)
   */
  async generateImage(prompt: string): Promise<AIResponse> {
    // Placeholder for image generation
    return {
      content: 'Image generation feature coming soon! 🎨',
      type: 'text',
      model: this.config.defaultModel
    };
  }

  /**
   * Updates the AI service configuration
   */
  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Gets the current configuration
   */
  getConfig(): AIServiceConfig {
    return { ...this.config };
  }
}
