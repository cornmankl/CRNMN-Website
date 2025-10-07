import { useOrdersStore } from '../../../store';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const store = useOrdersStore();

  const createOrder = async (orderData: any) => {
    try {
      store.setLoading(true);
      const order = await orderService.createOrder(orderData);
      store.addOrder(order);
      store.setActiveOrder(order);
      return order;
    } catch (error) {
      console.error('Create order failed:', error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  const loadOrders = async (userId: string) => {
    try {
      store.setLoading(true);
      const orders = await orderService.getOrders(userId);
      store.setOrders(orders);
    } catch (error) {
      console.error('Load orders failed:', error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  const trackOrder = async (orderId: string) => {
    try {
      return await orderService.trackOrder(orderId);
    } catch (error) {
      console.error('Track order failed:', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      store.setLoading(true);
      await orderService.cancelOrder(orderId);
      store.updateOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Cancel order failed:', error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  return {
    orders: store.orders,
    activeOrder: store.activeOrder,
    isLoading: store.isLoading,
    createOrder,
    loadOrders,
    trackOrder,
    cancelOrder,
    setActiveOrder: store.setActiveOrder,
  };
};
