# GLM-4.6 AI Integration

Complete integration of Zhipu AI's GLM-4.6 model with advanced features for CRNMN Restaurant website.

## Features Implemented

### 1. Core GLM-4.6 Chat
- **Model**: `glm-4.6` (200K context, 128K max output)
- **Endpoint**: `https://api.z.ai/api/paas/v4/chat/completions`
- **File**: `src/lib/glm-ai.ts`

#### Functions:
- `sendGLMChat()` - Basic chat completions
- `getGLMMenuRecommendations()` - Menu recommendations based on preferences
- `answerWithGLM()` - Customer service Q&A
- `generateProductDescription()` - AI-generated product descriptions
- `GLMConversation` - Multi-turn conversation class

### 2. Stream Tool Call
- **Real-time streaming** with reasoning, content, and tool calls
- **File**: `src/lib/glm-stream.ts`

#### Features:
- Streaming reasoning process (`reasoning_content`)
- Streaming response content (`content`)
- Streaming tool invocations (`tool_calls`)
- Real-time callbacks for each event

#### Pre-defined Restaurant Tools:
1. **get_menu_items** - Search menu by category/query
2. **check_allergens** - Check allergen information
3. **get_restaurant_info** - Hours, location, contact, delivery
4. **get_price_range** - Find items within price range
5. **get_recommendations** - Personalized recommendations

### 3. Web Search Integration
- **Web Search API** - Direct structured search results
- **Web Search in Chat** - RAG with citations

#### Functions:
- `searchWeb()` - Perform web search with filters
- `chatWithWebSearch()` - Chat with real-time web data + citations

#### Options:
- Search engine: `search-prime`
- Result count: 1-50
- Domain filter
- Recency filter: `noLimit`, `day`, `week`, `month`, `year`
- Content size: `low`, `medium`, `high`

### 4. Unified AI Service
- **Multi-provider support**: GLM, Gemini, Claude
- **File**: `src/lib/unified-ai.ts`

#### Features:
- Automatic provider selection
- Unified message format
- Provider switching at runtime
- Conversation history management

## Installation & Setup

### 1. API Key Configuration

Add to `.env.local`:
```env
VITE_GLM_API_KEY=your-api-key-here
```

⚠️ **SECURITY**: Never commit `.env.local` to git!

### 2. Usage Examples

#### Basic Chat
```typescript
import { sendGLMChat } from './lib/glm-ai';

const response = await sendGLMChat([
  {
    role: 'system',
    content: 'You are a helpful restaurant assistant.',
  },
  {
    role: 'user',
    content: 'What corn dishes do you recommend?',
  },
]);

console.log(response);
```

#### Streaming with Tool Calls
```typescript
import { streamGLMChat, RESTAURANT_TOOLS } from './lib/glm-stream';

await streamGLMChat(
  [
    {
      role: 'user',
      content: 'Show me menu items under RM10',
    },
  ],
  {
    onReasoningStart: () => console.log('🧠 Thinking...'),
    onReasoning: (text) => process.stdout.write(text),
    onContentStart: () => console.log('\n💬 Response:'),
    onContent: (text) => process.stdout.write(text),
    onToolCall: (tool) => console.log('\n🔧 Tool:', tool),
    onComplete: (result) => console.log('\n✅ Done!', result),
  },
  {
    tools: RESTAURANT_TOOLS,
    toolStream: true,
  }
);
```

#### Web Search
```typescript
import { chatWithWebSearch } from './lib/glm-ai';

const { answer, sources } = await chatWithWebSearch(
  'Latest food trends in Malaysia',
  {
    count: 5,
    searchRecencyFilter: 'month',
  }
);

console.log('Answer:', answer);
console.log('Sources:', sources);
```

#### Multi-Provider AI
```typescript
import { AIConversation } from './lib/unified-ai';

const chat = new AIConversation(
  'You are CRNMN assistant',
  'glm' // or 'gemini', 'claude'
);

const response = await chat.send('Hello!');
console.log(response);

// Switch provider mid-conversation
chat.setProvider('gemini');
const response2 = await chat.send('Continue...');
```

## API Reference

### GLM-4.6 Models

| Model | Context | Max Output | Use Case |
|-------|---------|-----------|----------|
| `glm-4.6` | 200K | 128K | General chat, coding, reasoning |
| `glm-4.5v` | - | 16K | Vision (images, videos, documents) |

