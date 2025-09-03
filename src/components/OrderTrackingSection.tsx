import React from 'react';
import { OrderTrackingDashboard } from './Order/OrderTrackingDashboard';

interface OrderTrackingSectionProps {
  activeOrder?: any;
  user?: any;
}

export function OrderTrackingSection({ activeOrder, user }: OrderTrackingSectionProps = {}) {
  return (
    <OrderTrackingDashboard 
      activeOrder={activeOrder}
      user={user}
    />
  );
}