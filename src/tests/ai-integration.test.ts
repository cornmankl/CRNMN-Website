/**
 * AI Integration Tests
 * Test all AI services and features
 */

import { sendGLMChat, chatWithWebSearch } from '../lib/glm-ai';
import { sendMorphChat, applyCodeEdit, generateCodeEmbedding } from '../lib/morph-ai';
import { streamGLMChat, RESTAURANT_TOOLS, executeToolFunction } from '../lib/glm-stream';
import { createCodeAgent } from '../lib/code-agent';
import { executeInSandbox, executeJavaScript } from '../lib/terminal-executor';
import { initQwenCLI, executeQwenCommand } from '../lib/qwen-cli';

/**
 * Test GLM-4.6 Chat
 */
export async function testGLMChat() {
  console.log('🧪 Testing GLM-4.6 Chat...');
  
  try {
    const response = await sendGLMChat([
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: 'Say "Hello from GLM-4.6!" if you can read this.',
      },
    ]);
    
    console.log('✅ GLM Chat Response:', response);
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ GLM Chat Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test GLM Web Search
 */
export async function testGLMWebSearch() {
  console.log('🧪 Testing GLM Web Search...');
  
  try {
    const result = await chatWithWebSearch('Latest food trends in Malaysia 2025', {
      count: 3,
      searchRecencyFilter: 'month',
    });
    
    console.log('✅ Web Search Answer:', result.answer.substring(0, 100) + '...');
    console.log('✅ Sources:', result.sources.length);
    return { success: true, result };
  } catch (error: any) {
    console.error('❌ Web Search Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test GLM Streaming
 */
export async function testGLMStreaming() {
  console.log('🧪 Testing GLM Streaming...');
  
  try {
    let reasoning = '';
    let content = '';
    const toolCalls: any[] = [];
    
    await streamGLMChat(
      [{ role: 'user', content: 'Show me menu items under RM10' }],
      {
        onReasoning: (text) => { reasoning += text; },
        onContent: (text) => { content += text; },
        onToolCall: (tool) => { toolCalls.push(tool); },
        onComplete: (result) => {
          console.log('✅ Streaming Complete');
          console.log('  Reasoning:', reasoning.length, 'chars');
          console.log('  Content:', content.length, 'chars');
          console.log('  Tools:', toolCalls.length);
        },
      },
      { tools: RESTAURANT_TOOLS }
    );
    
    return { success: true, reasoning, content, toolCalls };
  } catch (error: any) {
    console.error('❌ Streaming Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test MorphLLM Chat
 */
export async function testMorphChat() {
  console.log('🧪 Testing MorphLLM Chat...');
  
  try {
    const response = await sendMorphChat([
      {
        role: 'user',
        content: 'Write a JavaScript function to check if a number is prime',
      },
    ], {
      model: 'morph-v3-fast',
    });
    
    console.log('✅ Morph Chat Response:', response.substring(0, 100) + '...');
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ Morph Chat Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Morph Apply (Code Editing)
 */
export async function testMorphApply() {
  console.log('🧪 Testing Morph Apply...');
  
  const originalCode = `
function divide(a, b) {
  return a / b;
}
`;
  
  try {
    const editedCode = await applyCodeEdit({
      instruction: 'Add error handling for division by zero',
      code: originalCode,
      update: '',
    });
    
    console.log('✅ Original Code:', originalCode.trim());
    console.log('✅ Edited Code:', editedCode.substring(0, 150) + '...');
    return { success: true, original: originalCode, edited: editedCode };
  } catch (error: any) {
    console.error('❌ Morph Apply Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Code Embeddings
 */
export async function testCodeEmbeddings() {
  console.log('🧪 Testing Code Embeddings...');
  
  try {
    const result = await generateCodeEmbedding([
      'function add(a, b) { return a + b; }',
      'const multiply = (x, y) => x * y;',
    ]);
    
    console.log('✅ Embeddings Generated:', result.data.length);
    console.log('✅ Dimensions:', result.data[0].embedding.length);
    return { success: true, result };
  } catch (error: any) {
    console.error('❌ Embeddings Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Sandbox Execution
 */
export async function testSandbox() {
  console.log('🧪 Testing Sandbox Execution...');
  
  try {
    const result = await executeInSandbox('echo "Hello from sandbox"', {
      timeout: 5000,
      allowNetwork: false,
      readOnly: true,
    });
    
    console.log('✅ Sandbox Output:', result.stdout);
    console.log('✅ Exit Code:', result.exitCode);
    console.log('✅ Duration:', result.duration, 'ms');
    return { success: result.exitCode === 0, result };
  } catch (error: any) {
    console.error('❌ Sandbox Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test JavaScript Execution
 */
export async function testJavaScriptExecution() {
  console.log('🧪 Testing JavaScript Execution...');
  
  const code = `
const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
factorial(5);
`;
  
  try {
    const result = await executeJavaScript(code, {
      timeout: 3000,
    });
    
    console.log('✅ JS Result:', result.stdout);
    console.log('✅ Exit Code:', result.exitCode);
    return { success: result.exitCode === 0, result };
  } catch (error: any) {
    console.error('❌ JS Execution Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Qwen CLI
 */
export async function testQwenCLI() {
  console.log('🧪 Testing Qwen CLI...');
  
  try {
    const session = await initQwenCLI({
      sandboxEnabled: true,
      theme: 'dark',
    });
    
    // Test save command
    const saveResult = await executeQwenCommand(session, '/chat save test-checkpoint');
    console.log('✅ Save Result:', saveResult.stdout);
    
    // Test list command
    const listResult = await executeQwenCommand(session, '/chat list');
    console.log('✅ List Result:', listResult.stdout);
    
    return { success: true, session };
  } catch (error: any) {
    console.error('❌ Qwen CLI Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Code Agent
 */
export async function testCodeAgent() {
  console.log('🧪 Testing Code Agent...');
  
  try {
    const agent = createCodeAgent('morph');
    
    // Test code generation
    const result = await agent.generateCode({
      description: 'Create a function to calculate fibonacci numbers',
      language: 'javascript',
      sandbox: false,
    });
    
    console.log('✅ Generated Code:', result.code.substring(0, 100) + '...');
    return { success: true, result };
  } catch (error: any) {
    console.error('❌ Code Agent Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Tool Execution with Supabase
 */
export async function testToolExecution() {
  console.log('🧪 Testing Tool Execution...');
  
  try {
    // Test get_menu_items
    const menuResult = await executeToolFunction('get_menu_items', {
      category: 'Nasi & Rice Meals',
      max_results: 5,
    });
    
    console.log('✅ Menu Items Retrieved:', menuResult.count);
    
    // Test get_price_range
    const priceResult = await executeToolFunction('get_price_range', {
      min_price: 5.0,
      max_price: 10.0,
    });
    
    console.log('✅ Items in Price Range:', priceResult.count);
    
    // Test get_restaurant_info
    const infoResult = await executeToolFunction('get_restaurant_info', {
      info_type: 'hours',
    });
    
    console.log('✅ Restaurant Info:', infoResult.hours);
    
    return { success: true, menuResult, priceResult, infoResult };
  } catch (error: any) {
    console.error('❌ Tool Execution Failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Run All Tests
 */
export async function runAllTests() {
  console.log('🚀 Starting AI Integration Tests\n');
  
  const results = {
    glmChat: await testGLMChat(),
    glmWebSearch: await testGLMWebSearch(),
    glmStreaming: await testGLMStreaming(),
    morphChat: await testMorphChat(),
    morphApply: await testMorphApply(),
    codeEmbeddings: await testCodeEmbeddings(),
    sandbox: await testSandbox(),
    jsExecution: await testJavaScriptExecution(),
    qwenCLI: await testQwenCLI(),
    codeAgent: await testCodeAgent(),
    toolExecution: await testToolExecution(),
  };
  
  // Summary
  const passed = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️ Some tests failed. Check logs above.');
  }
  
  return results;
}

// Export for manual testing
export default {
  testGLMChat,
  testGLMWebSearch,
  testGLMStreaming,
  testMorphChat,
  testMorphApply,
  testCodeEmbeddings,
  testSandbox,
  testJavaScriptExecution,
  testQwenCLI,
  testCodeAgent,
  testToolExecution,
  runAllTests,
};
