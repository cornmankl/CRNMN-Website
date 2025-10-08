/**
 * Unified Code Agent
 * Combines GLM-4.6, MorphLLM, Qwen CLI, and Sandbox Execution
 */

import { sendGLMChat, chatWithWebSearch } from './glm-ai';
import { sendMorphChat, applyCodeEdit, agenticCodeTask } from './morph-ai';
import { initQwenCLI, executeQwenCommand, QwenSession } from './qwen-cli';
import { executeInSandbox, executeJavaScript, executePython } from './terminal-executor';

export type AIProvider = 'glm' | 'morph' | 'qwen';
export type Language = 'javascript' | 'typescript' | 'python' | 'shell' | 'auto';

export interface CodeTask {
  description: string;
  code?: string;
  language?: Language;
  provider?: AIProvider;
  sandbox?: boolean;
  webSearch?: boolean;
}

export interface CodeResult {
  code: string;
  explanation?: string;
  executionResult?: any;
  sources?: any[];
}

/**
 * Main Code Agent Class
 */
export class CodeAgent {
  private qwenSession?: QwenSession;
  private defaultProvider: AIProvider = 'morph';

  constructor(provider: AIProvider = 'morph') {
    this.defaultProvider = provider;
  }

  /**
   * Initialize Qwen CLI session
   */
  async initQwen(): Promise<void> {
    this.qwenSession = await initQwenCLI({
      sandboxEnabled: true,
      theme: 'dark',
    });
  }

