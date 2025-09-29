import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Eye, Package } from 'lucide-react'
import { api } from '../../utils/api'
import { toast } from 'sonner@2.0.3'

interface OrderHistoryProps {
  onViewOrder: (orderId: string) => void
}

const statusColors = {
  confirmed: 'bg-blue-500/20 text-blue-400',
  preparing: 'bg-yellow-500/20 text-yellow-400',
  on_the_way: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400'
}

export function OrderHistory({ onViewOrder }: OrderHistoryProps) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrderHistory()
  }, [])

  const loadOrderHistory = async () => {
    try {
      const { orders } = await api.getOrderHistory()
      setOrders(orders)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load order history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Orders Yet</h2>
        <p className="text-gray-400 mb-6">Your order history will appear here once you place your first order.</p>
        <Button 
          onClick={() => window.location.hash = '#menu'}
          className="bg-green-400 hover:bg-green-300 text-black"
        >
          Order Now
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="bg-gray-800 border-gray-700 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold">Order #{order.id}</h3>
                <p className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="text-right">
                <Badge className={statusColors[order.status] || statusColors.confirmed}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <p className="text-white font-semibold mt-1">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.quantity}x {item.name}</span>
                  <span className="text-gray-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-gray-400 text-sm">
                  +{order.items.length - 3} more items
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-600">
              <p className="text-gray-400 text-sm">
                Delivered to: {order.deliveryAddress.split(',')[0]}...
              </p>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewOrder(order.id)}
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}