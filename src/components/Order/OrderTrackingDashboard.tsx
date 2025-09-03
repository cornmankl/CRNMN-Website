import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Star,
  MessageSquare,
  Navigation,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  Share2,
  Heart,
  RotateCcw,
  ShoppingBag,
  Timer,
  User
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  placedAt: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  contactNumber: string;
  paymentMethod: string;
  trackingUpdates: Array<{
    status: string;
    message: string;
    timestamp: string;
    location?: string;
  }>;
  deliveryInstructions?: string;
  rating?: number;
  review?: string;
  driverInfo?: {
    name: string;
    phone: string;
    rating: number;
    photo?: string;
  };
}

interface OrderTrackingDashboardProps {
  activeOrder?: Order | null;
  user?: any;
}

export function OrderTrackingDashboard({ activeOrder, user }: OrderTrackingDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(activeOrder || null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock order history - replace with real API call
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-2024-001',
        status: 'delivered',
        items: [
          { id: '1', name: 'Sweet Corn Delight', quantity: 2, price: 8.50 },
          { id: '2', name: 'Corn Fritters', quantity: 1, price: 6.00 }
        ],
        total: 23.00,
        placedAt: '2024-01-15T14:30:00Z',
        estimatedDelivery: '2024-01-15T15:15:00Z',
        deliveryAddress: '123 Main Street, Kuala Lumpur',
        contactNumber: '+60 12-345 6789',
        paymentMethod: 'Credit Card',
        rating: 5,
        review: 'Excellent food and fast delivery!',
        trackingUpdates: [
          { status: 'placed', message: 'Order placed successfully', timestamp: '2024-01-15T14:30:00Z' },
          { status: 'confirmed', message: 'Order confirmed by restaurant', timestamp: '2024-01-15T14:32:00Z' },
          { status: 'preparing', message: 'Kitchen started preparing your order', timestamp: '2024-01-15T14:35:00Z' },
          { status: 'ready', message: 'Order ready for pickup', timestamp: '2024-01-15T14:50:00Z' },
          { status: 'out-for-delivery', message: 'Driver picked up your order', timestamp: '2024-01-15T14:55:00Z', location: 'CRNMN Kitchen' },
          { status: 'delivered', message: 'Order delivered successfully', timestamp: '2024-01-15T15:12:00Z', location: '123 Main Street' }
        ]
      },
      {
        id: 'ORD-2024-002',
        status: 'out-for-delivery',
        items: [
          { id: '3', name: 'Grilled Corn Special', quantity: 1, price: 12.00 }
        ],
        total: 15.50,
        placedAt: '2024-01-20T16:45:00Z',
        estimatedDelivery: '2024-01-20T17:30:00Z',
        deliveryAddress: '456 Oak Avenue, Petaling Jaya',
        contactNumber: '+60 12-987 6543',
        paymentMethod: 'GrabPay',
        driverInfo: {
          name: 'Ahmad Rahman',
          phone: '+60 12-111 2222',
          rating: 4.8,
          photo: '/driver-avatar.jpg'
        },
        trackingUpdates: [
          { status: 'placed', message: 'Order placed successfully', timestamp: '2024-01-20T16:45:00Z' },
          { status: 'confirmed', message: 'Order confirmed by restaurant', timestamp: '2024-01-20T16:47:00Z' },
          { status: 'preparing', message: 'Kitchen started preparing your order', timestamp: '2024-01-20T16:50:00Z' },
          { status: 'ready', message: 'Order ready for pickup', timestamp: '2024-01-20T17:05:00Z' },
          { status: 'out-for-delivery', message: 'Driver Ahmad is on the way', timestamp: '2024-01-20T17:10:00Z', location: 'CRNMN Kitchen' }
        ]
      }
    ];

    setOrderHistory(mockOrders);
    
    // Set tracking order to active order or most recent order
    if (activeOrder) {
      setTrackingOrder(activeOrder);
    } else {
      const currentOrder = mockOrders.find(order => 
        !['delivered', 'cancelled'].includes(order.status)
      );
      setTrackingOrder(currentOrder || null);
    }
  }, [activeOrder]);

  const getStatusProgress = (status: string): number => {
    const statusMap = {
      'placed': 10,
      'confirmed': 25,
      'preparing': 50,
      'ready': 70,
      'out-for-delivery': 85,
      'delivered': 100,
      'cancelled': 0
    };
    return statusMap[status as keyof typeof statusMap] || 0;
  };

  const getStatusColor = (status: string): string => {
    const colorMap = {
      'placed': 'bg-blue-500',
      'confirmed': 'bg-blue-600',
      'preparing': 'bg-yellow-500',
      'ready': 'bg-orange-500',
      'out-for-delivery': 'bg-purple-500',
      'delivered': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return <ShoppingBag className="w-4 h-4" />;
      case 'preparing':
        return <Timer className="w-4 h-4" />;
      case 'ready':
        return <Package className="w-4 h-4" />;
      case 'out-for-delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleRefreshTracking = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleTrackOrder = (orderId: string) => {
    const order = orderHistory.find(o => o.id === orderId);
    if (order) {
      setTrackingOrder(order);
      setActiveTab('current');
    }
  };

  const handleReorder = (order: Order) => {
    // Add order items back to cart
    console.log('Reordering:', order);
    // Implementation would add items to cart
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Order Tracking</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshTracking}
            disabled={isRefreshing}
            className="border-[var(--neutral-600)]"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-[var(--neutral-800)] border border-[var(--neutral-700)]">
          <TabsTrigger value="current" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Current Orders
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Order History
          </TabsTrigger>
          <TabsTrigger value="track" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Track by ID
          </TabsTrigger>
        </TabsList>

        {/* Current Orders Tab */}
        <TabsContent value="current" className="space-y-6">
          {trackingOrder ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Status Card */}
              <Card className="lg:col-span-2 bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order {trackingOrder.id}
                    </CardTitle>
                    <Badge className={cn("text-white", getStatusColor(trackingOrder.status))}>
                      {trackingOrder.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--neutral-400)]">
                    <span>Placed: {formatDate(trackingOrder.placedAt)}</span>
                    <span>•</span>
                    <span>Total: RM {trackingOrder.total.toFixed(2)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--neutral-300)]">Order Progress</span>
                      <span className="text-[var(--neon-green)] font-semibold">
                        {getStatusProgress(trackingOrder.status)}%
                      </span>
                    </div>
                    <Progress 
                      value={getStatusProgress(trackingOrder.status)} 
                      className="h-2"
                    />
                  </div>

                  {/* Tracking Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Tracking Updates</h3>
                    <div className="space-y-3">
                      {trackingOrder.trackingUpdates.map((update, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white",
                            getStatusColor(update.status)
                          )}>
                            {getStatusIcon(update.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white">{update.message}</p>
                              <span className="text-sm text-[var(--neutral-400)]">
                                {formatTime(update.timestamp)}
                              </span>
                            </div>
                            {update.location && (
                              <p className="text-sm text-[var(--neutral-400)] flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {update.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Driver Info */}
                  {trackingOrder.driverInfo && trackingOrder.status === 'out-for-delivery' && (
                    <div className="bg-[var(--neutral-800)] rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Your Delivery Driver</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[var(--neutral-700)] rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-[var(--neutral-400)]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{trackingOrder.driverInfo.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-[var(--neutral-400)]">
                              {trackingOrder.driverInfo.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-[var(--neutral-600)]">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="border-[var(--neutral-600)]">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="border-[var(--neutral-600)]">
                      <Download className="w-4 h-4 mr-2" />
                      Receipt
                    </Button>
                    <Button variant="outline" className="border-[var(--neutral-600)]">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    {trackingOrder.status === 'delivered' && !trackingOrder.rating && (
                      <Button className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90">
                        <Star className="w-4 h-4 mr-2" />
                        Rate Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Details Sidebar */}
              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardHeader>
                  <CardTitle className="text-white">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-[var(--neutral-300)]">Items Ordered</h4>
                    {trackingOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{item.name}</p>
                          <p className="text-xs text-[var(--neutral-400)]">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-white font-medium text-sm">
                          RM {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-[var(--neutral-700)]" />

                  {/* Delivery Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-[var(--neutral-300)]">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[var(--neutral-400)] mt-0.5" />
                        <span className="text-[var(--neutral-300)]">{trackingOrder.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[var(--neutral-400)]" />
                        <span className="text-[var(--neutral-300)]">{trackingOrder.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[var(--neutral-400)]" />
                        <span className="text-[var(--neutral-300)]">
                          Est. {formatTime(trackingOrder.estimatedDelivery)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[var(--neutral-700)]" />

                  {/* Payment */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-[var(--neutral-300)]">Payment Method</h4>
                    <p className="text-sm text-white">{trackingOrder.paymentMethod}</p>
                    <p className="text-lg font-bold text-[var(--neon-green)]">
                      RM {trackingOrder.total.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-[var(--neutral-600)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Active Orders</h3>
                <p className="text-[var(--neutral-400)] mb-6">
                  You don't have any orders in progress right now.
                </p>
                <Button className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90">
                  Start Ordering
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Order History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Order History</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[var(--neutral-600)]">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-[var(--neutral-600)]">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {orderHistory
              .filter(order => 
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((order) => (
                <Card key={order.id} className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={cn("text-white", getStatusColor(order.status))}>
                            {order.status.replace('-', ' ')}
                          </Badge>
                          <span className="font-bold text-white">{order.id}</span>
                          <span className="text-[var(--neutral-400)]">{formatDate(order.placedAt)}</span>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm text-[var(--neutral-300)]">
                              {item.quantity}x {item.name}
                            </p>
                          ))}
                        </div>

                        {order.rating && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < order.rating! ? "text-yellow-400 fill-current" : "text-[var(--neutral-600)]"
                                  )}
                                />
                              ))}
                            </div>
                            {order.review && (
                              <span className="text-sm text-[var(--neutral-400)]">"{order.review}"</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-white text-lg mb-2">
                          RM {order.total.toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTrackOrder(order.id)}
                            className="border-[var(--neutral-600)]"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorder(order)}
                            className="border-[var(--neutral-600)]"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reorder
                          </Button>
                          {order.status === 'delivered' && !order.rating && (
                            <Button
                              size="sm"
                              className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Rate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Track by ID Tab */}
        <TabsContent value="track" className="space-y-6">
          <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <CardHeader>
              <CardTitle className="text-white">Track Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your order ID (e.g., ORD-2024-001)"
                  className="bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                />
                <Button className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90">
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </Button>
              </div>
              <p className="text-sm text-[var(--neutral-400)]">
                Enter your order ID to track your delivery in real-time. You can find your order ID in your email confirmation or SMS.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
