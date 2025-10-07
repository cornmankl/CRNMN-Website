export interface CartItem {
  id: string;
  name: string;
  price: string | number;
  quantity: number;
  image?: string;
  description?: string;
  category?: string;
  maxQuantity?: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface CartSummary extends CartTotals {
  itemCount: number;
  uniqueItemCount: number;
}

export interface CheckoutData {
  items: CartItem[];
  totals: CartTotals;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: 'card' | 'cash' | 'ewallet';
  deliveryMethod: 'delivery' | 'pickup';
  notes?: string;
}
