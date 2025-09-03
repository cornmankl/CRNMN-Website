import React, { useState } from 'react';
import { Auth2025Modal } from './Auth2025Modal';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  Bot, 
  Shield, 
  Fingerprint, 
  Mic, 
  Wallet, 
  QrCode,
  Zap,
  Star,
  Crown,
  Gift,
  Users,
  TrendingUp,
  CheckCircle,
  Eye,
  Brain,
  Magic,
  Heart,
  Award
} from 'lucide-react';
import { cn } from '../utils/cn';

export function AuthPreview2025() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  const features = [
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Smart form guidance with Gemini AI',
      color: 'from-blue-500 to-purple-600',
      demo: 'Type in any field to see AI suggestions',
      badge: '🤖 Active'
    },
    {
      icon: Fingerprint,
      title: 'Biometric Auth',
      description: 'Face ID, Touch ID, Windows Hello',
      color: 'from-green-500 to-blue-600',
      demo: 'One-tap secure authentication',
      badge: '🔒 Secure'
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Hands-free authentication',
      color: 'from-purple-500 to-pink-600',
      demo: 'Say "login" or speak your email',
      badge: '🎤 Ready'
    },
    {
      icon: Wallet,
      title: 'Web3 Wallet',
      description: 'MetaMask, NFT benefits, crypto rewards',
      color: 'from-orange-500 to-red-600',
      demo: 'Connect wallet for premium features',
      badge: '🚀 Web3'
    },
    {
      icon: Shield,
      title: 'Behavioral Security',
      description: 'Typing pattern analysis',
      color: 'from-emerald-500 to-teal-600',
      demo: 'Real-time security monitoring',
      badge: '🛡️ Smart'
    },
    {
      icon: QrCode,
      title: 'QR Code Login',
      description: 'Mobile app instant access',
      color: 'from-cyan-500 to-blue-600',
      demo: 'Scan with mobile for quick login',
      badge: '📱 Mobile'
    }
  ];

  const authModes = [
    { id: 'email', name: 'Email + AI', icon: Bot, color: 'text-blue-400' },
    { id: 'biometric', name: 'Biometric', icon: Fingerprint, color: 'text-green-400' },
    { id: 'voice', name: 'Voice', icon: Mic, color: 'text-purple-400' },
    { id: 'qr', name: 'QR Code', icon: QrCode, color: 'text-cyan-400' },
    { id: 'web3', name: 'Web3', icon: Wallet, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-black)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-green)]/30 via-blue-500/30 to-purple-500/30 blur-3xl" />
            <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-[var(--neon-green)] via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Auth 2025
            </h1>
          </div>
          
          <p className="text-xl text-[var(--neutral-300)] max-w-3xl mx-auto leading-relaxed">
            Experience the future of authentication with AI assistance, biometric security, 
            voice commands, Web3 integration, and behavioral analysis - all in one seamless interface.
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white">5 Auth Methods</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-white">Maximum Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="text-white">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white">2025 Ready</span>
            </div>
          </div>
        </div>

        {/* Live Demo Section */}
        <div className="bg-[var(--neutral-900)] border border-[var(--neutral-800)] rounded-3xl p-8 mb-12 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--neon-green)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />
          
          <div className="relative z-10 text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-[var(--neon-green)]" />
              <h2 className="text-3xl font-bold text-white">Live Demo</h2>
              <Magic className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            
            {user ? (
              /* Success State */
              <div className="max-w-md mx-auto space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Authentication Successful! 🎉</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-300">Welcome back, <strong>{user.name}</strong>!</p>
                    <p className="text-[var(--neutral-400)]">Method: {user.authMethod}</p>
                    <p className="text-[var(--neutral-400)]">Security: {user.securityLevel || 'High'}</p>
                    {user.loyaltyPoints && (
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">
                          {user.loyaltyPoints.toLocaleString()} Loyalty Points
                        </span>
                      </div>
                    )}
                    {user.premiumMember && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        👑 Premium Member
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setShowAuth(true)}
                    variant="outline"
                    className="border-[var(--neutral-700)] hover:border-[var(--neon-green)]"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => setUser(null)}
                    className="btn-primary"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              /* Demo Launch */
              <div className="space-y-6">
                <p className="text-lg text-[var(--neutral-300)] mb-6">
                  Click below to experience all 5 authentication methods
                </p>
                
                <Button
                  onClick={() => setShowAuth(true)}
                  className={cn(
                    "relative px-12 py-4 text-xl font-bold text-black",
                    "bg-gradient-to-r from-[var(--neon-green)] to-green-400",
                    "hover:from-green-400 hover:to-[var(--neon-green)]",
                    "transition-all duration-300 hover:scale-105 active:scale-95",
                    "shadow-lg hover:shadow-2xl rounded-2xl",
                    "border-2 border-transparent hover:border-[var(--neon-green)]/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Launch Auth 2025
                    <Award className="w-6 h-6" />
                  </div>
                </Button>

                {/* Quick Mode Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {authModes.map((mode) => (
                    <Button
                      key={mode.id}
                      variant="outline"
                      onClick={() => setShowAuth(true)}
                      className={cn(
                        "border-[var(--neutral-700)] hover:border-[var(--neutral-600)]",
                        "bg-[var(--neutral-800)]/50 hover:bg-[var(--neutral-700)]/50",
                        "transition-all duration-200 hover:scale-105"
                      )}
                    >
                      <mode.icon className={cn("w-4 h-4 mr-2", mode.color)} />
                      {mode.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={cn(
                "bg-[var(--neutral-900)] border-[var(--neutral-800)] overflow-hidden",
                "hover:border-[var(--neutral-700)] transition-all duration-300 hover:scale-105",
                "group cursor-pointer"
              )}
              onClick={() => setShowAuth(true)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br transition-transform duration-300",
                    feature.color,
                    "group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="text-xs bg-[var(--neon-green)]/20 text-[var(--neon-green)] animate-pulse">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg group-hover:text-[var(--neon-green)] transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--neutral-400)] text-sm mb-3">{feature.description}</p>
                <p className="text-xs text-[var(--neon-green)] font-medium">
                  💡 {feature.demo}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* AI Features */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Bot className="w-8 h-8 text-blue-400" />
                AI-Powered Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-white">Real-time form assistance</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Magic className="w-4 h-4 text-pink-400" />
                  <span className="text-white">Smart error prevention</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-white">Behavioral analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-white">Security recommendations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-400" />
                Advanced Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Fingerprint className="w-4 h-4 text-blue-400" />
                  <span className="text-white">WebAuthn biometric auth</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-white">Keystroke dynamics</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-white">Device trust scoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="w-4 h-4 text-orange-400" />
                  <span className="text-white">Crypto wallet verification</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Stats */}
        <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)] mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-3">
              <TrendingUp className="w-6 h-6 text-[var(--neon-green)]" />
              Live Authentication Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <Users className="w-8 h-8 text-[var(--neon-green)] mx-auto" />
                <div className="text-2xl font-bold text-white animate-pulse">12,547</div>
                <div className="text-sm text-[var(--neutral-400)]">Active Users</div>
              </div>
              <div className="space-y-2">
                <Shield className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-2xl font-bold text-white">99.8%</div>
                <div className="text-sm text-[var(--neutral-400)]">Security Score</div>
              </div>
              <div className="space-y-2">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto" />
                <div className="text-2xl font-bold text-white">0.3s</div>
                <div className="text-sm text-[var(--neutral-400)]">Avg Auth Time</div>
              </div>
              <div className="space-y-2">
                <Star className="w-8 h-8 text-purple-400 mx-auto" />
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-sm text-[var(--neutral-400)]">User Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[var(--neutral-900)] via-[var(--neutral-800)] to-[var(--neutral-900)] border border-[var(--neutral-700)] rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Experience the Future?
            </h3>
            <p className="text-[var(--neutral-400)] mb-6 max-w-2xl mx-auto">
              Try all 5 authentication methods and see how AI assistance, biometric security, 
              and Web3 integration work together to create the ultimate login experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setShowAuth(true)}
                className={cn(
                  "px-8 py-3 text-lg font-bold text-black",
                  "bg-gradient-to-r from-[var(--neon-green)] to-green-400",
                  "hover:from-green-400 hover:to-[var(--neon-green)]",
                  "transition-all duration-300 hover:scale-105",
                  "shadow-lg hover:shadow-xl rounded-xl"
                )}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Open Auth 2025 Demo
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-[var(--neutral-500)]">
                <Gift className="w-4 h-4" />
                <span>No registration required for demo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Authentication Modal */}
        <Auth2025Modal
          open={showAuth}
          onOpenChange={setShowAuth}
          setUser={setUser}
        />
      </div>
    </div>
  );
}