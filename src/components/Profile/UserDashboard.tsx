import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Gift, 
  CreditCard, 
  Bell,
  Shield,

  Package,
  Truck,
  Clock,
  Award,
  Edit,
  Save,
  X,
  Settings,
  LogOut,
  Crown,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
  onUpdateProfile: (data: any) => void;
}

interface OrderHistory {
  id: string;
  date: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: 'delivered' | 'preparing' | 'on-the-way' | 'cancelled';
  tracking?: string;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  available: boolean;
  category: 'discount' | 'free-item' | 'exclusive';
}

export function UserDashboard({ user, onLogout, onUpdateProfile }: UserDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    preferences: user?.preferences || {
      notifications: true,
      marketing: false,
      sms: true
    }
  });

  // Mock data - replace with real API calls
  const [orderHistory] = useState<OrderHistory[]>([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      items: [
        { name: 'Sweet Corn Delight', quantity: 2, price: 8.50 },
        { name: 'Corn Fritters', quantity: 1, price: 6.00 }
      ],
      total: 23.00,
      status: 'delivered',
      tracking: 'TRK-789456'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      items: [
        { name: 'Grilled Corn Special', quantity: 1, price: 12.00 }
      ],
      total: 15.50,
      status: 'preparing'
    }
  ]);

  const [loyaltyRewards] = useState<LoyaltyReward[]>([
    {
      id: 'RWD-001',
      name: 'Free Corn Fritters',
      description: 'Get a free order of our signature corn fritters',
      pointsCost: 500,
      available: true,
      category: 'free-item'
    },
    {
      id: 'RWD-002',
      name: '20% Off Next Order',
      description: 'Save 20% on your next order (max $10)',
      pointsCost: 300,
      available: true,
      category: 'discount'
    },
    {
      id: 'RWD-003',
      name: 'VIP Early Access',
      description: 'Get early access to new menu items',
      pointsCost: 1000,
      available: false,
      category: 'exclusive'
    }
  ]);

  const handleSaveProfile = async () => {
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (pref: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [pref]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'preparing': return 'bg-yellow-500';
      case 'on-the-way': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRewardIcon = (category: string) => {
    switch (category) {
      case 'free-item': return <Gift className="w-4 h-4" />;
      case 'discount': return <Star className="w-4 h-4" />;
      case 'exclusive': return <Crown className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const loyaltyTier = user?.loyaltyPoints >= 2000 ? 'Gold' : user?.loyaltyPoints >= 1000 ? 'Silver' : 'Bronze';
  const nextTierPoints = user?.loyaltyPoints >= 2000 ? 0 : user?.loyaltyPoints >= 1000 ? 2000 - user?.loyaltyPoints : 1000 - user?.loyaltyPoints;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-[var(--neutral-900)] to-[var(--neutral-800)] border-[var(--neutral-700)]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[var(--neon-green)] text-black text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--neon-green)] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
                <Badge className={cn(
                  "text-xs font-semibold",
                  loyaltyTier === 'Gold' ? 'bg-yellow-500 text-black' :
                  loyaltyTier === 'Silver' ? 'bg-gray-300 text-black' : 'bg-amber-600 text-white'
                )}>
                  {loyaltyTier} Member
                </Badge>
              </div>
              <p className="text-[var(--neutral-400)]">{user?.email}</p>
              <div className="flex items-center gap-4 text-sm text-[var(--neutral-300)]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {user?.joinDate ? new Date(user.joinDate).getFullYear() : '2024'}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[var(--neon-green)]" />
                  {user?.loyaltyPoints || 0} points
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-[var(--neutral-600)] hover:border-[var(--neon-green)]"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>

          {/* Loyalty Progress */}
          {nextTierPoints > 0 && (
            <div className="mt-6 p-4 bg-[var(--neutral-800)] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[var(--neutral-300)]">
                  {nextTierPoints} points to {loyaltyTier === 'Bronze' ? 'Silver' : 'Gold'}
                </span>
                <span className="text-sm text-[var(--neon-green)] font-medium">
                  {user?.loyaltyPoints}/{loyaltyTier === 'Bronze' ? '1000' : '2000'}
                </span>
              </div>
              <div className="w-full bg-[var(--neutral-700)] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[var(--neon-green)] to-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((user?.loyaltyPoints || 0) / (loyaltyTier === 'Bronze' ? 1000 : 2000)) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-[var(--neutral-800)] border border-[var(--neutral-700)]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Orders
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Rewards
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--neutral-400)]">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{orderHistory.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-[var(--neon-green)]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--neutral-400)]">Loyalty Points</p>
                    <p className="text-2xl font-bold text-[var(--neon-green)]">{user?.loyaltyPoints || 0}</p>
                  </div>
                  <Star className="w-8 h-8 text-[var(--neon-green)]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--neutral-400)]">Total Spent</p>
                    <p className="text-2xl font-bold text-white">
                      RM {orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-[var(--neon-green)]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--neutral-400)]">Member Tier</p>
                    <p className="text-2xl font-bold text-white">{loyaltyTier}</p>
                  </div>
                  <Award className="w-8 h-8 text-[var(--neon-green)]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderHistory.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-[var(--neutral-800)] rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className={cn("text-xs", getStatusColor(order.status))}>
                          {order.status}
                        </Badge>
                        <span className="font-medium text-white">{order.id}</span>
                        <span className="text-sm text-[var(--neutral-400)]">{order.date}</span>
                      </div>
                      <p className="text-sm text-[var(--neutral-300)] mt-1">
                        {order.items.length} items • RM {order.total.toFixed(2)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-[var(--neutral-600)]">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="p-6 bg-[var(--neutral-800)] rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={cn("text-xs", getStatusColor(order.status))}>
                          {order.status}
                        </Badge>
                        <span className="font-bold text-white">{order.id}</span>
                        <span className="text-[var(--neutral-400)]">{order.date}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">RM {order.total.toFixed(2)}</p>
                        {order.tracking && (
                          <p className="text-xs text-[var(--neutral-400)]">Track: {order.tracking}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-[var(--neutral-300)]">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-white">RM {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="border-[var(--neutral-600)]">
                        <Truck className="w-4 h-4 mr-1" />
                        Track Order
                      </Button>
                      <Button variant="outline" size="sm" className="border-[var(--neutral-600)]">
                        Reorder
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="border-[var(--neutral-600)]">
                          <Star className="w-4 h-4 mr-1" />
                          Rate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)] lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {loyaltyRewards.map((reward) => (
                    <div key={reward.id} className="p-4 bg-[var(--neutral-800)] rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getRewardIcon(reward.category)}
                            <h3 className="font-semibold text-white">{reward.name}</h3>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                reward.category === 'exclusive' ? 'border-purple-500 text-purple-400' :
                                reward.category === 'free-item' ? 'border-green-500 text-green-400' :
                                'border-blue-500 text-blue-400'
                              )}
                            >
                              {reward.category.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--neutral-400)] mb-3">{reward.description}</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[var(--neon-green)]" />
                            <span className="text-sm font-medium text-[var(--neon-green)]">
                              {reward.pointsCost} points
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          disabled={!reward.available || (user?.loyaltyPoints || 0) < reward.pointsCost}
                          className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                        >
                          {!reward.available ? 'Unavailable' : 
                           (user?.loyaltyPoints || 0) < reward.pointsCost ? 'Not Enough Points' : 'Redeem'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Loyalty Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[var(--neon-green)] to-green-400 rounded-full flex items-center justify-center">
                    <Crown className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{loyaltyTier} Member</h3>
                  <p className="text-[var(--neutral-400)] text-sm mb-4">
                    You have {user?.loyaltyPoints || 0} loyalty points
                  </p>
                </div>

                <Separator className="bg-[var(--neutral-700)]" />

                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Tier Benefits</h4>
                  <ul className="space-y-2 text-sm text-[var(--neutral-300)]">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full" />
                      Earn 1 point per RM spent
                    </li>
                    {loyaltyTier !== 'Bronze' && (
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full" />
                        {loyaltyTier === 'Silver' ? '10%' : '15%'} birthday discount
                      </li>
                    )}
                    {loyaltyTier === 'Gold' && (
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full" />
                        Free delivery on all orders
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[var(--neutral-300)]">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[var(--neutral-300)]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[var(--neutral-300)]">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-[var(--neutral-300)]">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[var(--neutral-300)]">Delivery Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-[var(--neutral-400)]" />
                  <textarea
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-md text-white focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)] disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                    placeholder="Enter your full delivery address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Order Updates</h3>
                  <p className="text-sm text-[var(--neutral-400)]">Get notified about order status changes</p>
                </div>
                <Button
                  variant={formData.preferences.notifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePreferenceChange('notifications', !formData.preferences.notifications)}
                  className={formData.preferences.notifications ? "bg-[var(--neon-green)] text-black" : "border-[var(--neutral-600)]"}
                >
                  {formData.preferences.notifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <Separator className="bg-[var(--neutral-700)]" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Marketing Communications</h3>
                  <p className="text-sm text-[var(--neutral-400)]">Receive offers and promotions</p>
                </div>
                <Button
                  variant={formData.preferences.marketing ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePreferenceChange('marketing', !formData.preferences.marketing)}
                  className={formData.preferences.marketing ? "bg-[var(--neon-green)] text-black" : "border-[var(--neutral-600)]"}
                >
                  {formData.preferences.marketing ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <Separator className="bg-[var(--neutral-700)]" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">SMS Notifications</h3>
                  <p className="text-sm text-[var(--neutral-400)]">Receive text messages for urgent updates</p>
                </div>
                <Button
                  variant={formData.preferences.sms ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePreferenceChange('sms', !formData.preferences.sms)}
                  className={formData.preferences.sms ? "bg-[var(--neon-green)] text-black" : "border-[var(--neutral-600)]"}
                >
                  {formData.preferences.sms ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start border-[var(--neutral-600)]">
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start border-[var(--neutral-600)]">
                <Mail className="w-4 h-4 mr-2" />
                Update Email Address
              </Button>
              <Button variant="outline" className="w-full justify-start border-[var(--neutral-600)]">
                <Settings className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