### Pricing

- **GLM-4.6**: 
  - Input: ~$0.50 per million tokens
  - Output: ~$1.50 per million tokens

- **Web Search API**: Per search request

### Rate Limits

- Requests per minute: Varies by plan
- Context window: 200K tokens
- Max output: 128K tokens

## Tool Execution

Implement tool functions in `src/lib/glm-stream.ts`:

```typescript
export async function executeToolFunction(
  functionName: string,
  args: Record<string, any>
): Promise<any> {
  switch (functionName) {
    case 'get_menu_items':
      // Query your Supabase database
      return await supabase
        .from('menu_items')
        .select('*')
        .eq('category', args.category);
    
    case 'check_allergens':
      // Check allergen info
      return { allergens: ['gluten', 'dairy'], safe: true };
    
    // ... other tools
  }
}
```

## Integration with Existing Code

### Connect to Supabase
```typescript
import { createClient } from '@supabase/supabase-js';
import { executeToolFunction } from './lib/glm-stream';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Update tool execution to use real data
async function getMenuItems(category?: string) {
  let query = supabase.from('menu_items').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  return data || [];
}
```

### React Component Example
```typescript
import { useState } from 'react';
import { streamGLMChat, RESTAURANT_TOOLS } from './lib/glm-stream';

export function GLMChatbox() {
  const [messages, setMessages] = useState([]);
  const [reasoning, setReasoning] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async (userMessage: string) => {
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsThinking(true);
    setReasoning('');

    await streamGLMChat(
      [{ role: 'user', content: userMessage }],
      {
        onReasoningStart: () => setIsThinking(true),
        onReasoning: (text) => setReasoning(prev => prev + text),
        onContentStart: () => setIsThinking(false),
        onContent: (text) => {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
              return [...prev.slice(0, -1), { ...last, content: last.content + text }];
            }
            return [...prev, { role: 'assistant', content: text }];
          });
        },
        onComplete: () => setIsThinking(false),
      },
      { tools: RESTAURANT_TOOLS }
    );
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
      {isThinking && <div>🧠 {reasoning}</div>}
    </div>
  );
}
```

## Future Enhancements

### 1. Vision Support (GLM-4.5V)
- Menu image recognition
- Food photo analysis
- Document OCR for receipts

### 2. Advanced Tool Integration
- Real-time order tracking
- Payment processing
- Delivery integration (GrabFood, Foodpanda)

### 3. Persistent Conversation
- Store chat history in Supabase
- Multi-session support
- User preferences learning

### 4. Analytics
- Track popular queries
- Monitor AI performance
- A/B test different prompts

## Security Considerations

1. **API Key Protection**
   - Never expose in client code
   - Use server-side proxy if needed
   - Rotate keys regularly

2. **Rate Limiting**
   - Implement per-user limits
   - Cache frequent queries
   - Debounce user inputs

3. **Input Validation**
   - Sanitize user messages
   - Prevent prompt injection
   - Filter sensitive queries

4. **Data Privacy**
   - Don't send PII to AI
   - Comply with GDPR/PDPA
   - Clear conversation logs

## Troubleshooting

### API Key Error
```
Error: GLM API key not configured
```
**Solution**: Add `VITE_GLM_API_KEY` to `.env.local`

### Network Timeout
```
Error: Failed to connect to api.z.ai
```
**Solution**: Check network, firewall, VPN settings

### Tool Call Errors
```
Error: Unknown function: xyz
```
**Solution**: Implement function in `executeToolFunction()`

### Streaming Issues
```
Error: No response body
```
**Solution**: Ensure `stream: true` and proper SSE handling

## Resources

- [Z.AI Documentation](https://z.ai/docs)
- [GLM-4.6 Guide](https://z.ai/guides/glm-4.6)
- [Stream Tool Call](https://z.ai/guides/stream-tool-call)
- [Web Search API](https://z.ai/api-reference/tools/web-search)
- [API Reference](https://z.ai/api-reference/llm/chat-completion)

## Support

For issues or questions:
- Check Z.AI documentation
- Review code examples
- Contact support@z.ai

---

**Created**: 2025-01-08  
**Last Updated**: 2025-01-08  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
