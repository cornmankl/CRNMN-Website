import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Settings, 
  Wand2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Loader2,
  AlertTriangle,
  History,
  BarChart3
} from 'lucide-react';
import { useWebsiteModifier, ModificationRequest } from '../../utils/ai/websiteModifier';
import { AIAuthGuard } from './AIAuthGuard';

export const WebsiteModifier: React.FC = () => {
  const [instruction, setInstruction] = useState('');
  const [context, setContext] = useState('');
  const [target, setTarget] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [previewMode, setPreviewMode] = useState(true);
  const [result, setResult] = useState<any>(null);
  
  const { processModification, revertModification, getStats, history, isProcessing } = useWebsiteModifier();

  const handleModify = async () => {
    if (!instruction.trim()) return;

    const request: ModificationRequest = {
      instruction,
      context: context || 'CRNMN corn delivery website',
      target: target || 'general',
      priority,
      preview: previewMode
    };

    const result = await processModification(request);
    setResult(result);
  };

  const handleRevert = async (modificationId: string) => {
    const result = await revertModification(modificationId);
    if (result.success) {
      setResult(null);
    }
  };

  const stats = getStats();

  const presetInstructions = [
    'Change the color scheme to a warmer tone',
    'Add a new section for customer testimonials',
    'Make the menu items more visually appealing',
    'Add a dark mode toggle',
    'Improve mobile responsiveness',
    'Add social media integration',
    'Create a loyalty program section',
    'Add more interactive elements'
  ];

  return (
    <AIAuthGuard requiredPermission="websiteModification">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-[var(--neon-green)]" />
          <h3 className="text-lg font-semibold text-white">Website Modifier</h3>
          <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
        </div>

        {/* Modification Form */}
        <Card className="bg-[var(--neutral-800)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Modification Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Instruction</label>
              <Textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Describe what you want to modify on the website..."
                className="min-h-[100px] bg-[var(--neutral-700)] border-[var(--neutral-600)]"
                disabled={isProcessing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Context</label>
                <Input
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., homepage, menu section"
                  className="bg-[var(--neutral-700)] border-[var(--neutral-600)]"
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Target</label>
                <Input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g., header, footer, main content"
                  className="bg-[var(--neutral-700)] border-[var(--neutral-600)]"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Priority</label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger className="bg-[var(--neutral-700)] border-[var(--neutral-600)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode(true)}
                    className={previewMode ? "neon-bg text-black" : ""}
                    disabled={isProcessing}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant={!previewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode(false)}
                    className={!previewMode ? "neon-bg text-black" : ""}
                    disabled={isProcessing}
                  >
                    <Wand2 className="w-4 h-4 mr-1" />
                    Apply
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleModify}
              disabled={!instruction.trim() || isProcessing}
              className="btn-primary w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  {previewMode ? 'Preview Changes' : 'Apply Changes'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preset Instructions */}
        <Card className="bg-[var(--neutral-800)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Quick Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {presetInstructions.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto p-3 text-xs"
                  onClick={() => setInstruction(preset)}
                  disabled={isProcessing}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="bg-[var(--neutral-800)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                {previewMode ? 'Preview Results' : 'Modification Results'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.success ? (
                <>
                  {previewMode && result.preview && (
                    <div className="bg-[var(--neutral-700)] rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Preview Summary</h4>
                      <p className="text-sm text-[var(--neutral-300)] mb-3">
                        {result.preview.summary}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Impact: {result.preview.estimatedImpact}</Badge>
                        <Badge variant="secondary">
                          {result.preview.modifications.length} changes
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Applied Modifications</h4>
                    {result.modifications.map((mod: any) => (
                      <div key={mod.id} className="flex items-center justify-between p-3 bg-[var(--neutral-700)] rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {mod.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {mod.action}
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--neutral-300)]">
                            {mod.description}
                          </p>
                          <p className="text-xs text-[var(--neutral-400)] mt-1">
                            Target: {mod.target}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {mod.status === 'applied' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {mod.status === 'failed' && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          {mod.status === 'applied' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevert(mod.id)}
                              className="h-6 w-6 p-0"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-red-400">Modification Failed</span>
                  </div>
                  <p className="text-sm text-red-300">{result.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-[var(--neutral-800)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--neutral-400)]">Total</span>
                <span className="text-sm font-semibold text-white">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--neutral-400)]">Applied</span>
                <span className="text-sm font-semibold text-green-500">{stats.applied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--neutral-400)]">Failed</span>
                <span className="text-sm font-semibold text-red-500">{stats.failed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--neutral-400)]">Reverted</span>
                <span className="text-sm font-semibold text-yellow-500">{stats.reverted}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--neutral-800)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.slice(0, 3).map((mod) => (
                <div key={mod.id} className="flex items-center justify-between py-2 border-b border-[var(--neutral-700)] last:border-b-0">
                  <div className="flex-1">
                    <p className="text-xs text-[var(--neutral-300)] line-clamp-1">
                      {mod.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {mod.type}
                      </Badge>
                      <span className="text-xs text-[var(--neutral-400)]">
                        {mod.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2">
                    {mod.status === 'applied' && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                    {mod.status === 'failed' && (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    {mod.status === 'reverted' && (
                      <RotateCcw className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-sm text-[var(--neutral-400)] text-center py-4">
                  No modifications yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AIAuthGuard>
  );
};