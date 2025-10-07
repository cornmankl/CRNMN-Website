export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'card' | 'cash' | 'ewallet';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  estimatedDelivery?: Date;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  location?: {
    lat: number;
    lng: number;
  };
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  message: string;
  timestamp: Date;
  icon?: string;
}

export interface OrdersState {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}
