import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { CheckCircle, Clock, Utensils, Bike, MapPin } from 'lucide-react'
import { api } from '../../utils/api'
import { toast } from 'sonner@2.0.3'

interface OrderTrackingProps {
  orderId: string
}

const statusIcons = {
  confirmed: CheckCircle,
  preparing: Utensils,
  on_the_way: Bike,
  delivered: CheckCircle
}

const statusColors = {
  confirmed: 'bg-blue-500',
  preparing: 'bg-yellow-500',
  on_the_way: 'bg-purple-500',
  delivered: 'bg-green-500'
}

const statusLabels = {
  confirmed: 'Order Confirmed',
  preparing: 'Preparing Your Order',
  on_the_way: 'On The Way',
  delivered: 'Delivered'
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrder()
    
    // Poll for updates every 5 seconds
    const interval = setInterval(loadOrder, 5000)
    return () => clearInterval(interval)
  }, [orderId])

  const loadOrder = async () => {
    try {
      const { order } = await api.getOrder(orderId)
      setOrder(order)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Order Not Found</h2>
        <p className="text-gray-400">We couldn't find the order you're looking for.</p>
      </div>
    )
  }

  const currentStatusIndex = ['confirmed', 'preparing', 'on_the_way', 'delivered'].indexOf(order.status)

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Order Tracking</h2>
        <p className="text-gray-400">Order #{order.id}</p>
      </div>

      {/* Order Status Timeline */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        <div className="space-y-6">
          {['confirmed', 'preparing', 'on_the_way', 'delivered'].map((status, index) => {
            const Icon = statusIcons[status]
            const isCompleted = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex
            const trackingStep = order.trackingSteps?.find(step => step.status === status)

            return (
              <div key={status} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? `${statusColors[status]} border-transparent` 
                    : 'border-gray-600 bg-gray-700'
                }`}>
                  <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-semibold ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
                      {statusLabels[status]}
                    </h3>
                    {isCurrent && (
                      <Badge className="bg-green-400 text-black">Current</Badge>
                    )}
                  </div>
                  
                  {trackingStep && (
                    <div className="space-y-1">
                      <p className="text-gray-300 text-sm">{trackingStep.message}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(trackingStep.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Order Details */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Order Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Delivering to: {order.deliveryAddress}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Estimated delivery: {new Date(order.estimatedDelivery).toLocaleTimeString()}
            </span>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <h4 className="text-white font-medium mb-3">Items Ordered</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-gray-300">{item.quantity}x {item.name}</span>
                <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t border-gray-600 mt-3 pt-3">
              <div className="flex justify-between items-center text-lg font-semibold text-white">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}