import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Image, 
  Download, 
   
  Sparkles, 
  Loader2,
  Copy,
  Check,
  Palette,
  Camera,
  Wand2
} from 'lucide-react';
import { AIService } from '../../utils/ai/aiService';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: Date;
}

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<'realistic' | 'artistic' | 'menu'>('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [copiedImageId, setCopiedImageId] = useState<string | null>(null);
  
  const aiService = new AIService();

  const styleOptions = [
    { value: 'realistic', label: 'Photorealistic', icon: Camera, description: 'High-quality food photography' },
    { value: 'artistic', label: 'Artistic', icon: Palette, description: 'Creative illustrations' },
    { value: 'menu', label: 'Menu Style', icon: Wand2, description: 'Professional menu photos' }
  ];

  const presetPrompts = [
    'Delicious corn with melted cheese and butter',
    'Traditional Malaysian corn with condensed milk',
    'Spicy jalapeño corn with herbs',
    'Chocolate drizzled corn dessert',
    'Premium cheddar cheese corn',
    'Caramel glazed sweet corn',
    'Mexican street corn with lime',
    'Truffle parmesan gourmet corn'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    
    try {
      const imageUrl = await aiService.generateImage(prompt, style);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt,
        style,
        timestamp: new Date()
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      setPrompt('');
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetPrompt = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  const copyImageUrl = async (url: string, imageId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedImageId(imageId);
      setTimeout(() => setCopiedImageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadImage = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `cornman-${prompt.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5 text-[var(--neon-green)]" />
        <h3 className="text-lg font-semibold text-white">AI Image Generator</h3>
        <Badge variant="secondary" className="text-xs">Powered by AI</Badge>
      </div>

      {/* Style Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Image Style</label>
        <div className="grid grid-cols-3 gap-2">
          {styleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={style === option.value ? "default" : "outline"}
                className={`h-auto p-3 flex flex-col items-center gap-2 ${
                  style === option.value ? 'neon-bg text-black' : ''
                }`}
                onClick={() => setStyle(option.value as any)}
              >
                <Icon className="w-4 h-4" />
                <div className="text-center">
                  <div className="text-xs font-semibold">{option.label}</div>
                  <div className="text-xs opacity-70">{option.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Describe your corn image</label>
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Delicious corn with melted cheese and herbs..."
            className="flex-1"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn-primary px-4"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Preset Prompts */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Quick Prompts</label>
        <div className="grid grid-cols-2 gap-2">
          {presetPrompts.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-left justify-start h-auto p-2 text-xs"
              onClick={() => handlePresetPrompt(preset)}
              disabled={isGenerating}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-white">Generated Images</h4>
            <Badge variant="secondary">{generatedImages.length} images</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((image) => (
              <Card key={image.id} className="bg-[var(--neutral-800)]">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyImageUrl(image.url, image.id)}
                        className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                      >
                        {copiedImageId === image.id ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <Copy className="w-3 h-3 text-white" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <Download className="w-3 h-3 text-white" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <p className="text-sm text-white font-medium line-clamp-2">
                      {image.prompt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {styleOptions.find(s => s.value === image.style)?.label}
                      </Badge>
                      <span className="text-xs text-[var(--neutral-400)]">
                        {image.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="bg-[var(--neutral-800)]">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-white mb-2">💡 Tips for Better Images</h4>
          <ul className="text-xs text-[var(--neutral-400)] space-y-1">
            <li>• Be specific about ingredients and presentation</li>
            <li>• Mention lighting preferences (natural, warm, bright)</li>
            <li>• Include style keywords (rustic, modern, traditional)</li>
            <li>• Describe the setting (restaurant, street food, home)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};