import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
// import { label } from '../ui/label'; // Removed to fix import error
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  MapPin, 
  Clock, 
  Truck, 
  Shield, 
  Star,
  Gift,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Lock,
  Zap,
  Timer
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  icon: React.ReactNode;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  processingFee?: number;
}

interface EnhancedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  onSuccess: (orderId: string) => void;
  user?: any;
}

export function EnhancedCheckoutModal({ 
  isOpen, 
  onClose, 
  items, 
  onSuccess, 
  user 
}: EnhancedCheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    // Delivery Information
    deliveryAddress: user?.address || '',
    deliveryInstructions: '',
    contactNumber: user?.phone || '',
    
    // Delivery Options
    deliveryOption: 'standard',
    deliveryTime: 'asap',
    scheduledDate: '',
    scheduledTime: '',
    
    // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: user?.name || '',
    
    // Digital Wallet
    walletType: 'grabpay',
    
    // Preferences
    savePaymentMethod: false,
    subscribeUpdates: true,
    applyLoyaltyPoints: false,
    
    // Promo
    promoCode: '',
    promoApplied: false,
    promoDiscount: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deliveryEstimate, setDeliveryEstimate] = useState<any>(null);

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'express',
      name: 'Express Delivery',
      description: '15-25 minutes',
      price: 5.50,
      estimatedTime: '15-25 min',
      icon: <Zap className="w-5 h-5 text-yellow-500" />
    },
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '30-45 minutes',
      price: 2.50,
      estimatedTime: '30-45 min',
      icon: <Truck className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'scheduled',
      name: 'Scheduled Delivery',
      description: 'Choose your time',
      price: 3.00,
      estimatedTime: 'Custom',
      icon: <Calendar className="w-5 h-5 text-green-500" />
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, AMEX',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'digital_wallet',
      name: 'Digital Wallet',
      description: 'GrabPay, Touch \'n Go, Boost',
      icon: <Smartphone className="w-5 h-5" />,
      processingFee: 0.50
    },
    {
      id: 'online_banking',
      name: 'Online Banking',
      description: 'FPX, Maybank, CIMB',
      icon: <Wallet className="w-5 h-5" />
    }
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryOptions.find(opt => opt.id === formData.deliveryOption)?.price || 0;
  const serviceFee = 1.50;
  const processingFee = paymentMethods.find(method => method.id === formData.paymentMethod)?.processingFee || 0;
  const loyaltyDiscount = formData.applyLoyaltyPoints ? Math.min(user?.loyaltyPoints * 0.01, subtotal * 0.2) : 0;
  const promoDiscount = formData.promoApplied ? formData.promoDiscount : 0;
  const total = subtotal + deliveryFee + serviceFee + processingFee - loyaltyDiscount - promoDiscount;

  useEffect(() => {
    if (formData.deliveryAddress) {
      // Mock delivery estimation
      setDeliveryEstimate({
        distance: '2.3 km',
        estimatedTime: deliveryOptions.find(opt => opt.id === formData.deliveryOption)?.estimatedTime
      });
    }
  }, [formData.deliveryAddress, formData.deliveryOption]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.deliveryAddress.trim()) {
        newErrors.deliveryAddress = 'Delivery address is required';
      }
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      }
      if (formData.deliveryOption === 'scheduled') {
        if (!formData.scheduledDate) {
          newErrors.scheduledDate = 'Please select a date';
        }
        if (!formData.scheduledTime) {
          newErrors.scheduledTime = 'Please select a time';
        }
      }
    }

    if (step === 2 && formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      }
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePromoCode = () => {
    // Mock promo code validation
    const promoCodes = {
      'CORN10': { discount: 10, type: 'percentage' },
      'SAVE5': { discount: 5, type: 'fixed' },
      'NEWBIE20': { discount: 20, type: 'percentage' }
    };

    const promo = promoCodes[formData.promoCode as keyof typeof promoCodes];
    if (promo) {
      const discount = promo.type === 'percentage' 
        ? (subtotal * promo.discount / 100) 
        : promo.discount;
      
      setFormData(prev => ({
        ...prev,
        promoApplied: true,
        promoDiscount: discount
      }));
    } else {
      setErrors(prev => ({ ...prev, promoCode: 'Invalid promo code' }));
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
      setOrderComplete(true);
      
      // Clear cart and call success handler
      setTimeout(() => {
        onSuccess(newOrderId);
        onClose();
        setOrderComplete(false);
        setCurrentStep(1);
      }, 3000);

    } catch (error) {
      setErrors({ general: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
            currentStep >= step 
              ? "bg-[var(--neon-green)] text-black" 
              : "bg-[var(--neutral-700)] text-[var(--neutral-400)]"
          )}>
            {step}
          </div>
          {step < 3 && (
            <div className={cn(
              "w-12 h-0.5 mx-2",
              currentStep > step ? "bg-[var(--neon-green)]" : "bg-[var(--neutral-700)]"
            )} />
          )}
        </div>
      ))}
    </div>
  );

  if (orderComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-[var(--neutral-400)] mb-4">
              Your order #{orderId} has been placed successfully.
            </p>
            <div className="bg-[var(--neutral-800)] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-[var(--neon-green)]">
                <Timer className="w-4 h-4" />
                <span className="font-semibold">
                  Estimated delivery: {deliveryEstimate?.estimatedTime}
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--neutral-500)]">
              You'll receive updates via SMS and email
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold text-center">
            Secure Checkout
          </DialogTitle>
        </DialogHeader>

        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[var(--neutral-300)] font-medium text-sm">Delivery Address *</label>
                      <textarea
                        rows={3}
                        value={formData.deliveryAddress}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                        className={cn(
                          "w-full p-3 bg-[var(--neutral-900)] border rounded-lg text-white resize-none",
                          errors.deliveryAddress ? "border-red-500" : "border-[var(--neutral-600)]"
                        )}
                        placeholder="Enter your complete delivery address"
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.deliveryAddress}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[var(--neutral-300)] font-medium text-sm">Delivery Instructions (Optional)</label>
                      <Input
                        value={formData.deliveryInstructions}
                        onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                        className="bg-[var(--neutral-900)] border-[var(--neutral-600)] text-white"
                        placeholder="e.g., Leave at door, Ring bell"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[var(--neutral-300)] font-medium text-sm">Contact Number *</label>
                      <Input
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        className={cn(
                          "bg-[var(--neutral-900)] border text-white",
                          errors.contactNumber ? "border-red-500" : "border-[var(--neutral-600)]"
                        )}
                        placeholder="+60 12-345 6789"
                      />
                      {errors.contactNumber && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Delivery Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.deliveryOption}
                      onValueChange={(value) => handleInputChange('deliveryOption', value)}
                      className="space-y-3"
                    >
                      {deliveryOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-3 border border-[var(--neutral-600)] rounded-lg hover:border-[var(--neon-green)] transition-colors">
                          <RadioGroupItem 
                            value={option.id} 
                            className="border-[var(--neutral-500)] data-[state=checked]:bg-[var(--neon-green)] data-[state=checked]:border-[var(--neon-green)]"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {option.icon}
                              <div>
                                <h3 className="font-semibold text-white">{option.name}</h3>
                                <p className="text-sm text-[var(--neutral-400)]">{option.description}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-[var(--neon-green)]">
                              +RM {option.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    {formData.deliveryOption === 'scheduled' && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[var(--neutral-300)] font-medium text-sm">Date *</label>
                          <Input
                            type="date"
                            value={formData.scheduledDate}
                            onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={cn(
                              "bg-[var(--neutral-900)] border text-white",
                              errors.scheduledDate ? "border-red-500" : "border-[var(--neutral-600)]"
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[var(--neutral-300)] font-medium text-sm">Time *</label>
                          <Input
                            type="time"
                            value={formData.scheduledTime}
                            onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                            className={cn(
                              "bg-[var(--neutral-900)] border text-white",
                              errors.scheduledTime ? "border-red-500" : "border-[var(--neutral-600)]"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      className="space-y-3"
                    >
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-3 border border-[var(--neutral-600)] rounded-lg hover:border-[var(--neon-green)] transition-colors">
                          <RadioGroupItem 
                            value={method.id} 
                            className="border-[var(--neutral-500)] data-[state=checked]:bg-[var(--neon-green)] data-[state=checked]:border-[var(--neon-green)]"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {method.icon}
                              <div>
                                <h3 className="font-semibold text-white">{method.name}</h3>
                                <p className="text-sm text-[var(--neutral-400)]">{method.description}</p>
                              </div>
                            </div>
                            {method.processingFee && (
                              <span className="text-sm text-[var(--neutral-400)]">
                                +RM {method.processingFee.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    {/* Credit Card Form */}
                    {formData.paymentMethod === 'card' && (
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[var(--neutral-300)] font-medium text-sm">Card Number *</label>
                          <div className="relative">
                            <Input
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className={cn(
                                "bg-[var(--neutral-900)] border text-white pl-10",
                                errors.cardNumber ? "border-red-500" : "border-[var(--neutral-600)]"
                              )}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[var(--neutral-300)] font-medium text-sm">Expiry Date *</label>
                            <Input
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              className={cn(
                                "bg-[var(--neutral-900)] border text-white",
                                errors.expiryDate ? "border-red-500" : "border-[var(--neutral-600)]"
                              )}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[var(--neutral-300)] font-medium text-sm">CVV *</label>
                            <Input
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              className={cn(
                                "bg-[var(--neutral-900)] border text-white",
                                errors.cvv ? "border-red-500" : "border-[var(--neutral-600)]"
                              )}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[var(--neutral-300)] font-medium text-sm">Cardholder Name *</label>
                          <Input
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            className={cn(
                              "bg-[var(--neutral-900)] border text-white",
                              errors.cardName ? "border-red-500" : "border-[var(--neutral-600)]"
                            )}
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="savePayment"
                            checked={formData.savePaymentMethod}
                            onCheckedChange={(checked) => handleInputChange('savePaymentMethod', !!checked)}
                            className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)] data-[state=checked]:border-[var(--neon-green)]"
                          />
                          <label htmlFor="savePayment" className="text-sm text-[var(--neutral-400)]">
                            Save payment method for future orders
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Digital Wallet Options */}
                    {formData.paymentMethod === 'digital_wallet' && (
                      <div className="mt-6">
                        <RadioGroup
                          value={formData.walletType}
                          onValueChange={(value) => handleInputChange('walletType', value)}
                          className="grid grid-cols-3 gap-3"
                        >
                          {['grabpay', 'tng', 'boost'].map((wallet) => (
                            <div key={wallet} className="flex items-center space-x-2 p-3 border border-[var(--neutral-600)] rounded-lg">
                              <RadioGroupItem value={wallet} />
                              <span className="text-white capitalize">{wallet.replace('tng', 'Touch \'n Go')}</span>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Promo Code */}
                <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Promo Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        value={formData.promoCode}
                        onChange={(e) => handleInputChange('promoCode', e.target.value.toUpperCase())}
                        className={cn(
                          "bg-[var(--neutral-900)] border text-white",
                          errors.promoCode ? "border-red-500" : "border-[var(--neutral-600)]"
                        )}
                        placeholder="Enter promo code"
                        disabled={formData.promoApplied}
                      />
                      <Button
                        onClick={handlePromoCode}
                        disabled={!formData.promoCode || formData.promoApplied}
                        className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                      >
                        Apply
                      </Button>
                    </div>
                    {errors.promoCode && (
                      <p className="text-red-400 text-sm mt-1">{errors.promoCode}</p>
                    )}
                    {formData.promoApplied && (
                      <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Promo code applied! You saved RM {formData.promoDiscount.toFixed(2)}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Loyalty Points */}
                {user?.loyaltyPoints > 0 && (
                  <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="loyaltyPoints"
                            checked={formData.applyLoyaltyPoints}
                            onCheckedChange={(checked) => handleInputChange('applyLoyaltyPoints', !!checked)}
                            className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)] data-[state=checked]:border-[var(--neon-green)]"
                          />
                          <label htmlFor="loyaltyPoints" className="text-white">
                            Use {user.loyaltyPoints} loyalty points
                          </label>
                        </div>
                        <span className="text-[var(--neon-green)] font-semibold">
                          -RM {loyaltyDiscount.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="border-[var(--neutral-600)] hover:border-[var(--neutral-500)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              {currentStep < 2 ? (
                <Button
                  onClick={handleNextStep}
                  className="ml-auto bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="ml-auto bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 min-w-[140px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)] sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{item.name}</h4>
                        <p className="text-xs text-[var(--neutral-400)]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-white font-medium">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[var(--neutral-600)]" />

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--neutral-400)]">Subtotal</span>
                    <span className="text-white">RM {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--neutral-400)]">Delivery Fee</span>
                    <span className="text-white">RM {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--neutral-400)]">Service Fee</span>
                    <span className="text-white">RM {serviceFee.toFixed(2)}</span>
                  </div>
                  {processingFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--neutral-400)]">Processing Fee</span>
                      <span className="text-white">RM {processingFee.toFixed(2)}</span>
                    </div>
                  )}
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Loyalty Discount</span>
                      <span>-RM {loyaltyDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Promo Discount</span>
                      <span>-RM {promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-[var(--neutral-600)]" />

                <div className="flex justify-between font-bold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-[var(--neon-green)]">RM {total.toFixed(2)}</span>
                </div>

                {/* Delivery Info */}
                {deliveryEstimate && (
                  <div className="bg-[var(--neutral-900)] rounded-lg p-3">
                    <div className="flex items-center gap-2 text-[var(--neon-green)] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Est. delivery: {deliveryEstimate.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--neutral-400)] text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>Distance: {deliveryEstimate.distance}</span>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-[var(--neutral-400)] text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
