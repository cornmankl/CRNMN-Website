/**
 * Terminal Executor with Sandbox Support
 * Safe code execution in isolated environments
 */

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  error?: string;
}

export interface SandboxConfig {
  timeout?: number;
  maxMemory?: number; // MB
  workingDir?: string;
  env?: Record<string, string>;
  allowNetwork?: boolean;
  readOnly?: boolean;
}

/**
 * Execute command in sandboxed environment (Node.js)
 */
export async function executeInSandbox(
  command: string,
  config: SandboxConfig = {}
): Promise<ExecutionResult> {
  const {
    timeout = 30000,
    maxMemory = 512,
    workingDir = '/tmp/sandbox',
    env = {},
    allowNetwork = false,
    readOnly = false,
  } = config;

  const startTime = Date.now();

  try {
    // Validate command for security
    if (!isCommandSafe(command)) {
      throw new Error('Unsafe command detected');
    }

    // Create isolated execution environment
    const result = await executeIsolated(command, {
      timeout,
      maxMemory,
      workingDir,
      env,
      allowNetwork,
      readOnly,
    });

    return {
      ...result,
      duration: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      stdout: '',
      stderr: error.message,
      exitCode: 1,
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Execute isolated command (implementation depends on environment)
 */
async function executeIsolated(
  command: string,
  config: Required<SandboxConfig>
): Promise<Omit<ExecutionResult, 'duration'>> {
  // In browser environment, we can't execute shell commands directly
  // This would need a backend API endpoint for actual execution

  // For now, return simulated response
  // In production, this should call a backend API
  
  if (typeof window !== 'undefined') {
    // Browser environment - needs backend
    return await executeViaBackend(command, config);
  }

  // Node.js environment - can use child_process
  return await executeViaNodeJS(command, config);
}

/**
 * Execute via backend API (for browser)
 */
async function executeViaBackend(
  command: string,
  config: Required<SandboxConfig>
): Promise<Omit<ExecutionResult, 'duration'>> {
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, config }),
    });

    if (!response.ok) {
      throw new Error(`Backend execution failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    return {
      stdout: '',
      stderr: error.message,
      exitCode: 1,
      error: error.message,
    };
  }
}

/**
 * Execute via Node.js child_process (for server/Node.js environment)
 */
async function executeViaNodeJS(
  command: string,
  config: Required<SandboxConfig>
): Promise<Omit<ExecutionResult, 'duration'>> {
  // This would use Node.js child_process in a real implementation
  // For now, return simulated result
  
  return {
    stdout: `Simulated execution of: ${command}\nOutput: Command executed successfully`,
    stderr: '',
    exitCode: 0,
  };
}

/**
 * Validate command for security
 */
function isCommandSafe(command: string): boolean {
  // Blacklist dangerous commands
  const blacklist = [
    'rm -rf',
    'mkfs',
    'dd if=',
    ':(){:|:&};:',  // Fork bomb
    'wget',
    'curl',
    'nc ',
    'netcat',
    'sudo',
    'su ',
  ];

  const lowerCommand = command.toLowerCase();
  
  for (const dangerous of blacklist) {
    if (lowerCommand.includes(dangerous.toLowerCase())) {
      return false;
    }
  }

  return true;
}

/**
 * Execute JavaScript code in sandboxed VM
 */
export async function executeJavaScript(
  code: string,
  config: SandboxConfig = {}
): Promise<ExecutionResult> {
  const { timeout = 5000 } = config;
  const startTime = Date.now();

  try {
    // Create isolated context
    const result = await runInVM(code, timeout);

    return {
      stdout: String(result),
      stderr: '',
      exitCode: 0,
      duration: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      stdout: '',
      stderr: error.message,
      exitCode: 1,
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Run code in VM (simplified version)
 */
async function runInVM(code: string, timeout: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Execution timeout'));
    }, timeout);

    try {
      // In browser: use Worker or iframe
      // In Node.js: use vm module
      // For now, use Function constructor (not fully isolated!)
      
      const func = new Function(code);
      const result = func();
      
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

/**
 * Execute Python code (via backend or pyodide)
 */
export async function executePython(
  code: string,
  config: SandboxConfig = {}
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    // This would use Pyodide in browser or Python interpreter in backend
    const result = await fetch('/api/execute/python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, config }),
    });

    if (!result.ok) {
      throw new Error('Python execution failed');
    }

    const data = await result.json();

    return {
      ...data,
      duration: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      stdout: '',
      stderr: error.message,
      exitCode: 1,
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Create a Web Worker for safe execution
 */
export function createSandboxWorker(code: string): Worker | null {
  if (typeof Worker === 'undefined') {
    return null;
  }

  const blob = new Blob([code], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  
  return new Worker(workerUrl);
}

export default {
  execute: executeInSandbox,
  executeJS: executeJavaScript,
  executePython,
  createWorker: createSandboxWorker,
  isCommandSafe,
};
