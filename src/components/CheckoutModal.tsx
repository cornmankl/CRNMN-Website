import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { CreditCard, Loader2, CheckCircle } from 'lucide-react'

export function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const deliveryFee = 2.99
  const tax = total * 0.08875
  const finalTotal = total + deliveryFee + tax

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearCart()
      setOrderComplete(true)

      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 3000)

    } catch (e) {
      alert('Order failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setOrderComplete(false)
    onClose()
  }

  if (orderComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-gray-300 mb-4">
              Your order has been placed successfully.
            </p>
            <div className="bg-green-400/20 rounded-lg p-3 mb-4">
              <p className="text-green-400 font-medium">
                Estimated delivery: 25 minutes
              </p>
            </div>
            <Button onClick={handleClose} className="bg-green-400 hover:bg-green-300 text-black">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
            <h3 className="text-lg font-semibold text-white">Order Summary</h3>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-white pt-2 border-t border-gray-600">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Delivery Address</h3>
            <Input
              defaultValue={user?.address || ''}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter your delivery address"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Card Number"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
              <Input
                placeholder="MM/YY"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-green-400 hover:bg-green-300 text-black font-semibold py-3"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Place Order - ${finalTotal.toFixed(2)}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}