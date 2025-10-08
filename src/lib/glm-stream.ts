/**
 * GLM-4.6 Streaming Tool Call Support
 * Real-time access to reasoning, responses, and tool calls
 */

const GLM_API_URL = 'https://api.z.ai/api/paas/v4/chat/completions';
const GLM_API_KEY = import.meta.env.VITE_GLM_API_KEY;

export interface GLMTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface GLMStreamChunk {
  choices: Array<{
    delta: {
      reasoning_content?: string;
      content?: string;
      tool_calls?: Array<{
        index: number;
        id?: string;
        type?: string;
        function: {
          name?: string;
          arguments: string;
        };
      }>;
    };
    finish_reason?: string;
  }>;
}

export interface StreamCallbacks {
  onReasoningStart?: () => void;
  onReasoning?: (text: string) => void;
  onContentStart?: () => void;
  onContent?: (text: string) => void;
  onToolCall?: (toolCall: any) => void;
  onComplete?: (result: {
    reasoning: string;
    content: string;
    toolCalls: Record<number, any>;
  }) => void;
  onError?: (error: Error) => void;
}

/**
 * Stream chat with tool calling support
 */
export async function streamGLMChat(
  messages: Array<{ role: string; content: string }>,
  callbacks: StreamCallbacks,
  options: {
    tools?: GLMTool[];
    temperature?: number;
    maxTokens?: number;
    toolStream?: boolean;
  } = {}
): Promise<void> {
  if (!GLM_API_KEY) {
    throw new Error('GLM API key not configured');
  }

  const {
    tools = [],
    temperature = 0.7,
    maxTokens = 4096,
    toolStream = true,
  } = options;

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
        tools: tools.length > 0 ? tools : undefined,
        stream: true,
        tool_stream: toolStream,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let reasoningContent = '';
    let content = '';
    let toolCalls: Record<number, any> = {};
    let reasoningStarted = false;
    let contentStarted = false;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed: GLMStreamChunk = JSON.parse(data);
          
          if (!parsed.choices || parsed.choices.length === 0) continue;

          const delta = parsed.choices[0].delta;

          // Handle reasoning content
          if (delta.reasoning_content) {
            if (!reasoningStarted && delta.reasoning_content.trim()) {
              callbacks.onReasoningStart?.();
              reasoningStarted = true;
            }
            reasoningContent += delta.reasoning_content;
            callbacks.onReasoning?.(delta.reasoning_content);
          }

          // Handle response content
          if (delta.content) {
            if (!contentStarted && delta.content.trim()) {
              callbacks.onContentStart?.();
              contentStarted = true;
            }
            content += delta.content;
            callbacks.onContent?.(delta.content);
          }

          // Handle tool calls
          if (delta.tool_calls) {
            for (const toolCall of delta.tool_calls) {
              const index = toolCall.index;
              
              if (!toolCalls[index]) {
                toolCalls[index] = {
                  id: toolCall.id || `call_${index}`,
                  type: toolCall.type || 'function',
                  function: {
                    name: toolCall.function.name || '',
                    arguments: toolCall.function.arguments || '',
                  },
                };
              } else {
                toolCalls[index].function.arguments += toolCall.function.arguments;
              }
              
              callbacks.onToolCall?.(toolCalls[index]);
            }
          }

          // Check if complete
          if (parsed.choices[0].finish_reason) {
            callbacks.onComplete?.({
              reasoning: reasoningContent,
              content,
              toolCalls,
            });
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  } catch (error) {
    callbacks.onError?.(error as Error);
    throw error;
  }
}

/**
 * Pre-defined tools for restaurant
 */
export const RESTAURANT_TOOLS: GLMTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_menu_items',
      description: 'Get menu items by category or search query',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Menu category: "Nasi & Rice Meals", "Snacks", "Kuih", "Bread & Pastries", "Fruits & Fresh", "Cakes & Desserts"',
          },
          search: {
            type: 'string',
            description: 'Search query for menu item name',
          },
          max_results: {
            type: 'number',
            description: 'Maximum number of results to return',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_allergens',
      description: 'Check allergen information for menu items',
      parameters: {
        type: 'object',
        properties: {
          item_name: {
            type: 'string',
            description: 'Name of the menu item to check',
          },
          allergen: {
            type: 'string',
            description: 'Specific allergen to check: gluten, dairy, soy, nuts, etc.',
          },
        },
        required: ['item_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_restaurant_info',
      description: 'Get restaurant information like hours, location, contact',
      parameters: {
        type: 'object',
        properties: {
          info_type: {
            type: 'string',
            description: 'Type of information: "hours", "location", "contact", "delivery"',
          },
        },
        required: ['info_type'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_price_range',
      description: 'Get menu items within a specific price range',
      parameters: {
        type: 'object',
        properties: {
          min_price: {
            type: 'number',
            description: 'Minimum price in RM',
          },
          max_price: {
            type: 'number',
            description: 'Maximum price in RM',
          },
          category: {
            type: 'string',
            description: 'Optional category filter',
          },
        },
        required: ['min_price', 'max_price'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_recommendations',
      description: 'Get personalized menu recommendations based on preferences',
      parameters: {
        type: 'object',
        properties: {
          preferences: {
            type: 'string',
            description: 'User preferences: spicy, sweet, healthy, vegetarian, etc.',
          },
          budget: {
            type: 'number',
            description: 'Budget per person in RM',
          },
        },
        required: ['preferences'],
      },
    },
  },
];

/**
 * Execute tool function (implement based on your data)
 */
export async function executeToolFunction(
  functionName: string,
  args: Record<string, any>
): Promise<any> {
  // This should be implemented based on your actual data source
  switch (functionName) {
    case 'get_menu_items':
      // Return menu items from your database
      return {
        items: [
          { name: 'Nasi Budak Gemok', price: 8.0, category: 'Nasi & Rice Meals' },
          { name: 'Vietnam Roll', price: 6.0, category: 'Snacks' },
        ],
      };
    
    case 'check_allergens':
      return {
        item: args.item_name,
        allergens: ['gluten', 'dairy'],
        safe: args.allergen ? !['gluten', 'dairy'].includes(args.allergen) : false,
      };
    
    case 'get_restaurant_info':
      const info: Record<string, any> = {
        hours: 'Open daily 10:00 AM - 10:00 PM',
        location: 'Kuala Lumpur, Malaysia',
        contact: '+60-123-456-789',
        delivery: 'Available via GrabFood and Foodpanda',
      };
      return { [args.info_type]: info[args.info_type] };
    
    case 'get_price_range':
      return {
        items: [
          { name: 'Kuih Manis', price: 3.8, category: 'Kuih' },
          { name: 'Pau Sambal Bilis', price: 4.8, category: 'Snacks' },
        ],
      };
    
    case 'get_recommendations':
      return {
        recommendations: [
          'Nasi Kerabu Ayam - Traditional blue rice with chicken',
          'Vietnam Roll - Fresh and healthy option',
        ],
      };
    
    default:
      return { error: 'Unknown function' };
  }
}

export default {
  stream: streamGLMChat,
  tools: RESTAURANT_TOOLS,
  executeFunction: executeToolFunction,
};
