# Code Agent Integration

Complete integration of AI-powered code generation, editing, and execution with sandbox support.

## Features

### 1. **MorphLLM Integration** (`morph-ai.ts`)
- ⚡ **Ultra-fast code editing** (4500+ tokens/sec, 98% accuracy)
- 🔍 **Code embeddings** (1024 dimensions, semantic search)
- 🤖 **Agentic workflows** for complex tasks
- 📦 **Models**:
  - `morph-v3-fast` - Optimized for speed (16K context)
  - `morph-v3-large` - Most capable (complex tasks)
  - `morph-embedding-v3` - Code embeddings

### 2. **Terminal Executor** (`terminal-executor.ts`)
- 🔒 **Sandboxed execution** (safe code running)
- 🐍 **Python support** (via Pyodide or backend)
- 🟨 **JavaScript support** (VM isolation)
- 🐚 **Shell commands** (validated for security)
- ⚙️ **Configuration**: timeout, memory, network, read-only

### 3. **Qwen CLI** (`qwen-cli.ts`)
- 💬 **Interactive REPL** (Read-Eval-Print Loop)
- 📁 **Workspace management** (multi-directory)
- 💾 **Checkpointing** (save/resume sessions)
- 🗜️ **Context compression** (token optimization)
- 🛠️ **Built-in commands**: `/chat`, `/directory`, `/save`, etc.

### 4. **Unified Code Agent** (`code-agent.ts`)
- 🎯 **Single API** for all AI providers
- 🔀 **Auto provider selection** (GLM, Morph, Qwen)
- 🧪 **Safe execution** with sandbox
- 🌐 **Web search** integration (real-time data)
- 🔧 **Smart language detection**

## Installation & Setup

### 1. Add API Keys to `.env.local`

```env
# MorphLLM API
VITE_MORPH_API_KEY=your-morph-api-key-here

# GLM-4.6 AI (already configured)
VITE_GLM_API_KEY=your-glm-key

# Gemini (already configured)
VITE_GEMINI_API_KEY=your-gemini-key
```

⚠️ **SECURITY**: Never commit `.env.local` to git!

### 2. Install Dependencies

```bash
npm install
```

## Usage Examples

### Basic Code Generation

```typescript
import { createCodeAgent } from './lib/code-agent';

const agent = createCodeAgent('morph');

// Generate code
const result = await agent.generateCode({
  description: 'Create a function to calculate factorial',
  language: 'javascript',
  sandbox: true, // Execute in sandbox
});

console.log('Generated code:', result.code);
console.log('Execution result:', result.executionResult);
```

### Code Editing (Morph Apply)

```typescript
import { applyCodeEdit } from './lib/morph-ai';

const original = `
function divide(a, b) {
  return a / b;
}
`;

const edited = await applyCodeEdit({
  instruction: 'Add error handling for division by zero',
  code: original,
  update: '', // Morph figures this out
});

console.log(edited);
// Output:
// function divide(a, b) {
//   if (b === 0) throw new Error('Cannot divide by zero');
//   return a / b;
// }
```

### Code Embeddings & Similarity Search

```typescript
import { findSimilarCode } from './lib/morph-ai';

const codeSnippets = [
  'function add(a, b) { return a + b; }',
  'const multiply = (x, y) => x * y;',
  'def subtract(a, b): return a - b',
];

const similar = await findSimilarCode(
  'addition function',
  codeSnippets
);

console.log('Most similar:', similar[0]);
```

### Sandbox Execution

```typescript
import { executeInSandbox } from './lib/terminal-executor';

const result = await executeInSandbox('echo "Hello World"', {
  timeout: 5000,
  allowNetwork: false,
  readOnly: true,
});

console.log('Output:', result.stdout);
console.log('Error:', result.stderr);
console.log('Exit code:', result.exitCode);
```

### Qwen CLI Commands

```typescript
import { initQwenCLI, executeQwenCommand } from './lib/qwen-cli';

const session = await initQwenCLI({
  theme: 'dark',
  sandboxEnabled: true,
});

// Save checkpoint
await executeQwenCommand(session, '/chat save my-checkpoint');

// List checkpoints
await executeQwenCommand(session, '/chat list');

// Resume checkpoint
await executeQwenCommand(session, '/chat resume my-checkpoint');
```

