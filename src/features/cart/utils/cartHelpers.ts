import { CartItem, CartTotals, CartSummary } from '../types/cart.types';

export const DELIVERY_FEE = 5.00;
export const TAX_RATE = 0.06; // 6%
export const FREE_DELIVERY_THRESHOLD = 50.00;

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
      : item.price;
    return total + (price * item.quantity);
  }, 0);
};

export const calculateDeliveryFee = (subtotal: number): number => {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
};

export const calculateTax = (subtotal: number): number => {
  return subtotal * TAX_RATE;
};

export const calculateTotals = (items: CartItem[]): CartTotals => {
  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateTax(subtotal);
  const total = subtotal + deliveryFee + tax;

  return {
    subtotal,
    deliveryFee,
    tax,
    total,
  };
};

export const getCartSummary = (items: CartItem[]): CartSummary => {
  const totals = calculateTotals(items);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const uniqueItemCount = items.length;

  return {
    ...totals,
    itemCount,
    uniqueItemCount,
  };
};

export const formatPrice = (price: number): string => {
  return `RM ${price.toFixed(2)}`;
};

export const canAddToCart = (item: CartItem, currentQuantity: number): boolean => {
  if (item.maxQuantity && currentQuantity >= item.maxQuantity) {
    return false;
  }
  return true;
};

export const getItemTotal = (item: CartItem): number => {
  const price = typeof item.price === 'string' 
    ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
    : item.price;
  return price * item.quantity;
};

export const validateCartItem = (item: Partial<CartItem>): boolean => {
  return !!(
    item.id &&
    item.name &&
    item.price !== undefined &&
    item.quantity !== undefined &&
    item.quantity > 0
  );
};
