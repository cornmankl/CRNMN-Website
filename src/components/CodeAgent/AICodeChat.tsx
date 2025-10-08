import { useState, useRef, useEffect } from 'react';
import { streamGLMChat, RESTAURANT_TOOLS } from '@/lib/glm-stream';
import { createCodeAgent, CodeAgent } from '@/lib/code-agent';
import { executeInSandbox } from '@/lib/terminal-executor';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  toolCalls?: any[];
  timestamp: Date;
}

export function AICodeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [reasoning, setReasoning] = useState('');
  const [provider, setProvider] = useState<'glm' | 'morph' | 'qwen'>('glm');
  const [sandboxEnabled, setSandboxEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<CodeAgent | null>(null);

  useEffect(() => {
    agentRef.current = createCodeAgent(provider);
  }, [provider]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    setReasoning('');

    try {
      // Use streaming for better UX
      let assistantContent = '';
      let assistantReasoning = '';
      const toolCalls: any[] = [];

      await streamGLMChat(
        [{ role: 'user', content: input }],
        {
          onReasoningStart: () => {
            console.log('🧠 AI is thinking...');
          },
          onReasoning: (text) => {
            assistantReasoning += text;
            setReasoning(assistantReasoning);
          },
          onContentStart: () => {
            setIsThinking(false);
          },
          onContent: (text) => {
            assistantContent += text;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: assistantContent },
                ];
              }
              return [
                ...prev,
                {
                  role: 'assistant',
                  content: assistantContent,
                  reasoning: assistantReasoning,
                  timestamp: new Date(),
                },
              ];
            });
          },
          onToolCall: (tool) => {
            toolCalls.push(tool);
            console.log('🔧 Tool called:', tool);
          },
          onComplete: (result) => {
            console.log('✅ Complete:', result);
            setIsThinking(false);
            setReasoning('');
          },
          onError: (error) => {
            console.error('❌ Error:', error);
            setIsThinking(false);
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                content: `Error: ${error.message}`,
                timestamp: new Date(),
              },
            ]);
          },
        },
        {
          tools: RESTAURANT_TOOLS,
          toolStream: true,
          temperature: 0.7,
        }
      );
    } catch (error: any) {
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleCodeGeneration = async (description: string) => {
    if (!agentRef.current) return;

    setIsThinking(true);
    try {
      const result = await agentRef.current.generateCode({
        description,
        sandbox: sandboxEnabled,
        provider,
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `\`\`\`javascript\n${result.code}\n\`\`\`\n\n${
            result.executionResult
              ? `**Execution Result:**\n\`\`\`\n${JSON.stringify(result.executionResult, null, 2)}\n\`\`\``
              : ''
          }`,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">🤖 AI Code Agent</h2>
          <div className="flex gap-4 items-center">
            {/* Provider Selection */}
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              <option value="glm">GLM-4.6</option>
              <option value="morph">MorphLLM</option>
              <option value="qwen">Qwen CLI</option>
            </select>

            {/* Sandbox Toggle */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sandboxEnabled}
                onChange={(e) => setSandboxEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Sandbox</span>
            </label>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gray-700'
              }`}
            >
              {msg.reasoning && (
                <div className="mb-2 p-2 bg-gray-800 rounded text-sm opacity-70">
                  <div className="font-semibold mb-1">🧠 Reasoning:</div>
                  {msg.reasoning}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-2 text-xs opacity-70">
                  🔧 {msg.toolCalls.length} tool(s) called
                </div>
              )}
              <div className="text-xs opacity-50 mt-2">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-4 max-w-[80%]">
              {reasoning ? (
                <div>
                  <div className="font-semibold mb-2">🧠 Thinking...</div>
                  <div className="text-sm opacity-70">{reasoning}</div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to generate code, explain concepts, or help with coding..."
            className="flex-1 bg-gray-700 rounded-lg p-3 resize-none"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={isThinking || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 rounded-lg font-semibold"
          >
            Send
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <button
            onClick={() => handleCodeGeneration('Create a factorial function in JavaScript')}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Generate Factorial
          </button>
          <button
            onClick={() => setInput('Explain how async/await works in JavaScript')}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Explain Async/Await
          </button>
          <button
            onClick={() => setInput('Create a REST API endpoint for user registration')}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Generate API
          </button>
        </div>
      </div>
    </div>
  );
}
