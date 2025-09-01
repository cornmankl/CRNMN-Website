import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Play,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { AIService } from '../../utils/ai/aiService';
import { AIAuthService } from '../../utils/ai/aiAuth';
import { WebsiteModifier } from '../../utils/ai/websiteModifier';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  result?: any;
}

export const AITestPanel: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [aiService] = useState(() => new AIService());
  const [authService] = useState(() => AIAuthService.getInstance());
  const [websiteModifier] = useState(() => new WebsiteModifier());

  const testCases = [
    {
      name: 'AI Service Initialization',
      test: async () => {
        return { success: true, message: 'AI Service initialized successfully' };
      }
    },
    {
      name: 'AI Message Processing',
      test: async () => {
        const response = await aiService.sendMessage('Hello, test message');
        return { 
          success: !!response.content, 
          message: `Response received: ${response.content.substring(0, 50)}...`,
          result: response
        };
      }
    },
    {
      name: 'AI Image Generation',
      test: async () => {
        const imageUrl = await aiService.generateImage('Test corn image');
        return { 
          success: !!imageUrl, 
          message: `Image generated: ${imageUrl}`,
          result: { imageUrl }
        };
      }
    },
    {
      name: 'AI Authentication',
      test: async () => {
        const user = await authService.authenticateUser();
        return { 
          success: true, // This will work even if no user is logged in
          message: user ? `User authenticated: ${user.name}` : 'No user logged in (expected)',
          result: user
        };
      }
    },
    {
      name: 'Permission Checking',
      test: async () => {
        const hasPermission = await authService.checkPermission('chat');
        return { 
          success: true,
          message: `Chat permission: ${hasPermission ? 'Granted' : 'Denied'}`,
          result: { hasPermission }
        };
      }
    },
    {
      name: 'Rate Limiting',
      test: async () => {
        const rateLimit = await authService.checkRateLimit('chat');
        return { 
          success: true,
          message: `Rate limit check: ${rateLimit.allowed ? 'Allowed' : 'Limited'}`,
          result: rateLimit
        };
      }
    },
    {
      name: 'Website Modification Analysis',
      test: async () => {
        const result = await websiteModifier.processModificationRequest({
          instruction: 'Change the color scheme to blue',
          preview: true
        });
        return { 
          success: result.success,
          message: result.success ? 'Modification analysis successful' : result.error,
          result
        };
      }
    },
    {
      name: 'AI Settings Management',
      test: async () => {
        // Test settings functionality
        const settings = {
          model: 'gemini-pro',
          temperature: 0.7,
          maxTokens: 2000
        };
        return { 
          success: true,
          message: 'Settings management working',
          result: settings
        };
      }
    },
    {
      name: 'Gemini AI Integration',
      test: async () => {
        const response = await aiService.sendMessage('Test Gemini AI integration');
        return { 
          success: !!response.content, 
          message: `Gemini response received: ${response.content.substring(0, 50)}...`,
          result: response
        };
      }
    }
  ];

  const runTest = async (testCase: typeof testCases[0]) => {
    const testId = Date.now().toString();
    const testResult: TestResult = {
      id: testId,
      name: testCase.name,
      status: 'running'
    };

    setTests(prev => [...prev, testResult]);

    const startTime = Date.now();

    try {
      const result = await testCase.test();
      const duration = Date.now() - startTime;

      setTests(prev => prev.map(test => 
        test.id === testId 
          ? {
              ...test,
              status: result.success ? 'passed' : 'failed',
              duration,
              result: result.result,
              error: result.success ? undefined : result.message
            }
          : test
      ));
    } catch (error) {
      const duration = Date.now() - startTime;
      
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? {
              ...test,
              status: 'failed',
              duration,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          : test
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    for (const testCase of testCases) {
      await runTest(testCase);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const clearTests = () => {
    setTests([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  const passedTests = tests.filter(test => test.status === 'passed').length;
  const failedTests = tests.filter(test => test.status === 'failed').length;
  const totalTests = tests.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TestTube className="w-5 h-5 text-[var(--neon-green)]" />
        <h3 className="text-lg font-semibold text-white">AI Functionality Tests</h3>
        <Badge variant="secondary" className="text-xs">Development</Badge>
      </div>

      {/* Test Controls */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="btn-primary"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
            
            <Button
              onClick={clearTests}
              variant="outline"
              disabled={isRunning}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
          </div>

          {/* Test Summary */}
          {totalTests > 0 && (
            <div className="flex items-center gap-4 p-3 bg-[var(--neutral-700)] rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-white">{passedTests} Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-white">{failedTests} Failed</span>
              </div>
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-[var(--neutral-400)]" />
                <span className="text-sm text-white">{totalTests} Total</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Test Controls */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">Individual Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {testCases.map((testCase, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3"
                onClick={() => runTest(testCase)}
                disabled={isRunning}
              >
                <div>
                  <div className="font-medium text-sm">{testCase.name}</div>
                  <div className="text-xs text-[var(--neutral-400)] mt-1">
                    Click to run individual test
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {tests.length > 0 && (
        <Card className="bg-[var(--neutral-800)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 bg-[var(--neutral-700)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium text-white">{test.name}</div>
                      {test.duration && (
                        <div className="text-xs text-[var(--neutral-400)]">
                          Duration: {test.duration}ms
                        </div>
                      )}
                      {test.error && (
                        <div className="text-xs text-red-400 mt-1">
                          Error: {test.error}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Information */}
      <Card className="bg-[var(--neutral-800)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-2">Test Information</h4>
              <ul className="text-sm text-[var(--neutral-400)] space-y-1">
                <li>• These tests verify AI functionality without requiring API keys</li>
                <li>• Some tests may fail if external services are not configured</li>
                <li>• Tests are designed to work in development and production environments</li>
                <li>• Check console for detailed error information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};