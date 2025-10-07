import { Order, OrderTracking } from '../types/order.types';
import { CartItem } from '../../cart/types/cart.types';

class OrderService {
  private baseUrl = import.meta.env.VITE_API_URL || '/api';

  async createOrder(orderData: {
    items: CartItem[];
    totals: any;
    customerInfo: any;
    deliveryMethod: string;
    paymentMethod: string;
    notes?: string;
  }): Promise<Order> {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrder: Order = {
        id: 'ORD-' + Date.now(),
        userId: '1',
        items: orderData.items.map(item => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: orderData.totals.subtotal,
        deliveryFee: orderData.totals.deliveryFee,
        tax: orderData.totals.tax,
        total: orderData.totals.total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        deliveryAddress: '123 Main St, Kuala Lumpur',
        deliveryMethod: orderData.deliveryMethod as any,
        paymentMethod: orderData.paymentMethod as any,
        trackingNumber: 'TRK-' + Date.now(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
        notes: orderData.notes,
        customerInfo: orderData.customerInfo,
      };

      return mockOrder;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock orders
      return [];
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      throw new Error('Order not found');
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  async trackOrder(orderId: string): Promise<OrderTracking> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTracking: OrderTracking = {
        orderId,
        status: 'preparing',
        timeline: [
          {
            id: '1',
            status: 'pending',
            message: 'Order placed successfully',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
          },
          {
            id: '2',
            status: 'confirmed',
            message: 'Order confirmed by restaurant',
            timestamp: new Date(Date.now() - 8 * 60 * 1000),
          },
          {
            id: '3',
            status: 'preparing',
            message: 'Your food is being prepared',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
          },
        ],
        estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000),
      };

      return mockTracking;
    } catch (error) {
      console.error('Track order error:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Order cancelled:', orderId);
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
