import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Sparkles, 
  Fingerprint, 
  Mic, 
  QrCode, 
  Wallet, 
  Bot, 
  Shield, 
  Zap,
  Crown,
  Star,
  Gift,
  Users,
  TrendingUp
} from 'lucide-react';
import { Auth2025Modal } from '../Auth2025Modal';

export function AuthDemo2025() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  const features2025 = [
    {
      icon: Bot,
      title: 'AI-Powered Assistance',
      description: 'Smart form completion with real-time guidance',
      color: 'from-blue-500 to-purple-600',
      status: '✅ Active'
    },
    {
      icon: Fingerprint,
      title: 'Biometric Authentication',
      description: 'Face ID, Touch ID, and Windows Hello support',
      color: 'from-green-500 to-blue-600',
      status: '🔒 Secure'
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Hands-free authentication with voice recognition',
      color: 'from-purple-500 to-pink-600',
      status: '🎤 Ready'
    },
    {
      icon: Wallet,
      title: 'Web3 Integration',
      description: 'MetaMask, NFT benefits, and crypto rewards',
      color: 'from-orange-500 to-red-600',
      status: '🚀 Live'
    },
    {
      icon: Shield,
      title: 'Behavioral Security',
      description: 'Typing pattern analysis and risk assessment',
      color: 'from-emerald-500 to-teal-600',
      status: '🛡️ Active'
    },
    {
      icon: QrCode,
      title: 'QR Code Access',
      description: 'Mobile app instant authentication',
      color: 'from-cyan-500 to-blue-600',
      status: '📱 Ready'
    }
  ];

  const stats = {
    activeUsers: '12.5k',
    todaySignups: 47,
    securityLevel: 'Maximum',
    aiAccuracy: '99.2%'
  };

  return (
    <div className="min-h-screen bg-[var(--brand-black)] p-4">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12 space-y-6">
          {/* Animated Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-green)]/20 via-blue-500/20 to-purple-500/20 blur-3xl" />
            <h1 className="relative text-6xl font-bold bg-gradient-to-r from-[var(--neon-green)] via-blue-400 to-purple-400 bg-clip-text text-transparent">
              CRNMN Auth 2025
            </h1>
          </div>
          
          <p className="text-xl text-[var(--neutral-300)] max-w-2xl mx-auto">
            Experience the future of authentication with AI assistance, biometric security, 
            voice commands, Web3 integration, and behavioral analysis.
          </p>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-[var(--neutral-800)] rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-[var(--neon-green)] mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{stats.activeUsers}</div>
              <div className="text-xs text-[var(--neutral-400)]">Active Users</div>
            </div>
            <div className="bg-[var(--neutral-800)] rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{stats.todaySignups}</div>
              <div className="text-xs text-[var(--neutral-400)]">Today's Signups</div>
            </div>
            <div className="bg-[var(--neutral-800)] rounded-xl p-4 text-center">
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{stats.securityLevel}</div>
              <div className="text-xs text-[var(--neutral-400)]">Security Level</div>
            </div>
            <div className="bg-[var(--neutral-800)] rounded-xl p-4 text-center">
              <Bot className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{stats.aiAccuracy}</div>
              <div className="text-xs text-[var(--neutral-400)]">AI Accuracy</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              onClick={() => setShowAuth(true)}
              className={`
                relative px-8 py-4 text-lg font-bold text-black
                bg-gradient-to-r from-[var(--neon-green)] to-green-400
                hover:from-green-400 hover:to-[var(--neon-green)]
                transition-all duration-300 hover:scale-105
                shadow-lg hover:shadow-xl
                rounded-2xl
              `}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Experience Auth 2025
            </Button>
            
            {user && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-green-400 text-sm font-medium">✅ Authentication Successful!</p>
                <p className="text-white text-sm">Welcome, {user.name}!</p>
                <p className="text-[var(--neutral-400)] text-xs">
                  Method: {user.authMethod} • Security: {user.securityLevel || 'High'}
                </p>
                {user.loyaltyPoints && (
                  <div className="flex items-center gap-1 mt-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">
                      {user.loyaltyPoints} Loyalty Points
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUser(null)}
                  className="text-xs text-[var(--neutral-400)] mt-2 p-0"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features2025.map((feature, index) => (
            <Card key={index} className="bg-[var(--neutral-900)] border-[var(--neutral-800)] overflow-hidden group hover:border-[var(--neutral-700)] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="text-xs bg-[var(--neon-green)]/20 text-[var(--neon-green)]">
                    {feature.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white text-lg mb-2">{feature.title}</CardTitle>
                <p className="text-[var(--neutral-400)] text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Features List */}
        <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-[var(--neon-green)]" />
              2025 Authentication Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[var(--neon-green)]" />
                  AI-Powered
                </h3>
                <ul className="space-y-2 text-sm text-[var(--neutral-400)]">
                  <li>• Real-time form assistance and validation</li>
                  <li>• Smart email domain suggestions</li>
                  <li>• Password strength analysis with tips</li>
                  <li>• Contextual help and error recovery</li>
                  <li>• Behavioral pattern recognition</li>
                </ul>
              </div>

              {/* Security Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Advanced Security
                </h3>
                <ul className="space-y-2 text-sm text-[var(--neutral-400)]">
                  <li>• Biometric authentication (Face ID, Touch ID)</li>
                  <li>• Keystroke dynamics analysis</li>
                  <li>• Device fingerprinting and trust scoring</li>
                  <li>• Risk-based authentication</li>
                  <li>• Multi-factor authentication options</li>
                </ul>
              </div>

              {/* Modern UX */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Modern UX
                </h3>
                <ul className="space-y-2 text-sm text-[var(--neutral-400)]">
                  <li>• Voice command authentication</li>
                  <li>• QR code mobile app login</li>
                  <li>• Progressive web app integration</li>
                  <li>• Micro-animations and transitions</li>
                  <li>• Dark mode with neon accents</li>
                </ul>
              </div>

              {/* Web3 Integration */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-orange-400" />
                  Web3 Ready
                </h3>
                <ul className="space-y-2 text-sm text-[var(--neutral-400)]">
                  <li>• MetaMask and WalletConnect support</li>
                  <li>• NFT holder exclusive benefits</li>
                  <li>• Loyalty token integration</li>
                  <li>• ENS name resolution</li>
                  <li>• Multi-chain compatibility</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={() => setShowAuth(true)}
                className="btn-primary px-8 py-3"
              >
                <Star className="w-4 h-4 mr-2" />
                Try Authentication Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Authentication Modal */}
      <Auth2025Modal
        open={showAuth}
        onOpenChange={setShowAuth}
        setUser={setUser}
      />
    </div>
  );
}