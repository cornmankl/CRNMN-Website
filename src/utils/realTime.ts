// Real-time features using WebSocket simulation
export class RealTimeManager {
  private static instance: RealTimeManager;
  private listeners: Map<string, Set<Function>> = new Map();
  private isConnected = false;

  static getInstance(): RealTimeManager {
    if (!RealTimeManager.instance) {
      RealTimeManager.instance = new RealTimeManager();
    }
    return RealTimeManager.instance;
  }

  connect(): void {
    this.isConnected = true;
    console.log('Real-time connection established');
    
    // Simulate real-time updates
    this.startSimulation();
  }

  disconnect(): void {
    this.isConnected = false;
    console.log('Real-time connection closed');
  }

  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  private startSimulation(): void {
    // Simulate order status updates
    setInterval(() => {
      if (this.isConnected) {
        this.emit('orderUpdate', {
          orderId: 'ORD-' + Math.random().toString(36).substr(2, 9),
          status: 'preparing',
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Every 30 seconds

    // Simulate new notifications
    setInterval(() => {
      if (this.isConnected) {
        this.emit('notification', {
          id: 'NOTIF-' + Math.random().toString(36).substr(2, 9),
          type: 'info',
          title: 'New Special Available!',
          message: 'Try our limited-time corn special today!',
          timestamp: new Date().toISOString()
        });
      }
    }, 60000); // Every minute
  }
}

export const realTimeManager = RealTimeManager.getInstance();
