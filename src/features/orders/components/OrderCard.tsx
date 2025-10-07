import { Order } from '../types/order.types';
import { formatPrice } from '../../cart/utils/cartHelpers';
import { Button } from '../../../components/ui/button';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Confirmed' },
  preparing: { icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Preparing' },
  ready: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Ready' },
  out_for_delivery: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'On the Way' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-600/10', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Cancelled' },
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="card-elevated hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">Order #{order.id}</h3>
            <div className={`${status.bg} ${status.color} px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString('en-MY', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gradient">
            {formatPrice(order.total)}
          </div>
          <div className="text-xs text-muted-foreground">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="space-y-2 mb-4">
        {order.items.slice(0, 2).map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-sm">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name}
                className="w-10 h-10 rounded-md object-cover"
              />
            )}
            <span className="flex-1 truncate">{item.name}</span>
            <span className="text-muted-foreground">×{item.quantity}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="text-sm text-muted-foreground">
            +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link to={`/orders/${order.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready' || order.status === 'out_for_delivery') && (
          <Link to={`/orders/${order.id}/track`} className="flex-1">
            <Button className="w-full">
              Track Order
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
