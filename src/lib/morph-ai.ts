/**
 * MorphLLM API Integration
 * Specialized AI for code editing, embeddings, and agentic workflows
 * Docs: https://docs.morphllm.com
 */

const MORPH_API_URL = 'https://api.morphllm.com/v1';
const MORPH_API_KEY = import.meta.env.VITE_MORPH_API_KEY;

export type MorphModel = 'morph-v3-fast' | 'morph-v3-large' | 'morph-embedding-v3';

export interface MorphMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MorphChatOptions {
  model?: MorphModel;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface MorphApplyRequest {
  instruction?: string;
  code: string;
  update: string;
}

export interface MorphEmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send chat request to Morph
 */
export async function sendMorphChat(
  messages: MorphMessage[],
  options: MorphChatOptions = {}
): Promise<string> {
  if (!MORPH_API_KEY) {
    throw new Error('Morph API key not configured. Please add VITE_MORPH_API_KEY to .env.local');
  }

  const {
    model = 'morph-v3-fast',
    temperature = 0.7,
    maxTokens = 4096,
    stream = false,
  } = options;

  try {
    const response = await fetch(`${MORPH_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MORPH_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Morph API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Morph API Error:', error);
    throw error;
  }
}

/**
 * Apply code changes using Morph Apply API
 * Ultra-fast (4500+ tokens/sec) with 98% accuracy
 */
export async function applyCodeEdit(request: MorphApplyRequest): Promise<string> {
  if (!MORPH_API_KEY) {
    throw new Error('Morph API key not configured');
  }

  const { instruction, code, update } = request;

  // Format as XML for Morph Apply
  const content = `${instruction ? `<instruction>${instruction}</instruction>` : ''}<code>${code}</code><update>${update}</update>`;

  const messages: MorphMessage[] = [
    {
      role: 'user',
      content,
    },
  ];

  try {
    const response = await fetch(`${MORPH_API_URL}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MORPH_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'morph-v3-large',
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Morph Apply Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Morph Apply Error:', error);
    throw error;
  }
}

/**
 * Generate code embeddings for semantic search
 * 1024 dimensions, state-of-the-art performance
 */
export async function generateCodeEmbedding(input: string | string[]): Promise<MorphEmbeddingResponse> {
  if (!MORPH_API_KEY) {
    throw new Error('Morph API key not configured');
  }

  try {
    const response = await fetch(`${MORPH_API_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MORPH_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'morph-embedding-v3',
        input,
      }),
    });

    if (!response.ok) {
      throw new Error(`Morph Embedding Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Morph Embedding Error:', error);
    throw error;
  }
}

/**
 * Agentic workflow for code manipulation
 */
export async function agenticCodeTask(
  task: string,
  code?: string
): Promise<string> {
  const messages: MorphMessage[] = [
    {
      role: 'system',
      content: 'You are an expert coding agent. Execute tasks precisely and efficiently.',
    },
    {
      role: 'user',
      content: code ? `Task: ${task}\n\nCode:\n${code}` : task,
    },
  ];

  return sendMorphChat(messages, {
    model: 'morph-v3-large',
    temperature: 0.3,
  });
}

/**
 * Code retrieval using embeddings
 */
export async function findSimilarCode(
  query: string,
  codeSnippets: string[]
): Promise<Array<{ code: string; similarity: number }>> {
  // Generate embedding for query
  const queryEmbedding = await generateCodeEmbedding(query);
  const qVector = queryEmbedding.data[0].embedding;

  // Generate embeddings for all code snippets
  const codeEmbeddings = await generateCodeEmbedding(codeSnippets);

  // Calculate cosine similarity
  const results = codeSnippets.map((code, idx) => {
    const cVector = codeEmbeddings.data[idx].embedding;
    const similarity = cosineSimilarity(qVector, cVector);
    return { code, similarity };
  });

  // Sort by similarity (highest first)
  return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}

export default {
  chat: sendMorphChat,
  apply: applyCodeEdit,
  embed: generateCodeEmbedding,
  agentic: agenticCodeTask,
  findSimilar: findSimilarCode,
};
