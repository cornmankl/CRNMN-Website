/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  type?: string;
  model?: string;
  tokens?: number;
  processingTime?: number;
}

interface SendMessageOptions {
  userPreferences?: {
    categories: string[];
    priceRange: [number, number];
    tags: string[];
  };
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
  private genAI: GoogleGenerativeAI | null = null;

  /**
   * Initializes the AIService with configuration for Gemini.
   * API keys are securely retrieved from environment variables.
   */
  constructor() {
    this.config = {
      geminiApiKey: import.meta.env.NEXT_PUBLIC_GEMINI_API_KEY,
      defaultModel: 'gemini-pro',
      maxTokens: 2000,
      temperature: 0.7
    };

    this.initializeClients();
  }

  /**
   * Initializes AI clients if the corresponding API keys are available.
   */
  private initializeClients() {
    if (this.config.geminiApiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.config.geminiApiKey);
      } catch (error) {
        console.warn('Failed to initialize Gemini AI:', error);
        this.genAI = null;
      }
    }
  }

  /**
   * Sends a message to the AI service and returns a formatted response
   * @param {string} message - The user's message
   * @param {SendMessageOptions} options - Additional options including user preferences and context
   * @returns {Promise<AIResponse>} - The AI-generated response with metadata
   */
  async sendMessage(message: string, options: SendMessageOptions = {}): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      if (!this.genAI) {
        throw new Error('Gemini AI is not properly initialized. Please check your API key.');
      }

      const model = this.genAI.getGenerativeModel({ model: this.config.defaultModel });
      
      // Create context-aware prompt
      const contextualPrompt = this.buildContextualPrompt(message, options);
      
      const result = await model.generateContent(contextualPrompt);
      const response = await result.response;
      const text = response.text();
      
      const processingTime = Date.now() - startTime;

      return {
        content: text,
        type: 'text',
        model: this.config.defaultModel,
        tokens: this.estimateTokens(text),
        processingTime
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback response
      return {
        content: `Sorry, I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
        type: 'error',
        model: this.config.defaultModel,
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Builds a contextual prompt based on user preferences and context
   */
  private buildContextualPrompt(message: string, options: SendMessageOptions): string {
    let prompt = '';

    // Add context information
    if (options.context === 'cornman_website') {
      prompt += `You are an AI assistant for CRNMN, a premium corn ordering website. You help customers with menu inquiries, order tracking, delivery information, and general questions about corn products. Be friendly, helpful, and knowledgeable about corn-based dishes and our services.\n\n`;
    }

    // Add user preferences context
    if (options.userPreferences) {
      const { categories, priceRange, tags } = options.userPreferences;
      if (categories.length > 0) {
        prompt += `User's preferred categories: ${categories.join(', ')}\n`;
      }
      if (priceRange && priceRange[0] !== 0 || priceRange[1] !== 1000) {
        prompt += `User's price range: $${priceRange[0]} - $${priceRange[1]}\n`;
      }
      if (tags.length > 0) {
        prompt += `User's preferred tags: ${tags.join(', ')}\n`;
      }
      prompt += '\n';
    }

    prompt += `User message: ${message}`;

    return prompt;
  }

  /**
   * Estimates token count for a given text (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Generates a chat response using the configured default AI model.
   * @param {string} prompt - The user's prompt.
   * @param {ChatMessage[]} history - The chat history.
   * @returns {Promise<string>} - The AI-generated response.
   */
  async generateResponse(prompt: string, history: ChatMessage[] = []): Promise<string> {
    const response = await this.sendMessage(prompt, { context: 'cornman_website' });
    return response.content;
  }

  /**
   * Generates an image based on a text prompt (placeholder for future implementation)
   * @param {string} prompt - The image generation prompt
   * @returns {Promise<string>} - The generated image URL
   */
  async generateImage(prompt: string): Promise<string> {
    // This is a placeholder - image generation would require additional services
    console.log('Image generation requested for:', prompt);
    throw new Error('Image generation feature is not yet implemented');
  }

  /**
   * Modifies website content based on AI suggestions (placeholder for future implementation)
   * @param {string} instruction - The modification instruction
   * @returns {Promise<{ success: boolean; changes: string[] }>} - The modification result
   */
  async modifyWebsite(instruction: string): Promise<{ success: boolean; changes: string[] }> {
    // This is a placeholder - website modification would require careful implementation
    console.log('Website modification requested:', instruction);
    throw new Error('Website modification feature is not yet implemented');
  }
}
