/**
 * GLM-4.6 AI Integration
 * Zhipu AI GLM-4 model integration
 */

const GLM_API_URL = 'https://api.z.ai/api/paas/v4/chat/completions';
const GLM_API_KEY = import.meta.env.VITE_GLM_API_KEY;

export interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GLMChatOptions {
  model?: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface GLMResponse {
  id: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a chat completion request to GLM-4.6
 */
export async function sendGLMChat(
  messages: GLMMessage[],
  options: GLMChatOptions = {}
): Promise<string> {
  if (!GLM_API_KEY) {
    throw new Error('GLM API key not configured. Please add VITE_GLM_API_KEY to .env.local');
  }

  const {
    model = 'glm-4.6',
    temperature = 0.7,
    top_p = 0.9,
    max_tokens = 4096,
    stream = false,
  } = options;

  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        top_p,
        max_tokens,
        stream,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GLM API Error: ${error.error?.message || response.statusText}`);
    }

    const data: GLMResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from GLM API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('GLM API Error:', error);
    throw error;
  }
}

/**
 * Get menu recommendations using GLM-4.6
 */
export async function getGLMMenuRecommendations(
  userPreferences: string,
  menuContext?: string
): Promise<string> {
  const messages: GLMMessage[] = [
    {
      role: 'system',
      content: `You are a helpful AI assistant for CRNMN Restaurant, specializing in corn-based dishes. 
      Your role is to recommend menu items based on customer preferences, dietary restrictions, and taste preferences.
      Always be friendly, informative, and culturally sensitive to Malaysian food preferences.
      ${menuContext ? `Available menu items: ${menuContext}` : ''}`,
    },
    {
      role: 'user',
      content: userPreferences,
    },
  ];

  return sendGLMChat(messages, {
    model: 'glm-4-plus',
    temperature: 0.8,
    max_tokens: 1024,
  });
}

/**
 * Answer customer questions using GLM-4.6
 */
export async function answerWithGLM(
  question: string,
  context?: string
): Promise<string> {
  const messages: GLMMessage[] = [
    {
      role: 'system',
      content: `You are CRNMN Restaurant's AI assistant. You help customers with:
      - Menu inquiries and recommendations
      - Order information and tracking
      - Restaurant location and hours
      - Food preparation and ingredients
      - Dietary restrictions and allergens
      - Pricing and promotions
      
      Be concise, helpful, and friendly. If you don't know something, be honest and suggest contacting staff.
      ${context ? `Context: ${context}` : ''}`,
    },
    {
      role: 'user',
      content: question,
    },
  ];

  return sendGLMChat(messages, {
    temperature: 0.6,
    max_tokens: 512,
  });
}

/**
 * Generate product descriptions using GLM-4.6
 */
export async function generateProductDescription(
  productName: string,
  ingredients: string[],
  category: string
): Promise<string> {
  const prompt = `Generate an appealing, mouth-watering description for this menu item:
  
  Name: ${productName}
  Category: ${category}
  Ingredients: ${ingredients.join(', ')}
  
  Make it engaging, descriptive (2-3 sentences), and highlight what makes it special.
  Focus on taste, texture, and experience.`;

  const messages: GLMMessage[] = [
    {
      role: 'system',
      content: 'You are a professional food writer creating menu descriptions for a premium corn restaurant.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  return sendGLMChat(messages, {
    temperature: 0.9,
    max_tokens: 256,
  });
}

/**
 * Multi-turn conversation with GLM-4.6
 */
export class GLMConversation {
  private messages: GLMMessage[] = [];
  private systemPrompt: string;

  constructor(systemPrompt?: string) {
    this.systemPrompt = systemPrompt || 
      'You are a helpful AI assistant for CRNMN Restaurant. Provide accurate, friendly, and concise responses.';
    
    this.messages.push({
      role: 'system',
      content: this.systemPrompt,
    });
  }

  async sendMessage(message: string, options?: GLMChatOptions): Promise<string> {
    this.messages.push({
      role: 'user',
      content: message,
    });

    const response = await sendGLMChat(this.messages, options);

    this.messages.push({
      role: 'assistant',
      content: response,
    });

    return response;
  }

  getHistory(): GLMMessage[] {
    return [...this.messages];
  }

  clearHistory(): void {
    this.messages = [{
      role: 'system',
      content: this.systemPrompt,
    }];
  }

  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
    this.messages[0] = {
      role: 'system',
      content: prompt,
    };
  }
}

/**
 * Web Search API Integration
 */
export interface WebSearchOptions {
  searchEngine?: 'search-prime';
  searchQuery: string;
  count?: number;
  searchDomainFilter?: string;
  searchRecencyFilter?: 'noLimit' | 'day' | 'week' | 'month' | 'year';
  contentSize?: 'low' | 'medium' | 'high';
}

export interface WebSearchResult {
  content: string;
  icon: string;
  link: string;
  media: string;
  publish_date: string;
  refer: string;
  title: string;
}

/**
 * Perform web search using GLM Web Search API
 */
export async function searchWeb(options: WebSearchOptions): Promise<WebSearchResult[]> {
  if (!GLM_API_KEY) {
    throw new Error('GLM API key not configured');
  }

  const {
    searchEngine = 'search-prime',
    searchQuery,
    count = 10,
    searchDomainFilter,
    searchRecencyFilter = 'noLimit',
    contentSize = 'high',
  } = options;

  try {
    const response = await fetch('https://api.z.ai/api/paas/v4/tools/web-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GLM_API_KEY}`,
      },
      body: JSON.stringify({
        search_engine: searchEngine,
        search_query: searchQuery,
        count,
        search_domain_filter: searchDomainFilter,
        search_recency_filter: searchRecencyFilter,
        content_size: contentSize,
      }),
    });

    if (!response.ok) {
      throw new Error(`Web Search API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.search_result || [];
  } catch (error) {
    console.error('Web Search Error:', error);
    throw error;
  }
}

/**
 * Chat with Web Search integration (RAG with citations)
 */
export async function chatWithWebSearch(
  query: string,
  searchConfig?: Partial<WebSearchOptions>
): Promise<{ answer: string; sources: WebSearchResult[] }> {
  if (!GLM_API_KEY) {
    throw new Error('GLM API key not configured');
  }

  const tools = [{
    type: 'web_search',
    web_search: {
      enable: true,
      search_engine: searchConfig?.searchEngine || 'search-prime',
      search_result: true,
      count: searchConfig?.count || 5,
      search_domain_filter: searchConfig?.searchDomainFilter,
      search_recency_filter: searchConfig?.searchRecencyFilter || 'noLimit',
      content_size: searchConfig?.contentSize || 'high',
    },
  }];

  const messages = [{
    role: 'user',
    content: query,
  }];

  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4.6',
        messages,
        tools,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat with Web Search Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      answer: data.choices[0].message.content,
      sources: data.web_search || [],
    };
  } catch (error) {
    console.error('Chat with Web Search Error:', error);
    throw error;
  }
}

export default {
  sendChat: sendGLMChat,
  getRecommendations: getGLMMenuRecommendations,
  answer: answerWithGLM,
  generateDescription: generateProductDescription,
  searchWeb,
  chatWithWebSearch,
  Conversation: GLMConversation,
};
