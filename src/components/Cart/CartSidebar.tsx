import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useState } from 'react'
import { CheckoutModal } from './CheckoutModal'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="bg-gray-900 border-gray-700 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Your Cart</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Add some delicious items to get started!</p>
            <Button onClick={onClose} className="bg-green-400 hover:bg-green-300 text-black">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="bg-gray-900 border-gray-700 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">
              Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-700">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-green-400 font-semibold">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0 text-white hover:bg-gray-700"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <span className="w-8 text-center">{item.quantity}</span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0 text-white hover:bg-gray-700"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 p-0 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-400">${total.toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-green-400 hover:bg-green-300 text-black font-bold py-3"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutModal 
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={onClose}
      />
    </>
  )
}