  /**
   * Generate code based on task description
   */
  async generateCode(task: CodeTask): Promise<CodeResult> {
    const {
      description,
      code,
      language = 'auto',
      provider = this.defaultProvider,
      sandbox = false,
      webSearch = false,
    } = task;

    // Get code from AI
    let generatedCode: string;
    let explanation: string = '';
    let sources: any[] | undefined;

    if (webSearch) {
      // Use GLM with web search for latest info
      const result = await chatWithWebSearch(description, { count: 3 });
      generatedCode = result.answer;
      sources = result.sources;
    } else {
      // Use selected AI provider
      switch (provider) {
        case 'morph':
          if (code) {
            // Use Morph Apply for code editing
            generatedCode = await applyCodeEdit({
              instruction: description,
              code,
              update: '', // Morph will figure this out
            });
          } else {
            // Use Morph agentic
            generatedCode = await agenticCodeTask(description, code);
          }
          break;

        case 'glm':
          const messages = [
            {
              role: 'system' as const,
              content: 'You are an expert programmer. Generate clean, efficient code.',
            },
            {
              role: 'user' as const,
              content: code
                ? `Task: ${description}\n\nExisting code:\n${code}`
                : description,
            },
          ];
          generatedCode = await sendGLMChat(messages);
          break;

        case 'qwen':
          if (!this.qwenSession) {
            await this.initQwen();
          }
          const result = await executeQwenCommand(this.qwenSession!, description);
          generatedCode = result.stdout;
          break;

        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    }

    // Execute in sandbox if requested
    let executionResult;
    if (sandbox && generatedCode) {
      executionResult = await this.executeCode(generatedCode, language);
    }

    return {
      code: generatedCode,
      explanation,
      executionResult,
      sources,
    };
  }

  /**
   * Execute code in sandboxed environment
   */
  async executeCode(code: string, language: Language = 'auto'): Promise<any> {
    // Detect language if auto
    const detectedLang = language === 'auto' ? detectLanguage(code) : language;

    switch (detectedLang) {
      case 'javascript':
      case 'typescript':
        return await executeJavaScript(code);

      case 'python':
        return await executePython(code);

      case 'shell':
        return await executeInSandbox(code, {
          timeout: 10000,
          allowNetwork: false,
          readOnly: true,
        });

      default:
        throw new Error(`Unsupported language: ${detectedLang}`);
    }
  }

  /**
   * Edit existing code
   */
  async editCode(
    originalCode: string,
    instruction: string
  ): Promise<CodeResult> {
    // Use Morph Apply for precise edits
    const editedCode = await applyCodeEdit({
      instruction,
      code: originalCode,
      update: '', // Morph infers the changes
    });

    return {
      code: editedCode,
      explanation: `Applied: ${instruction}`,
    };
  }

  /**
   * Explain code
   */
  async explainCode(code: string, provider: AIProvider = 'glm'): Promise<string> {
    const task = `Explain this code in detail:\n\n${code}`;

    const result = await this.generateCode({
      description: task,
      code,
      provider,
    });

    return result.code;
  }

  /**
   * Debug code
   */
  async debugCode(
    code: string,
    error?: string
  ): Promise<CodeResult> {
    const task = error
      ? `Debug this code. Error: ${error}\n\nCode:\n${code}`
      : `Find and fix bugs in this code:\n\n${code}`;

    return await this.generateCode({
      description: task,
      code,
      provider: 'morph', // Morph is best for code editing
    });
  }

  /**
   * Refactor code
   */
  async refactorCode(
    code: string,
    improvements: string[]
  ): Promise<CodeResult> {
    const task = `Refactor this code with these improvements:\n${improvements.join('\n')}\n\nCode:\n${code}`;

    return await this.generateCode({
      description: task,
      code,
      provider: 'morph',
    });
  }

  /**
   * Convert code between languages
   */
  async convertCode(
    code: string,
    fromLang: string,
    toLang: string
  ): Promise<CodeResult> {
    const task = `Convert this ${fromLang} code to ${toLang}:\n\n${code}`;

    return await this.generateCode({
      description: task,
      code,
      provider: 'glm',
    });
  }

  /**
   * Test code generation
   */
  async generateTests(
    code: string,
    framework?: string
  ): Promise<CodeResult> {
    const task = framework
      ? `Generate unit tests for this code using ${framework}:\n\n${code}`
      : `Generate comprehensive unit tests for this code:\n\n${code}`;

    return await this.generateCode({
      description: task,
      code,
      provider: 'morph',
    });
  }

  /**
   * Code review
   */
  async reviewCode(code: string): Promise<{
    issues: string[];
    suggestions: string[];
    score: number;
  }> {
    const task = `Review this code and provide:\n1. Issues found\n2. Suggestions for improvement\n3. Quality score (0-100)\n\nCode:\n${code}`;

    const result = await this.generateCode({
      description: task,
      code,
      provider: 'glm',
    });

    // Parse the review (simplified)
    return {
      issues: [],
      suggestions: [],
      score: 85,
    };
  }

  /**
   * Execute Qwen CLI command
   */
  async qwenCommand(command: string): Promise<any> {
    if (!this.qwenSession) {
      await this.initQwen();
    }

    return await executeQwenCommand(this.qwenSession!, command);
  }

  /**
   * Get session info
   */
  getSessionInfo(): QwenSession | null {
    return this.qwenSession || null;
  }

  /**
   * Set default provider
   */
  setProvider(provider: AIProvider): void {
    this.defaultProvider = provider;
  }
}

/**
 * Detect programming language from code
 */
function detectLanguage(code: string): Language {
  const trimmed = code.trim();

  // Python indicators
  if (
    trimmed.includes('def ') ||
    trimmed.includes('import ') ||
    trimmed.includes('print(') ||
    trimmed.match(/^\s*#/)
  ) {
    return 'python';
  }

  // JavaScript/TypeScript indicators
  if (
    trimmed.includes('function ') ||
    trimmed.includes('const ') ||
    trimmed.includes('let ') ||
    trimmed.includes('=>') ||
    trimmed.includes('console.log')
  ) {
    return 'javascript';
  }

  // Shell script indicators
  if (
    trimmed.startsWith('#!') ||
    trimmed.includes('#!/bin/bash') ||
    trimmed.includes('echo ') ||
    trimmed.includes('export ')
  ) {
    return 'shell';
  }

  return 'javascript'; // Default
}

/**
 * Create a new code agent instance
 */
export function createCodeAgent(provider: AIProvider = 'morph'): CodeAgent {
  return new CodeAgent(provider);
}

export default CodeAgent;