### Complete Workflow

```typescript
import { CodeAgent } from './lib/code-agent';

const agent = new CodeAgent('morph');

// 1. Generate code
const generated = await agent.generateCode({
  description: 'Create a REST API endpoint for user registration',
  language: 'typescript',
  webSearch: true, // Use latest best practices
});

// 2. Generate tests
const tests = await agent.generateTests(generated.code, 'jest');

// 3. Execute tests in sandbox
const testResult = await agent.executeCode(tests.code, 'javascript');

// 4. If errors, debug
if (testResult.exitCode !== 0) {
  const debugged = await agent.debugCode(
    generated.code,
    testResult.stderr
  );
  console.log('Fixed code:', debugged.code);
}

// 5. Code review
const review = await agent.reviewCode(generated.code);
console.log('Quality score:', review.score);
console.log('Issues:', review.issues);

// 6. Refactor based on review
if (review.suggestions.length > 0) {
  const refactored = await agent.refactorCode(
    generated.code,
    review.suggestions
  );
  console.log('Improved code:', refactored.code);
}
```

## API Reference

### CodeAgent Class

```typescript
class CodeAgent {
  // Generate code from description
  generateCode(task: CodeTask): Promise<CodeResult>
  
  // Execute code in sandbox
  executeCode(code: string, language?: Language): Promise<any>
  
  // Edit existing code
  editCode(code: string, instruction: string): Promise<CodeResult>
  
  // Explain code
  explainCode(code: string, provider?: AIProvider): Promise<string>
  
  // Debug code
  debugCode(code: string, error?: string): Promise<CodeResult>
  
  // Refactor code
  refactorCode(code: string, improvements: string[]): Promise<CodeResult>
  
  // Convert between languages
  convertCode(code: string, from: string, to: string): Promise<CodeResult>
  
  // Generate tests
  generateTests(code: string, framework?: string): Promise<CodeResult>
  
  // Code review
  reviewCode(code: string): Promise<ReviewResult>
  
  // Qwen CLI commands
  qwenCommand(command: string): Promise<any>
  
  // Set default provider
  setProvider(provider: AIProvider): void
}
```

### MorphLLM Functions

```typescript
// Chat completion
sendMorphChat(messages: MorphMessage[], options?: MorphChatOptions): Promise<string>

// Apply code edits
applyCodeEdit(request: MorphApplyRequest): Promise<string>

// Generate embeddings
generateCodeEmbedding(input: string | string[]): Promise<MorphEmbeddingResponse>

// Agentic task
agenticCodeTask(task: string, code?: string): Promise<string>

// Find similar code
findSimilarCode(query: string, snippets: string[]): Promise<SimilarityResult[]>
```

### Terminal Executor Functions

```typescript
// Execute in sandbox
executeInSandbox(command: string, config?: SandboxConfig): Promise<ExecutionResult>

// Execute JavaScript
executeJavaScript(code: string, config?: SandboxConfig): Promise<ExecutionResult>

// Execute Python
executePython(code: string, config?: SandboxConfig): Promise<ExecutionResult>

// Create Worker
createSandboxWorker(code: string): Worker | null

// Validate command
isCommandSafe(command: string): boolean
```

### Qwen CLI Functions

```typescript
// Initialize CLI
initQwenCLI(config?: QwenCLIConfig): Promise<QwenSession>

// Execute command
executeQwenCommand(session: QwenSession, command: string): Promise<ExecutionResult>

// Get help
getQwenHelp(): string

// Start REPL
startQwenREPL(config?: QwenCLIConfig): Promise<void>
```

## Configuration

### Sandbox Config

```typescript
interface SandboxConfig {
  timeout?: number;        // Execution timeout (ms)
  maxMemory?: number;      // Max memory (MB)
  workingDir?: string;     // Working directory
  env?: Record<string, string>;  // Environment variables
  allowNetwork?: boolean;  // Allow network access
  readOnly?: boolean;      // Read-only filesystem
}
```

### Qwen CLI Config

