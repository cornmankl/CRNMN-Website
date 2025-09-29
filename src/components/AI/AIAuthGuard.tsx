import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Lock, 
  Crown, 
  Star, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Zap
} from 'lucide-react';
import { useAIAuth, AIUser } from '../../utils/ai/aiAuth';

interface AIAuthGuardProps {
  children: React.ReactNode;
  requiredPermission?: 'chat' | 'imageGeneration' | 'websiteModification' | 'advancedFeatures';
  fallback?: React.ReactNode;
}

export const AIAuthGuard: React.FC<AIAuthGuardProps> = ({ 
  children, 
  requiredPermission = 'chat',
  fallback 
}) => {
  const { user, loading, checkPermission } = useAIAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const verifyPermission = async () => {
      if (!user) {
        setHasPermission(false);
        return;
      }

      setChecking(true);
      const permission = await checkPermission(requiredPermission);
      setHasPermission(permission);
      setChecking(false);
    };

    verifyPermission();
  }, [user, requiredPermission, checkPermission]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)] mx-auto mb-4" />
          <p className="text-[var(--neutral-400)]">Verifying AI access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || <LoginPrompt />;
  }

  if (hasPermission === false) {
    return fallback || <PermissionDenied user={user} requiredPermission={requiredPermission} />;
  }

  return <>{children}</>;
};

const LoginPrompt: React.FC = () => {
  return (
    <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--neutral-700)] flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-[var(--neutral-400)]" />
        </div>
        <CardTitle className="text-white">AI Assistant Access Required</CardTitle>
        <p className="text-[var(--neutral-400)]">
          Please sign in to access the AI Assistant features
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-white">AI Features Available:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-[var(--neutral-300)]">Chat Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-[var(--neutral-300)]">Menu Help</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-[var(--neutral-300)]">Order Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-[var(--neutral-300)]">Delivery Info</span>
            </div>
          </div>
        </div>
        
        <Button className="btn-primary w-full">
          Sign In to Access AI
        </Button>
        
        <p className="text-xs text-[var(--neutral-500)]">
          Free access to basic AI features. Premium features available with account upgrade.
        </p>
      </CardContent>
    </Card>
  );
};

const PermissionDenied: React.FC<{ 
  user: AIUser; 
  requiredPermission: string 
}> = ({ user, requiredPermission }) => {
  const getPermissionInfo = (permission: string) => {
    switch (permission) {
      case 'imageGeneration':
        return {
          title: 'Image Generation',
          description: 'Create custom corn images with AI',
          icon: <Zap className="w-6 h-6" />,
          requiredRole: 'premium'
        };
      case 'websiteModification':
        return {
          title: 'Website Modification',
          description: 'Modify website content with AI assistance',
          icon: <Shield className="w-6 h-6" />,
          requiredRole: 'admin'
        };
      case 'advancedFeatures':
        return {
          title: 'Advanced Features',
          description: 'Access to premium AI capabilities',
          icon: <Crown className="w-6 h-6" />,
          requiredRole: 'premium'
        };
      default:
        return {
          title: 'Feature Access',
          description: 'This feature requires special permissions',
          icon: <Lock className="w-6 h-6" />,
          requiredRole: 'premium'
        };
    }
  };

  const permissionInfo = getPermissionInfo(requiredPermission);
  const canUpgrade = user.role === 'user' && permissionInfo.requiredRole === 'premium';

  return (
    <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <CardTitle className="text-white">Access Restricted</CardTitle>
        <p className="text-[var(--neutral-400)]">
          This feature requires {permissionInfo.requiredRole} access
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {permissionInfo.icon}
            <span className="font-semibold text-white">{permissionInfo.title}</span>
          </div>
          <p className="text-sm text-[var(--neutral-400)] mb-4">
            {permissionInfo.description}
          </p>
        </div>

        <div className="bg-[var(--neutral-700)] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--neutral-300)]">Current Plan:</span>
            <Badge variant={user.role === 'user' ? 'secondary' : 'default'}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--neutral-300)]">Required Plan:</span>
            <Badge variant="outline" className="text-[var(--neon-green)] border-[var(--neon-green)]">
              {permissionInfo.requiredRole.charAt(0).toUpperCase() + permissionInfo.requiredRole.slice(1)}
            </Badge>
          </div>
        </div>

        {canUpgrade && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-[var(--neon-green)]/10 to-transparent border border-[var(--neon-green)]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-[var(--neon-green)]" />
                <span className="font-semibold text-white">Upgrade to Premium</span>
              </div>
              <ul className="text-sm text-[var(--neutral-300)] space-y-1">
                <li>• Unlimited AI image generation</li>
                <li>• Advanced AI features</li>
                <li>• Priority support</li>
                <li>• Custom AI models</li>
              </ul>
            </div>
            
            <Button className="btn-primary w-full">
              <Star className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        )}

        {!canUpgrade && (
          <div className="text-center">
            <p className="text-sm text-[var(--neutral-400)] mb-4">
              Contact administrator for access to this feature
            </p>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-[var(--neutral-500)]">
            Need help? Contact our support team for assistance
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Usage Stats Component
export const AIUsageStats: React.FC<{ user: AIUser }> = ({ user }) => {
  const { getUsageStats } = useAIAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const usageStats = await getUsageStats();
      setStats(usageStats);
      setLoading(false);
    };

    fetchStats();
  }, [getUsageStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-4 h-4 animate-spin text-[var(--neon-green)]" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <Card className="bg-[var(--neutral-800)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Usage Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[var(--neon-green)]">
              {stats.daily.chat}
            </div>
            <div className="text-xs text-[var(--neutral-400)]">Today</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--neon-green)]">
              {stats.weekly.chat}
            </div>
            <div className="text-xs text-[var(--neutral-400)]">This Week</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--neon-green)]">
              {stats.monthly.chat}
            </div>
            <div className="text-xs text-[var(--neutral-400)]">This Month</div>
          </div>
        </div>
        
        {user.role !== 'user' && (
          <div className="pt-3 border-t border-[var(--neutral-700)]">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm font-semibold text-white">
                  {stats.monthly.image}
                </div>
                <div className="text-xs text-[var(--neutral-400)]">Images</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {stats.monthly.modification}
                </div>
                <div className="text-xs text-[var(--neutral-400)]">Modifications</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};