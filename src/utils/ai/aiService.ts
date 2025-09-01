import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Service Configuration
interface AIConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  glmApiKey?: string;
  geminiApiKey?: string;
  defaultModel: 'gpt-4' | 'claude-3' | 'glm-4' | 'gemini-pro';
  maxTokens: number;
  temperature: number;
}

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  content: string;
  type: 'text' | 'image' | 'code' | 'error';
  model: string;
  tokens?: number;
  processingTime?: number;
  metadata?: any;
}

interface UserPreferences {
  categories: string[];
  priceRange: [number, number];
  tags: string[];
  language?: 'en' | 'ms' | 'zh';
  responseStyle?: 'casual' | 'professional' | 'friendly';
}

interface AIContext {
  userPreferences?: UserPreferences;
  context?: string;
  includeImages?: boolean;
  conversationHistory?: AIMessage[];
}

export class AIService {
  private config: AIConfig;
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private gemini?: GoogleGenerativeAI;

  constructor() {
    this.config = {
      openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      anthropicApiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
      glmApiKey: process.env.NEXT_PUBLIC_GLM_API_KEY,
      geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      defaultModel: 'gemini-pro',
      maxTokens: 2000,
      temperature: 0.7
    };

    this.initializeClients();
  }

  private initializeClients() {
    if (this.config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.config.openaiApiKey,
        dangerouslyAllowBrowser: true
      });
    }

    if (this.config.anthropicApiKey) {
      this.anthropic = new Anthropic({
        apiKey: this.config.anthropicApiKey
      });
    }

    if (this.config.geminiApiKey) {
      this.gemini = new GoogleGenerativeAI(this.config.geminiApiKey);
    }
  }

  async sendMessage(message: string, context: AIContext = {}): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Determine which AI service to use
      const model = this.getBestAvailableModel();
      
      switch (model) {
        case 'gemini-pro':
          return await this.sendToGemini(message, context, startTime);
        case 'gpt-4':
          return await this.sendToOpenAI(message, context, startTime);
        case 'claude-3':
          return await this.sendToAnthropic(message, context, startTime);
        case 'glm-4':
          return await this.sendToGLM(message, context, startTime);
        default:
          return await this.sendToGemini(message, context, startTime);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: this.getFallbackResponse(message),
        type: 'error',
        model: 'fallback',
        processingTime: Date.now() - startTime
      };
    }
  }

  private getBestAvailableModel(): 'gpt-4' | 'claude-3' | 'glm-4' | 'gemini-pro' {
    if (this.gemini) return 'gemini-pro';
    if (this.openai) return 'gpt-4';
    if (this.anthropic) return 'claude-3';
    return 'glm-4'; // Fallback to GLM
  }

  private async sendToOpenAI(message: string, context: AIContext, startTime: number): Promise<AIResponse> {
    if (!this.openai) throw new Error('OpenAI client not initialized');

    const systemPrompt = this.buildSystemPrompt(context);
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(context.conversationHistory || []),
      { role: 'user', content: message }
    ];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      stream: false
    });

    const content = response.choices[0]?.message?.content || 'No response generated';
    
    return {
      content,
      type: this.determineResponseType(content),
      model: 'gpt-4',
      tokens: response.usage?.total_tokens,
      processingTime: Date.now() - startTime
    };
  }

  private async sendToAnthropic(message: string, context: AIContext, startTime: number): Promise<AIResponse> {
    if (!this.anthropic) throw new Error('Anthropic client not initialized');

    const systemPrompt = this.buildSystemPrompt(context);
    
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      system: systemPrompt,
      messages: [
        ...(context.conversationHistory || []),
        { role: 'user', content: message }
      ]
    });

    const content = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'No response generated';
    
    return {
      content,
      type: this.determineResponseType(content),
      model: 'claude-3',
      tokens: response.usage?.input_tokens + response.usage?.output_tokens,
      processingTime: Date.now() - startTime
    };
  }

  private async sendToGemini(message: string, context: AIContext, startTime: number): Promise<AIResponse> {
    if (!this.gemini) throw new Error('Gemini client not initialized');

    const systemPrompt = this.buildSystemPrompt(context);
    const model = this.gemini.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        maxOutputTokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }
    });

    // Combine system prompt and user message
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();
    
    return {
      content,
      type: this.determineResponseType(content),
      model: 'gemini-pro',
      tokens: Math.floor(content.length / 4), // Rough token estimation
      processingTime: Date.now() - startTime
    };
  }

  private async sendToGLM(message: string, context: AIContext, startTime: number): Promise<AIResponse> {
    // GLM-4.5 API implementation
    // This is a mock implementation - replace with actual GLM API calls
    const systemPrompt = this.buildSystemPrompt(context);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const content = this.generateGLMResponse(message, context);
    
    return {
      content,
      type: this.determineResponseType(content),
      model: 'glm-4.5',
      tokens: Math.floor(content.length / 4), // Rough token estimation
      processingTime: Date.now() - startTime
    };
  }

  private buildSystemPrompt(context: AIContext): string {
    const basePrompt = `You are an AI assistant for CRNMN (THEFMSMKT), a gourmet corn delivery service in Malaysia. You help customers with:

1. **Menu Information**: Explain our corn varieties, prices, and special offers
2. **Order Assistance**: Help with ordering, customization, and recommendations
3. **Delivery Support**: Provide delivery information, tracking, and location services
4. **Customer Service**: Handle inquiries, complaints, and feedback
5. **Malaysian Context**: Understand local preferences, currency (RM), and cultural nuances

Current Context: ${context.context || 'general_inquiry'}
User Preferences: ${JSON.stringify(context.userPreferences || {})}

Guidelines:
- Be friendly, helpful, and professional
- Use Malaysian English when appropriate
- Provide accurate information about our corn products
- Suggest relevant menu items based on user preferences
- Handle both English and Bahasa Malaysia queries
- Always be encouraging about trying our gourmet corn varieties

If asked about image generation, explain that you can help create custom corn images using AI.`;

    return basePrompt;
  }

  private generateGLMResponse(message: string, context: AIContext): string {
    // Mock GLM-4.5 responses based on message content
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('menu') || lowerMessage.includes('what') && lowerMessage.includes('available')) {
      return `🌽 **Welcome to CRNMN's Gourmet Corn Menu!**

Here are our signature corn varieties:

**🔥 Most Popular:**
- **CORNMAN Classic Cup** - RM 7.90
  Sweet corn + butter + cheese (Our bestseller!)

- **Susu Pekat Classic** - RM 8.50  
  Traditional Malaysian corn with condensed milk

**🧀 Cheese Lovers:**
- **Cheddar Cheese Explosion** - RM 10.90
  Premium corn loaded with aged Australian cheddar

**🍭 Sweet Treats:**
- **Chocolate Corn Delight** - RM 9.50
  Rich Belgian chocolate drizzle

- **Caramel Corn Supreme** - RM 9.90
  Smooth golden caramel glaze

**🌶️ Spicy Options:**
- **Spicy Jalapeño Corn** - RM 8.90
  Perfect kick for spice lovers

All our corn is fresh, locally sourced, and prepared with premium ingredients. Would you like me to recommend something based on your taste preferences?`;
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
      return `📦 **Order Tracking Made Easy!**

To track your CRNMN order:

1. **Check your order status** in the "Track Order" section
2. **Real-time updates** on preparation and delivery
3. **Direct contact** with your delivery rider
4. **Estimated delivery time** based on your location

**Current Order Status:**
- Order placed ✅
- Food preparation in progress 🔥
- Out for delivery 🛵
- Delivered to your door 🏠

Need help with a specific order? Just provide your order number and I'll help you track it down!`;
    }
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('location')) {
      return `🚚 **CRNMN Delivery Information**

**Delivery Areas:**
- Kuala Lumpur (KLCC, Bukit Bintang, Mont Kiara)
- Petaling Jaya (SS2, Damansara, Kelana Jaya)
- Subang Jaya (USJ, Putra Heights)
- Shah Alam (Seksyen 7, Seksyen 13)

**Delivery Details:**
- ⏱️ **15-20 minutes** average delivery time
- 💰 **RM 2.50** delivery fee
- 🆓 **Free delivery** for orders above RM 25
- 📱 **Live tracking** with rider contact

**Operating Hours:**
- Monday - Sunday: 10:00 AM - 10:00 PM
- Last order: 9:30 PM

Not in our delivery area? We're expanding! Let me know your location and I'll check if we can make an exception.`;
    }
    
    if (lowerMessage.includes('image') || lowerMessage.includes('generate') || lowerMessage.includes('picture')) {
      return `🎨 **AI Image Generation Available!**

I can help you create custom corn images using AI! Here's what I can generate:

**Available Styles:**
- 🖼️ **Photorealistic** corn dishes
- 🎨 **Artistic** corn illustrations  
- 📸 **Menu-style** product photos
- 🌽 **Custom** corn varieties

**How to request:**
Just describe what you want! For example:
- "Generate a photo of chocolate corn"
- "Create an artistic image of Malaysian corn"
- "Make a menu photo of our cheese corn"

**Features:**
- High-resolution images
- Multiple style options
- Custom branding
- Social media ready

Would you like me to generate a specific corn image for you? Just describe what you have in mind!`;
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rm')) {
      return `💰 **CRNMN Pricing Guide**

**Individual Items:**
- Classic varieties: RM 7.90 - RM 8.90
- Premium options: RM 9.50 - RM 12.90
- Special creations: RM 10.90 - RM 15.90

**Delivery & Fees:**
- Delivery fee: RM 2.50
- Service fee: RM 1.00
- Free delivery: Orders above RM 25

**Value Deals:**
- 🎉 **Combo meals** available
- 👥 **Group orders** get discounts
- 🎂 **Party packages** for events
- 💳 **Multiple payment** options

**Payment Methods:**
- 💳 Credit/Debit cards
- 📱 E-wallets (GrabPay, Boost, Touch 'n Go)
- 🏦 Online banking (FPX)
- 💰 Cash on delivery

Want to know about specific pricing or combo deals? Just ask!`;
    }
    
    // Default response
    return `🌽 **Hello! I'm your CRNMN AI Assistant!**

I'm here to help you with everything related to our gourmet corn delivery service. I can assist you with:

- 📋 **Menu recommendations** and customization
- 🛒 **Ordering assistance** and special requests  
- 📍 **Delivery information** and tracking
- 💰 **Pricing** and payment options
- 🎨 **AI image generation** for custom corn visuals
- ❓ **General inquiries** about our service

What would you like to know about CRNMN today? I'm excited to help you discover our delicious corn varieties! 🚀`;
  }

  private determineResponseType(content: string): 'text' | 'image' | 'code' | 'error' {
    if (content.includes('```')) return 'code';
    if (content.includes('data:image/') || content.includes('base64')) return 'image';
    if (content.includes('error') || content.includes('Error')) return 'error';
    return 'text';
  }

  private getFallbackResponse(message: string): string {
    return `I apologize, but I'm experiencing some technical difficulties right now. 

However, I can still help you with basic information about CRNMN:

🌽 **Quick Menu**: Classic Cup (RM 7.90), Susu Pekat (RM 8.50), Cheese Explosion (RM 10.90)
🚚 **Delivery**: 15-20 minutes, RM 2.50 fee, free above RM 25
📞 **Support**: Contact our team directly for immediate assistance

Please try again in a moment, or contact our customer service team for immediate help!`;
  }

  // Image generation method
  async generateImage(prompt: string, style: 'realistic' | 'artistic' | 'menu' = 'realistic'): Promise<string> {
    try {
      if (this.openai) {
        const response = await this.openai.images.generate({
          model: 'dall-e-3',
          prompt: `High-quality ${style} image of ${prompt}, professional food photography, appetizing, well-lit`,
          n: 1,
          size: '1024x1024',
          quality: 'hd'
        });

        return response.data[0]?.url || '';
      }
      
      // Fallback to mock image generation
      return this.generateMockImage(prompt, style);
    } catch (error) {
      console.error('Image generation error:', error);
      return this.generateMockImage(prompt, style);
    }
  }

  private generateMockImage(prompt: string, style: string): string {
    // Return a placeholder or mock image URL
    return `https://via.placeholder.com/512x512/00ff88/000000?text=${encodeURIComponent(prompt)}`;
  }

  // Website modification capabilities
  async modifyWebsite(instruction: string): Promise<{ success: boolean; changes: string[] }> {
    // This would integrate with the website's modification system
    // For now, return a mock response
    return {
      success: true,
      changes: [
        `Applied modification: ${instruction}`,
        'Updated component styling',
        'Modified user interface elements'
      ]
    };
  }
}