```typescript
interface QwenCLIConfig {
  apiKey?: string;         // API key
  model?: string;          // Model name
  theme?: 'dark' | 'light' | 'auto';  // Theme
  workspaceDir?: string;   // Workspace directory
  sandboxEnabled?: boolean;  // Enable sandbox
}
```

## Security Best Practices

### 1. Command Validation

```typescript
// Always validate commands before execution
if (!isCommandSafe(command)) {
  throw new Error('Unsafe command detected');
}
```

### 2. Sandbox Isolation

```typescript
// Use strict sandbox settings for untrusted code
await executeInSandbox(code, {
  timeout: 5000,
  allowNetwork: false,
  readOnly: true,
  maxMemory: 256,
});
```

### 3. API Key Protection

- Never expose API keys in client code
- Use server-side proxy for production
- Rotate keys regularly
- Monitor API usage

### 4. Input Sanitization

```typescript
// Sanitize user inputs
const sanitized = userInput
  .replace(/[;&|`$]/g, '')
  .trim();
```

## Performance Tips

### 1. Use Fast Models for Simple Tasks

```typescript
// Use morph-v3-fast for simple edits
const result = await sendMorphChat(messages, {
  model: 'morph-v3-fast',  // 2x faster
});
```

### 2. Cache Embeddings

```typescript
const cache = new Map();

async function getCachedEmbedding(code: string) {
  if (cache.has(code)) {
    return cache.get(code);
  }
  
  const embedding = await generateCodeEmbedding(code);
  cache.set(code, embedding);
  return embedding;
}
```

### 3. Batch Operations

```typescript
// Generate embeddings for multiple snippets at once
const embeddings = await generateCodeEmbedding([
  'snippet1',
  'snippet2',
  'snippet3',
]);
```

## Troubleshooting

### MorphLLM API Errors

```
Error: Morph API Error: Unauthorized
```
**Solution**: Check VITE_MORPH_API_KEY in `.env.local`

### Sandbox Timeout

```
Error: Execution timeout
```
**Solution**: Increase timeout or optimize code

### Unsafe Command Detected

```
Error: Unsafe command detected
```
**Solution**: Review command against blacklist, use safe alternatives

## Integration with Restaurant Website

### Generate Menu Component

```typescript
const agent = createCodeAgent('morph');

const component = await agent.generateCode({
  description: `Create a React component for displaying menu items with:
    - Search and filter
    - Category tabs
    - Add to cart button
    - Price display in RM
    - Dietary icons (vegetarian, halal, etc.)
  `,
  language: 'typescript',
});

// Save to file
fs.writeFileSync('src/components/MenuList.tsx', component.code);
```

### Auto-generate API Endpoints

```typescript
const endpoints = await agent.generateCode({
  description: `Create Express.js API endpoints for:
    - GET /api/menu - List all menu items
    - POST /api/orders - Create new order
    - GET /api/orders/:id - Get order details
    - PATCH /api/orders/:id - Update order status
  
  Use Supabase for database operations.
  `,
  language: 'typescript',
  webSearch: true, // Get latest Supabase best practices
});
```

### Generate Database Migrations

```typescript
const migration = await agent.generateCode({
  description: `Create Supabase migration to add:
    - loyalty_points table
    - customer_reviews table
    - promotional_codes table
  
  Include RLS policies and indexes.
  `,
  language: 'sql',
});
```

## Resources

- [MorphLLM Docs](https://docs.morphllm.com)
- [Qwen Code Docs](https://qwenlm.github.io/qwen-code-docs)
- [GLM-4.6 Guide](https://z.ai/guides/glm-4.6)
- [Sandbox Security](https://owasp.org/www-community/vulnerabilities/Sandbox_Bypass)

## Future Enhancements

1. **WebAssembly Sandbox** - True isolation in browser
2. **GPU Acceleration** - Faster embeddings computation
3. **Multi-file Projects** - Edit entire codebases
4. **Git Integration** - Auto-commit generated code
5. **CI/CD Pipeline** - Auto-test and deploy
6. **Visual Code Editor** - Monaco editor integration
7. **Collaborative Coding** - Real-time pair programming with AI

---

**Created**: 2025-01-08  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
