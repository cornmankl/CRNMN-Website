import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { 
  Bell, 
  BellRing, 
  X, 
  Check, 
  Package, 
  Truck, 
  Star, 
  Gift, 
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Trash2,
  Settings,
  Volume2,
  VolumeX,
  Smartphone
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'promotion' | 'system' | 'review' | 'loyalty';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
}

interface NotificationSystemProps {
  user?: any;
  activeOrder?: any;
}

export function NotificationSystem({ user, activeOrder }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  // Mock notifications for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Order Confirmed',
        message: 'Your order #ORD-2024-001 has been confirmed and is being prepared.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        actionUrl: '/tracking',
        actionLabel: 'Track Order'
      },
      {
        id: '2',
        type: 'delivery',
        title: 'Driver Assigned',
        message: 'Ahmad Rahman is on the way to deliver your order. ETA: 15 minutes.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        actionUrl: '/tracking',
        actionLabel: 'Track Delivery'
      },
      {
        id: '3',
        type: 'promotion',
        title: 'Special Offer!',
        message: '20% off on all corn dishes this weekend. Use code CORN20.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'medium',
        actionUrl: '/menu',
        actionLabel: 'Order Now'
      },
      {
        id: '4',
        type: 'loyalty',
        title: 'Loyalty Points Earned',
        message: 'You earned 25 loyalty points from your recent order!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low',
        actionUrl: '/profile',
        actionLabel: 'View Points'
      },
      {
        id: '5',
        type: 'review',
        title: 'Rate Your Order',
        message: 'How was your Sweet Corn Delight? Share your experience.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium',
        actionUrl: '/orders',
        actionLabel: 'Rate Order'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setPushEnabled(true);
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setPushEnabled(permission === 'granted');
        });
      }
    }
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Simulate new notification
      if (Math.random() > 0.8) {
        addNotification({
          type: 'order',
          title: 'Order Update',
          message: 'Your order is now being prepared in our kitchen.',
          priority: 'medium'
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound if enabled
    if (soundEnabled) {
      playNotificationSound();
    }

    // Show browser notification if enabled
    if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/logo-192.png',
        tag: newNotification.id
      });
    }
  }, [soundEnabled, pushEnabled]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors (user interaction required)
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="w-4 h-4" />;
      case 'delivery': return <Truck className="w-4 h-4" />;
      case 'promotion': return <Gift className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'loyalty': return <Star className="w-4 h-4" />;
      case 'system': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-400';
    
    switch (type) {
      case 'order': return 'text-blue-400';
      case 'delivery': return 'text-green-400';
      case 'promotion': return 'text-purple-400';
      case 'review': return 'text-yellow-400';
      case 'loyalty': return 'text-[var(--neon-green)]';
      default: return 'text-[var(--neutral-400)]';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 hover:bg-[var(--neutral-800)]"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5 text-[var(--neon-green)] animate-pulse" />
          ) : (
            <Bell className="w-5 h-5 text-[var(--neutral-400)]" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-[var(--neutral-900)] border-[var(--neutral-800)] p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-[var(--neutral-800)]">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white text-lg font-bold">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </SheetTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[var(--neutral-400)]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[var(--neutral-400)]" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <Settings className="w-4 h-4 text-[var(--neutral-400)]" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Quick Actions */}
          {notifications.length > 0 && (
            <div className="p-4 border-b border-[var(--neutral-800)]">
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="border-[var(--neutral-600)] text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="border-[var(--neutral-600)] text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bell className="w-12 h-12 text-[var(--neutral-600)] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
                <p className="text-sm text-[var(--neutral-400)]">
                  You're all caught up! We'll notify you when something new happens.
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                      notification.isRead 
                        ? "bg-[var(--neutral-800)] border-[var(--neutral-700)]" 
                        : "bg-[var(--neutral-800)]/80 border-[var(--neon-green)]/30 shadow-sm"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        notification.isRead ? "bg-[var(--neutral-700)]" : "bg-[var(--neutral-600)]"
                      )}>
                        <div className={getNotificationColor(notification.type, notification.priority)}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={cn(
                            "font-semibold text-sm",
                            notification.isRead ? "text-[var(--neutral-300)]" : "text-white"
                          )}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--neutral-500)]">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className={cn(
                          "text-sm mt-1",
                          notification.isRead ? "text-[var(--neutral-500)]" : "text-[var(--neutral-400)]"
                        )}>
                          {notification.message}
                        </p>

                        {/* Action Button */}
                        {notification.actionLabel && notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 border-[var(--neutral-600)] text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle navigation
                              console.log('Navigate to:', notification.actionUrl);
                            }}
                          >
                            {notification.actionLabel}
                          </Button>
                        )}

                        {/* Priority Indicator */}
                        {notification.priority === 'high' && !notification.isRead && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--neutral-800)]">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-[var(--neutral-400)]">
                <Smartphone className="w-4 h-4" />
                <span>Push notifications</span>
              </div>
              <Button
                variant={pushEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (!pushEnabled && 'Notification' in window) {
                    Notification.requestPermission().then(permission => {
                      setPushEnabled(permission === 'granted');
                    });
                  } else {
                    setPushEnabled(!pushEnabled);
                  }
                }}
                className={cn(
                  "text-xs",
                  pushEnabled 
                    ? "bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                    : "border-[var(--neutral-600)]"
                )}
              >
                {pushEnabled ? 'Enabled' : 'Enable'}
              </Button>
            </div>
            
            <p className="text-xs text-[var(--neutral-500)] mt-2">
              Stay updated with order status, promotions, and more
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Hook for adding notifications from other components
export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    // This would typically dispatch to a global state manager
    console.log('Adding notification:', notification);
  };

  return { addNotification };
};
