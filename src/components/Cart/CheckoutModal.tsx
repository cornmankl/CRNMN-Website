import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../utils/api'
import { toast } from 'sonner@2.0.3'
import { MapPin, Clock, CreditCard } from 'lucide-react'
import { AuthModal } from '../Auth/AuthModal'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [deliveryEstimate, setDeliveryEstimate] = useState(null)
  const [estimateLoading, setEstimateLoading] = useState(false)

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  useEffect(() => {
    if (profile?.address) {
      setFormData(prev => ({
        ...prev,
        deliveryAddress: profile.address
      }))
      getDeliveryEstimate(profile.address)
    }
  }, [profile])

  const getDeliveryEstimate = async (address: string) => {
    if (!address) return
    
    setEstimateLoading(true)
    try {
      // Mock geolocation - in real app, use Google Maps Geocoding API
      const mockLocation = {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
        address
      }
      
      const estimate = await api.getDeliveryEstimate(mockLocation)
      setDeliveryEstimate(estimate)
    } catch (error) {
      console.error('Delivery estimate error:', error)
    } finally {
      setEstimateLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setShowAuth(true)
      return
    }

    setLoading(true)

    try {
      // Process payment
      const paymentResult = await api.processPayment({
        amount: total + (deliveryEstimate?.deliveryFee || 0),
        paymentMethod: formData.paymentMethod,
        cardDetails: {
          number: formData.cardNumber,
          expiry: formData.expiryDate,
          cvv: formData.cvv,
          name: formData.cardName
        }
      })

      // Create order
      const orderResult = await api.createOrder({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: total + (deliveryEstimate?.deliveryFee || 0),
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod,
        paymentId: paymentResult.paymentId
      })

      clearCart()
      toast.success('Order placed successfully! You will receive updates on delivery.')
      onSuccess()
      
      // Show order tracking
      setTimeout(() => {
        window.location.hash = `#order/${orderResult.order.id}`
      }, 1000)
      
    } catch (error: any) {
      toast.error(error.message || 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'deliveryAddress') {
      getDeliveryEstimate(value)
    }
  }

  const subtotal = total
  const deliveryFee = deliveryEstimate?.deliveryFee || 0
  const grandTotal = subtotal + deliveryFee

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Checkout</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Order Summary</h3>
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <span className="text-gray-300">{item.quantity}x {item.name}</span>
                  <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-600 mt-3 pt-3 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-3">
              <Label className="text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </Label>
              <Input
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                placeholder="Enter your delivery address"
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
              
              {estimateLoading && (
                <p className="text-gray-400 text-sm">Calculating delivery time...</p>
              )}
              
              {deliveryEstimate && (
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Estimated delivery: {deliveryEstimate.estimatedTime} minutes</span>
                  </div>
                  <p className="text-gray-300 text-xs mt-1">
                    Distance: {deliveryEstimate.distance}km
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-gray-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </Label>
              
              <Select value={formData.paymentMethod} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, paymentMethod: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>

              {formData.paymentMethod === 'card' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-gray-300">Card Number</Label>
                    <Input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Expiry Date</Label>
                    <Input
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">CVV</Label>
                    <Input
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-gray-300">Cardholder Name</Label>
                    <Input
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !deliveryEstimate?.canDeliver}
                className="flex-1 bg-green-400 hover:bg-green-300 text-black font-bold"
              >
                {loading ? 'Processing...' : `Place Order - $${grandTotal.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </>
  )
}