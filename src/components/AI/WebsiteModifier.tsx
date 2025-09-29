import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Wand2, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useWebsiteModifier, ModificationRequest } from '../../utils/ai/websiteModifier';

export const WebsiteModifier: React.FC = () => {
  const [instruction, setInstruction] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { processModification, isProcessing, history, getStats } = useWebsiteModifier();
  const stats = getStats();

  const handleModify = async () => {
    if (!instruction.trim()) return;
    
    setError(null);
    setResult(null);
    
    try {
      const request: ModificationRequest = {
        instruction,
        preview: isPreviewMode
      };
      
      const response = await processModification(request);
      
      if (response.success) {
        setResult(response);
      } else {
        setError(response.error || 'Failed to process modification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleApplyPreview = async () => {
    if (!result?.preview) return;
    
    setError(null);
    setResult(null);
    
    try {
      const request: ModificationRequest = {
        instruction,
        preview: false
      };
      
      const response = await processModification(request);
      
      if (response.success) {
        setResult({ ...response, applied: true });
      } else {
        setError(response.error || 'Failed to apply modification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-[var(--neon-green)]" />
        <h3 className="text-lg font-semibold text-white">Website Modifier</h3>
        <Badge variant="secondary" className="text-xs">Admin Only</Badge>
      </div>

      {/* Stats */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white text-sm">Modification Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-[var(--neutral-400)]">Total</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-500">{stats.applied}</div>
            <div className="text-xs text-[var(--neutral-400)]">Applied</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-500">{stats.failed}</div>
            <div className="text-xs text-[var(--neutral-400)]">Failed</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-500">{stats.reverted}</div>
            <div className="text-xs text-[var(--neutral-400)]">Reverted</div>
          </div>
        </CardContent>
      </Card>

      {/* Modification Form */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Modify Website</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="text-xs"
            >
              {isPreviewMode ? (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Preview Mode
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Apply Changes
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Describe the website modification you want to make... (Admin access required)"
            className="min-h-[120px] bg-[var(--neutral-700)] border-[var(--neutral-600)]"
            disabled={isProcessing}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={handleModify}
              disabled={!instruction.trim() || isProcessing}
              className="btn-primary flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isPreviewMode ? 'Preview Changes' : 'Apply Changes'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview/Result */}
      {result && (
        <Card className="bg-[var(--neutral-800)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>
                {result.applied ? 'Changes Applied' : isPreviewMode ? 'Preview' : 'Result'}
              </span>
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.preview ? (
              <div className="bg-[var(--neutral-700)] rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Preview Summary</h4>
                <p className="text-sm text-[var(--neutral-300)] mb-4">
                  {result.preview.summary}
                </p>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-white">Modifications</h5>
                  {result.preview.modifications.map((mod: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {mod.type}
                      </Badge>
                      <span className="text-[var(--neutral-300)]">
                        {mod.description}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={handleApplyPreview}
                  className="btn-primary mt-4"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    'Apply These Changes'
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-[var(--neutral-700)] rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-white font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="bg-red-900/20 border-red-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="bg-[var(--neutral-800)]">
          <CardHeader>
            <CardTitle className="text-white">Modification History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.slice(-5).reverse().map((modification) => (
                <div 
                  key={modification.id} 
                  className="flex items-center justify-between p-3 bg-[var(--neutral-700)] rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {modification.type}
                      </Badge>
                      <span className="text-sm font-medium text-white">
                        {modification.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--neutral-400)]">
                      <span>
                        {modification.timestamp.toLocaleTimeString()}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{modification.action}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      modification.status === 'applied' ? 'default' :
                      modification.status === 'failed' ? 'destructive' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {modification.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};