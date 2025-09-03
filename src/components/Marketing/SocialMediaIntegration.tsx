import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Share2, 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle,
  Heart,
  Users,
  TrendingUp,
  Gift,
  Camera,
  MapPin,
  Clock
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SocialMediaIntegrationProps {
  onShare?: (platform: string) => void;
}

export function SocialMediaIntegration({ onShare }: SocialMediaIntegrationProps) {
  const [isSharing, setIsSharing] = useState(false);

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      url: 'https://www.facebook.com/CRNMNRestaurant',
      followers: '2.5K',
      engagement: '4.8%'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      url: 'https://www.instagram.com/CRNMNRestaurant',
      followers: '5.2K',
      engagement: '6.2%'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500',
      url: 'https://www.twitter.com/CRNMNRestaurant',
      followers: '1.8K',
      engagement: '3.5%'
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      url: 'https://wa.me/60123456789',
      followers: 'Direct',
      engagement: 'High'
    }
  ];

  const recentPosts = [
    {
      id: '1',
      platform: 'Instagram',
      content: 'Our new Spicy Corn Fritters are here! 🌶️ Crispy, golden, and perfectly spiced. Limited time only!',
      image: '🌶️',
      likes: 89,
      comments: 12,
      shares: 5,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      platform: 'Facebook',
      content: 'Behind the scenes: Our chef preparing the signature Sweet Corn Delight. Fresh ingredients, authentic flavors! 🌽',
      image: '👨‍🍳',
      likes: 156,
      comments: 23,
      shares: 8,
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      platform: 'Twitter',
      content: 'Just tried our Corn & Quinoa Power Bowl - absolutely amazing! Perfect for a healthy lunch. #HealthyEating #CornPower',
      image: '🥙',
      likes: 67,
      comments: 9,
      shares: 3,
      timestamp: '1 day ago'
    }
  ];

  const handleShare = (platform: string) => {
    setIsSharing(true);
    
    const shareData = {
      title: 'CRNMN - Premium Corn Restaurant',
      text: 'Check out CRNMN for the best corn dishes in town! Fresh, delicious, and authentic flavors.',
      url: window.location.href
    };

    switch (platform) {
      case 'Facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
        break;
      case 'Twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`, '_blank');
        break;
      case 'WhatsApp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share(shareData);
        }
    }

    onShare?.(platform);
    setTimeout(() => setIsSharing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Social Media Stats */}
      <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Social Media Presence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="text-center p-4 rounded-lg bg-[var(--neutral-800)] hover:bg-[var(--neutral-700)] transition-colors cursor-pointer"
                onClick={() => window.open(platform.url, '_blank')}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3",
                  platform.color
                )}>
                  {platform.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{platform.name}</h3>
                <p className="text-sm text-[var(--neutral-400)] mb-1">
                  {platform.followers} followers
                </p>
                <p className="text-xs text-[var(--neon-green)]">
                  {platform.engagement} engagement
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Share Your Experience */}
      <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-[var(--neutral-400)]">
              Love our corn dishes? Share your experience with friends and family!
            </p>
            
            <div className="flex flex-wrap gap-3">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  onClick={() => handleShare(platform.name)}
                  disabled={isSharing}
                  className={cn(
                    "flex items-center gap-2",
                    platform.color,
                    platform.hoverColor,
                    "text-white"
                  )}
                >
                  {platform.icon}
                  Share on {platform.name}
                </Button>
              ))}
            </div>

            <div className="bg-[var(--neutral-800)] rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Share & Earn Rewards
              </h4>
              <p className="text-sm text-[var(--neutral-400)] mb-3">
                Share your meal photos and reviews to earn loyalty points!
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Upload Photo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[var(--neutral-600)]"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Leave Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Social Posts */}
      <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Latest from Our Social Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[var(--neutral-800)] rounded-lg p-4 hover:bg-[var(--neutral-700)] transition-colors cursor-pointer"
                onClick={() => window.open(socialPlatforms.find(p => p.name === post.platform)?.url, '_blank')}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{post.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[var(--neon-green)] text-black text-xs">
                        {post.platform}
                      </Badge>
                      <span className="text-xs text-[var(--neutral-500)]">
                        {post.timestamp}
                      </span>
                    </div>
                    <p className="text-white text-sm mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--neutral-400)]">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {post.shares}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Follow Us */}
      <Card className="bg-gradient-to-r from-[var(--neon-green)]/10 to-blue-500/10 border-[var(--neon-green)]/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Follow Us for Updates!</h3>
          <p className="text-[var(--neutral-400)] mb-4">
            Stay connected for daily specials, behind-the-scenes content, and exclusive offers.
          </p>
          <div className="flex justify-center gap-3">
            {socialPlatforms.slice(0, 3).map((platform) => (
              <Button
                key={platform.name}
                variant="outline"
                size="sm"
                onClick={() => window.open(platform.url, '_blank')}
                className="border-[var(--neutral-600)] hover:border-[var(--neon-green)]"
              >
                {platform.icon}
                <span className="ml-1">{platform.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
