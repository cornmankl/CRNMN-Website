import { Order, OrderTracking, OrderStatus } from '../types/order.types';
import { CartItem } from '../../cart/types/cart.types';
import { supabase } from '../../../shared/services/supabase';

class OrderService {
  private useSupabase = !!import.meta.env.VITE_SUPABASE_URL;

  async createOrder(orderData: {
    items: CartItem[];
    totals: any;
    customerInfo: any;
    deliveryMethod: string;
    paymentMethod: string;
    notes?: string;
  }): Promise<Order> {
    try {
      if (this.useSupabase) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Generate order number
        const orderNumber = 'ORD-' + Date.now();
        
        // Create order in database
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            order_number: orderNumber,
            status: 'pending',
            subtotal: orderData.totals.subtotal,
            delivery_fee: orderData.totals.deliveryFee,
            tax: orderData.totals.tax,
            total: orderData.totals.total,
            delivery_address: orderData.customerInfo.address || '123 Main St, Kuala Lumpur',
            delivery_method: orderData.deliveryMethod,
            payment_method: orderData.paymentMethod,
            payment_status: 'pending',
            tracking_number: 'TRK-' + Date.now(),
            estimated_delivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
            customer_name: orderData.customerInfo.name,
            customer_email: orderData.customerInfo.email || user.email,
            customer_phone: orderData.customerInfo.phone,
            notes: orderData.notes,
          })
          .select()
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error('Failed to create order');

        // Create order items
        const orderItems = orderData.items.map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          name: item.name,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          quantity: item.quantity,
          image: item.image,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Create initial tracking entry
        await supabase.from('order_tracking').insert({
          order_id: orderData.id,
          status: 'pending',
          message: 'Order received and is being processed',
          location: 'CRNMN Kitchen',
        });

        // Clear user's cart
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        return this.transformSupabaseOrder(orderData, orderItems);
      }

      // Fallback to mock
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
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
        notes: orderData.notes,
        customerInfo: orderData.customerInfo,
      };

      return mockOrder;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  async getOrders(userId?: string): Promise<Order[]> {
    try {
      if (this.useSupabase) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch orders with items
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return (orders || []).map(order => 
          this.transformSupabaseOrder(order, order.order_items)
        );
      }

      // Fallback to mock - return empty
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      if (this.useSupabase) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { data: order, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!order) throw new Error('Order not found');

        return this.transformSupabaseOrder(order, order.order_items);
      }

      throw new Error('Order not found');
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  async trackOrder(orderId: string): Promise<OrderTracking> {
    try {
      if (this.useSupabase) {
        const { data: tracking, error } = await supabase
          .from('order_tracking')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!tracking || tracking.length === 0) {
          // Create default tracking if none exists
          return {
            orderId,
            status: 'pending',
            updates: [
              {
                status: 'pending',
                timestamp: new Date(),
                message: 'Order received',
                location: 'CRNMN Kitchen',
              },
            ],
          };
        }

        return {
          orderId,
          status: tracking[0].status as OrderStatus,
          updates: tracking.map(t => ({
            status: t.status as OrderStatus,
            timestamp: new Date(t.created_at),
            message: t.message,
            location: t.location,
          })),
        };
      }

      // Fallback to mock
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTracking: OrderTracking = {
        orderId,
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
        currentLocation: 'Preparing in kitchen',
        updates: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            message: 'Order received and confirmed',
            location: 'CRNMN Kitchen',
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 8 * 60 * 1000),
            message: 'Payment confirmed',
            location: 'CRNMN Kitchen',
          },
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            message: 'Your order is being prepared',
            location: 'CRNMN Kitchen',
          },
        ],
      };

      return mockTracking;
    } catch (error) {
      console.error('Track order error:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<void> {
    try {
      if (this.useSupabase) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { error } = await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            notes: reason || 'Cancelled by user',
          })
          .eq('id', orderId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Add tracking update
        await supabase.from('order_tracking').insert({
          order_id: orderId,
          status: 'cancelled',
          message: reason || 'Order cancelled by customer',
        });

        return;
      }

      // Fallback
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  // Transform Supabase data to Order type
  private transformSupabaseOrder(order: any, items: any[]): Order {
    return {
      id: order.id,
      userId: order.user_id,
      items: (items || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: parseFloat(order.subtotal),
      deliveryFee: parseFloat(order.delivery_fee),
      tax: parseFloat(order.tax),
      total: parseFloat(order.total),
      status: order.status as OrderStatus,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at),
      deliveryAddress: order.delivery_address,
      deliveryMethod: order.delivery_method,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      trackingNumber: order.tracking_number,
      estimatedDelivery: order.estimated_delivery ? new Date(order.estimated_delivery) : undefined,
      deliveredAt: order.delivered_at ? new Date(order.delivered_at) : undefined,
      notes: order.notes,
      customerInfo: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address: order.delivery_address,
      },
    };
  }
}

export const orderService = new OrderService();
export default orderService;
