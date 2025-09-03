import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Eye,
  Save,
  X,
  Upload,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  tags: string[];
  rating: number;
  reviews: number;
  totalSold: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  prepTime: string;
  calories?: number;
  image?: string;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  estimatedDelivery: string;
}

interface AdminDashboardProps {
  user: any;
  onClose: () => void;
}

export function AdminDashboard({ user, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Sweet Corn Delight',
        description: 'Fresh sweet corn kernels with butter and herbs',
        price: 8.50,
        originalPrice: 10.00,
        category: 'Appetizers',
        stock: 45,
        lowStockThreshold: 10,
        status: 'active',
        tags: ['sweet', 'buttery', 'classic'],
        rating: 4.8,
        reviews: 124,
        totalSold: 342,
        revenue: 2907.00,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-20',
        isVegetarian: true,
        isSpicy: false,
        prepTime: '5-8 min',
        calories: 180
      },
      {
        id: '2',
        name: 'Spicy Corn Fritters',
        description: 'Crispy corn fritters with jalapeño and spices',
        price: 12.00,
        category: 'Main Dishes',
        stock: 3,
        lowStockThreshold: 5,
        status: 'active',
        tags: ['crispy', 'spicy', 'fried'],
        rating: 4.6,
        reviews: 89,
        totalSold: 156,
        revenue: 1872.00,
        createdAt: '2024-01-05',
        updatedAt: '2024-01-19',
        isVegetarian: true,
        isSpicy: true,
        prepTime: '10-12 min',
        calories: 320
      },
      {
        id: '3',
        name: 'Corn Ice Cream',
        description: 'Unique sweet corn flavored ice cream',
        price: 7.50,
        category: 'Desserts',
        stock: 0,
        lowStockThreshold: 8,
        status: 'out-of-stock',
        tags: ['sweet', 'cold', 'unique'],
        rating: 4.2,
        reviews: 45,
        totalSold: 89,
        revenue: 667.50,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        isVegetarian: true,
        isSpicy: false,
        prepTime: '2-3 min',
        calories: 240
      }
    ];

    const mockOrders: Order[] = [
      {
        id: 'ORD-2024-001',
        customerId: 'user1',
        customerName: 'John Doe',
        items: [
          { productId: '1', name: 'Sweet Corn Delight', quantity: 2, price: 8.50 }
        ],
        total: 17.00,
        status: 'preparing',
        paymentStatus: 'paid',
        createdAt: '2024-01-20T10:30:00Z',
        estimatedDelivery: '2024-01-20T11:15:00Z'
      },
      {
        id: 'ORD-2024-002',
        customerId: 'user2',
        customerName: 'Jane Smith',
        items: [
          { productId: '2', name: 'Spicy Corn Fritters', quantity: 1, price: 12.00 },
          { productId: '1', name: 'Sweet Corn Delight', quantity: 1, price: 8.50 }
        ],
        total: 20.50,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: '2024-01-20T11:00:00Z',
        estimatedDelivery: '2024-01-20T11:45:00Z'
      }
    ];

    setProducts(mockProducts);
    setOrders(mockOrders);
  }, []);

  // Analytics calculations
  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'out-of-stock': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct && editingProduct.id) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        totalSold: 0,
        revenue: 0,
        rating: 0,
        reviews: 0
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--neon-green)]">Admin Dashboard</h1>
            <p className="text-[var(--neutral-400)]">Manage your CRNMN inventory and orders</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[var(--neutral-600)]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Admin
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[var(--neutral-800)] border border-[var(--neutral-700)]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--neutral-400)]">Total Revenue</p>
                      <p className="text-2xl font-bold text-[var(--neon-green)]">
                        RM {totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[var(--neon-green)]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--neutral-400)]">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{totalOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--neutral-400)]">Products</p>
                      <p className="text-2xl font-bold text-white">{totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--neutral-400)]">Avg Rating</p>
                      <p className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lowStockProducts > 0 && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 font-semibold">Low Stock Warning</p>
                      <p className="text-sm text-[var(--neutral-400)]">
                        {lowStockProducts} products are running low on stock
                      </p>
                    </div>
                  )}
                  {outOfStockProducts > 0 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 font-semibold">Out of Stock</p>
                      <p className="text-sm text-[var(--neutral-400)]">
                        {outOfStockProducts} products are out of stock
                      </p>
                    </div>
                  )}
                  {lowStockProducts === 0 && outOfStockProducts === 0 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 font-semibold">All Good!</p>
                      <p className="text-sm text-[var(--neutral-400)]">
                        All products are well stocked
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-[var(--neutral-800)] rounded-lg">
                      <div>
                        <p className="font-semibold text-white">{order.id}</p>
                        <p className="text-sm text-[var(--neutral-400)]">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={cn("text-white", getStatusColor(order.status))}>
                          {order.status}
                        </Badge>
                        <p className="text-sm text-[var(--neutral-400)] mt-1">
                          RM {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Product Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg px-3 py-2 text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => setEditingProduct({} as Product)}
                className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Table */}
            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-[var(--neutral-800)]">
                      <tr className="text-left">
                        <th className="p-4 font-semibold text-[var(--neutral-300)]">Product</th>
                        <th className="p-4 font-semibold text-[var(--neutral-300)]">Category</th>
                        <th className="p-4 font-semibold text-[var(--neutral-300)]">Price</th>
                        <th className="p-4 font-semibold text-[var(--neutral-300)]">Stock</th>
                        <th className="p-4 font-semibold text-[var(--neutral-300)]">Status</th>
                        <th className="p-4 font-semibold text-[var(--neutral-300)]">Rating</th>
                        <th className="p-4 font-semibold text-[var(--neutral-300)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-[var(--neutral-800)] hover:bg-[var(--neutral-800)]/50">
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-white">{product.name}</p>
                              <p className="text-sm text-[var(--neutral-400)] line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-[var(--neutral-300)]">{product.category}</td>
                          <td className="p-4">
                            <div>
                              <span className="text-white font-semibold">RM {product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-[var(--neutral-500)] line-through ml-2">
                                  RM {product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "font-semibold",
                              product.stock <= product.lowStockThreshold 
                                ? "text-red-400" 
                                : "text-white"
                            )}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge className={cn("text-white", getStatusColor(product.status))}>
                              {product.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white">{product.rating}</span>
                              <span className="text-sm text-[var(--neutral-400)]">
                                ({product.reviews})
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingProduct(product)}
                                className="p-1"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 bg-[var(--neutral-800)] rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{order.id}</h3>
                        <p className="text-sm text-[var(--neutral-400)]">
                          {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[var(--neon-green)]">RM {order.total.toFixed(2)}</p>
                        <Badge className={cn("text-white mt-1", getStatusColor(order.status))}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-[var(--neutral-300)]">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-white">RM {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="bg-[var(--neutral-700)] border border-[var(--neutral-600)] rounded px-2 py-1 text-sm text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[var(--neon-green)]" />
                    Top Selling Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {products
                    .sort((a, b) => b.totalSold - a.totalSold)
                    .slice(0, 5)
                    .map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[var(--neutral-400)] font-bold">#{index + 1}</span>
                          <div>
                            <p className="font-semibold text-white">{product.name}</p>
                            <p className="text-sm text-[var(--neutral-400)]">{product.totalSold} sold</p>
                          </div>
                        </div>
                        <span className="text-[var(--neon-green)] font-semibold">
                          RM {product.revenue.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-500" />
                    Category Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.filter(c => c !== 'all').map((category) => {
                    const categoryProducts = products.filter(p => p.category === category);
                    const categoryRevenue = categoryProducts.reduce((sum, p) => sum + p.revenue, 0);
                    const percentage = (categoryRevenue / totalRevenue) * 100;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white">{category}</span>
                          <span className="text-[var(--neutral-400)]">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-[var(--neutral-700)] rounded-full h-2">
                          <div 
                            className="bg-[var(--neon-green)] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[var(--neutral-300)]">Product Name</Label>
                    <Input
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[var(--neutral-300)]">Category</Label>
                    <select
                      value={editingProduct.category || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select Category</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Dishes">Main Dishes</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-[var(--neutral-300)]">Description</Label>
                  <Textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-[var(--neutral-300)]">Price (RM)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.price || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[var(--neutral-300)]">Stock</Label>
                    <Input
                      type="number"
                      value={editingProduct.stock || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                      className="bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[var(--neutral-300)]">Low Stock Alert</Label>
                    <Input
                      type="number"
                      value={editingProduct.lowStockThreshold || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, lowStockThreshold: parseInt(e.target.value)})}
                      className="bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleSaveProduct(editingProduct)}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Product
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingProduct(null)}
                    className="border-[var(--neutral-600)]"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
