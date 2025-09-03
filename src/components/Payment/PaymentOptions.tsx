import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Banknote, 
  Shield, 
  CheckCircle,
  Clock,
  Gift,
  Star
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'ewallet' | 'bank' | 'cash' | 'crypto';
  icon: React.ReactNode;
  description: string;
  processingFee: number;
  processingTime: string;
  isAvailable: boolean;
  isRecommended?: boolean;
  features: string[];
}

interface PaymentOptionsProps {
  onSelectPayment: (method: PaymentMethod) => void;
  selectedMethod?: string;
  totalAmount: number;
}

export function PaymentOptions({ onSelectPayment, selectedMethod, totalAmount }: PaymentOptionsProps) {
  const [selectedId, setSelectedId] = useState(selectedMethod || '');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, American Express',
      processingFee: 0,
      processingTime: 'Instant',
      isAvailable: true,
      isRecommended: true,
      features: ['Secure', 'Instant', 'Widely accepted']
    },
    {
      id: 'tng',
      name: 'Touch \'n Go eWallet',
      type: 'ewallet',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay with your TnG eWallet',
      processingFee: 0,
      processingTime: 'Instant',
      isAvailable: true,
      isRecommended: true,
      features: ['Cashback 2%', 'Instant', 'Easy top-up']
    },
    {
      id: 'grabpay',
      name: 'GrabPay',
      type: 'ewallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Pay with GrabPay wallet',
      processingFee: 0,
      processingTime: 'Instant',
      isAvailable: true,
      features: ['GrabRewards', 'Instant', 'Secure']
    },
    {
      id: 'boost',
      name: 'Boost',
      type: 'ewallet',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay with Boost wallet',
      processingFee: 0,
      processingTime: 'Instant',
      isAvailable: true,
      features: ['Cashback 1%', 'Instant', 'Loyalty points']
    },
    {
      id: 'fpx',
      name: 'Online Banking',
      type: 'bank',
      icon: <Banknote className="w-6 h-6" />,
      description: 'Direct bank transfer via FPX',
      processingFee: 0,
      processingTime: '1-2 minutes',
      isAvailable: true,
      features: ['No fees', 'Secure', 'Direct transfer']
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      type: 'cash',
      icon: <Banknote className="w-6 h-6" />,
      description: 'Pay when your order arrives',
      processingFee: 2.00,
      processingTime: 'On delivery',
      isAvailable: true,
      features: ['No upfront payment', 'Cash only', 'Delivery fee applies']
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      type: 'crypto',
      icon: <Star className="w-6 h-6" />,
      description: 'Pay with Bitcoin, Ethereum',
      processingFee: 0,
      processingTime: '5-10 minutes',
      isAvailable: false,
      features: ['Decentralized', 'Low fees', 'Coming soon']
    }
  ];

  const handleSelectMethod = (method: PaymentMethod) => {
    if (!method.isAvailable) return;
    setSelectedId(method.id);
    onSelectPayment(method);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'card': return 'text-blue-500';
      case 'ewallet': return 'text-green-500';
      case 'bank': return 'text-purple-500';
      case 'cash': return 'text-orange-500';
      case 'crypto': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Choose Payment Method</h3>
        <p className="text-[var(--neutral-400)]">
          Total Amount: <span className="text-[var(--neon-green)] font-semibold">
            RM {totalAmount.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={cn(
              "cursor-pointer transition-all duration-200",
              selectedId === method.id
                ? "border-[var(--neon-green)] bg-[var(--neutral-800)]"
                : "border-[var(--neutral-700)] hover:border-[var(--neutral-600)]",
              !method.isAvailable && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleSelectMethod(method)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", getTypeColor(method.type))}>
                    {method.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{method.name}</h4>
                      {method.isRecommended && (
                        <Badge className="bg-[var(--neon-green)] text-black text-xs">
                          Recommended
                        </Badge>
                      )}
                      {!method.isAvailable && (
                        <Badge variant="outline" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--neutral-400)]">
                      {method.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-[var(--neutral-500)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {method.processingTime}
                      </span>
                      {method.processingFee > 0 && (
                        <span className="flex items-center gap-1">
                          <Banknote className="w-3 h-3" />
                          +RM {method.processingFee.toFixed(2)} fee
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedId === method.id && (
                    <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                  )}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-[var(--neutral-400)]">
                      <Shield className="w-3 h-3" />
                      Secure
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mt-3">
                {method.features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-[var(--neutral-600)] text-[var(--neutral-400)]"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Security Notice */}
      <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[var(--neon-green)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">Secure Payment</h4>
              <p className="text-sm text-[var(--neutral-400)]">
                All payments are processed securely with 256-bit SSL encryption. 
                We never store your payment information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
