import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { 
  Sparkles, 
  Image, 
  FileText, 
  Code, 
  Brain,
  Loader2,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { AIService } from '../../utils/ai/aiService';

interface GeminiFeaturesProps {
  onResult?: (result: any) => void;
}

export const GeminiFeatures: React.FC<GeminiFeaturesProps> = ({ onResult }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const aiService = new AIService();

  const geminiFeatures = [
    {
      id: 'text-generation',
      title: 'Text Generation',
      description: 'Generate creative and informative text content',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'code-generation',
      title: 'Code Generation',
      description: 'Generate code snippets and programming solutions',
      icon: Code,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'creative-writing',
      title: 'Creative Writing',
      description: 'Generate creative stories, poems, and content',
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'analysis',
      title: 'Data Analysis',
      description: 'Analyze and interpret complex information',
      icon: Brain,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const presetPrompts = [
    {
      category: 'Corn Menu',
      prompts: [
        'Write a creative description for our new chocolate corn dessert',
        'Generate marketing copy for our premium cheddar cheese corn',
        'Create a story about the origin of Malaysian corn traditions'
      ]
    },
    {
      category: 'Code Help',
      prompts: [
        'Generate a React component for a corn product card',
        'Write a function to calculate delivery time based on distance',
        'Create a TypeScript interface for our menu items'
      ]
    },
    {
      category: 'Business',
      prompts: [
        'Analyze the potential market for gourmet corn in Malaysia',
        'Generate ideas for customer loyalty programs',
        'Write a business plan for expanding CRNMN to other cities'
      ]
    }
  ];

  const handleGenerate = async (featureType: string) => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    
    try {
      const context = {
        context: 'gemini_advanced_features',
        userPreferences: {
          categories: ['corn', 'food', 'business'],
          priceRange: [0, 1000],
          tags: ['premium', 'gourmet']
        }
      };

      const response = await aiService.sendMessage(prompt, context);
      
      const result = {
        type: featureType,
        prompt,
        response: response.content,
        model: response.model,
        timestamp: new Date(),
        processingTime: response.processingTime
      };
      
      setResult(result);
      onResult?.(result);
    } catch (error) {
      console.error('Generation failed:', error);
      setResult({
        type: featureType,
        prompt,
        response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: 'gemini-pro',
        timestamp: new Date(),
        error: true
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadResult = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[var(--neon-green)]" />
        <h3 className="text-lg font-semibold text-white">Gemini AI Features</h3>
        <Badge variant="secondary" className="text-xs">Advanced</Badge>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {geminiFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.id}
              className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neon-green)] transition-colors cursor-pointer"
              onClick={() => setPrompt(`Generate ${feature.title.toLowerCase()} for: `)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-[var(--neutral-400)]">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Prompt Input */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white">Gemini AI Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt for Gemini AI..."
            className="min-h-[120px] bg-[var(--neutral-700)] border-[var(--neutral-600)]"
            disabled={isGenerating}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleGenerate('text-generation')}
              disabled={!prompt.trim() || isGenerating}
              className="btn-primary flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with Gemini
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preset Prompts */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white">Quick Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {presetPrompts.map((category, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-2">{category.category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {category.prompts.map((preset, presetIndex) => (
                    <Button
                      key={presetIndex}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto p-3 text-xs"
                      onClick={() => setPrompt(preset)}
                      disabled={isGenerating}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="bg-[var(--neutral-800)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Gemini AI Result</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.response)}
                  className="h-8 w-8 p-0"
                >
                  {copiedText === result.response ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadResult(result.response, `gemini-result-${Date.now()}.txt`)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[var(--neutral-700)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {result.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {result.model}
                </Badge>
                {result.processingTime && (
                  <Badge variant="outline" className="text-xs">
                    {result.processingTime}ms
                  </Badge>
                )}
              </div>
              
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-white font-mono">
                  {result.response}
                </pre>
              </div>
            </div>
            
            <div className="text-xs text-[var(--neutral-400)]">
              Generated on {result.timestamp.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gemini Info */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">About Gemini Pro</h4>
              <p className="text-sm text-[var(--neutral-300)] mb-3">
                Gemini Pro is Google's most advanced AI model, capable of understanding and generating 
                complex text, code, and creative content. It's optimized for reasoning, creativity, and 
                multilingual capabilities.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Multilingual</Badge>
                <Badge variant="outline" className="text-xs">Code Generation</Badge>
                <Badge variant="outline" className="text-xs">Creative Writing</Badge>
                <Badge variant="outline" className="text-xs">Analysis</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};