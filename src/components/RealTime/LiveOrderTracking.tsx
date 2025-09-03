import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { realTimeManager } from '../../utils/realTime';
import { cn } from '../../utils/cn';

interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
  timestamp: string;
  estimatedTime?: string;
  location?: string;
  driver?: {
    name: string;
    phone: string;
    rating: number;
  };
}

interface LiveOrderTrackingProps {
  orderId: string;
  onClose?: () => void;
}

export function LiveOrderTracking({ orderId, onClose }: LiveOrderTrackingProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isLive, setIsLive] = useState(true);

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: User },
    { key: 'ready', label: 'Ready', icon: CheckCircle },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'out-for-delivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getProgressPercentage = (status: string) => {
    const index = statusSteps.findIndex(step => step.key === status);
    return ((index + 1) / statusSteps.length) * 100;
  };

  useEffect(() => {
    // Initialize with mock order status
    setOrderStatus({
      id: orderId,
      status: 'preparing',
      timestamp: new Date().toISOString(),
      estimatedTime: '15-20 minutes',
      location: 'Kitchen Station 2',
      driver: {
        name: 'Ahmad Rahman',
        phone: '+60123456789',
        rating: 4.8
      }
    });

    // Subscribe to real-time updates
    const unsubscribe = realTimeManager.subscribe('orderUpdate', (data: any) => {
      if (data.orderId === orderId) {
        setOrderStatus(prev => prev ? { ...prev, ...data } : null);
      }
    });

    return unsubscribe;
  }, [orderId]);

  if (!orderStatus) {
    return (
      <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-8 h-8 text-[var(--neutral-400)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--neutral-400)]">Loading order status...</p>
        </CardContent>
      </Card>
    );
  }

  const currentStepIndex = statusSteps.findIndex(step => step.key === orderStatus.status);

  return (
    <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Live Order Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isLive ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm text-[var(--neutral-400)]">
              {isLive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
        <p className="text-[var(--neutral-400)] text-sm">
          Order #{orderStatus.id}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[var(--neutral-400)]">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage(orderStatus.status))}%</span>
          </div>
          <Progress 
            value={getProgressPercentage(orderStatus.status)} 
            className="h-2"
          />
        </div>

        {/* Status Steps */}
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isCompleted 
                    ? "bg-[var(--neon-green)] text-black" 
                    : "bg-[var(--neutral-700)] text-[var(--neutral-400)]"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    isCurrent ? "text-[var(--neon-green)]" : "text-white"
                  )}>
                    {step.label}
                  </p>
                  {isCurrent && orderStatus.estimatedTime && (
                    <p className="text-sm text-[var(--neutral-400)]">
                      ETA: {orderStatus.estimatedTime}
                    </p>
                  )}
                </div>
                {isCurrent && (
                  <Badge className="bg-[var(--neon-green)] text-black">
                    Current
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Driver Info (if out for delivery) */}
        {orderStatus.status === 'out-for-delivery' && orderStatus.driver && (
          <div className="bg-[var(--neutral-800)] rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Your Driver
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{orderStatus.driver.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-[var(--neutral-400)]">
                    {orderStatus.driver.rating} rating
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
        )}

        {/* Location Info */}
        {orderStatus.location && (
          <div className="bg-[var(--neutral-800)] rounded-lg p-4">
            <h4 className="font-semibold text-white flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              Current Location
            </h4>
            <p className="text-[var(--neutral-400)]">{orderStatus.location}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsLive(!isLive)}
            className="flex-1 border-[var(--neutral-600)]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[var(--neutral-600)]"
            >
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
