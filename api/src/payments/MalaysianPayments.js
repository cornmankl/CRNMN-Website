// Malaysian Payment Methods Integration for CORNMAN
// Based on comprehensive development guide

import Stripe from 'stripe';
import crypto from 'crypto';

export class MalaysianPaymentProcessor {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.fpxConfig = {
      merchantId: process.env.FPX_MERCHANT_ID,
      merchantKey: process.env.FPX_MERCHANT_KEY,
      baseUrl: process.env.FPX_BASE_URL
    };
    this.touchNGoConfig = {
      appId: process.env.TNG_APP_ID,
      appSecret: process.env.TNG_APP_SECRET,
      baseUrl: process.env.TNG_BASE_URL
    };
    this.grabPayConfig = {
      partnerId: process.env.GRABPAY_PARTNER_ID,
      partnerSecret: process.env.GRABPAY_PARTNER_SECRET,
      baseUrl: process.env.GRABPAY_BASE_URL
    };
  }

  // FPX (Financial Process Exchange) Integration
  async processFPXPayment(paymentData) {
    const {
      orderId,
      amount,
      customerEmail,
      customerPhone,
      bankCode,
      returnUrl,
      callbackUrl
    } = paymentData;

    try {
      // Generate FPX checksum
      const checksum = this.generateFPXChecksum({
        merchantId: this.fpxConfig.merchantId,
        orderId,
        amount: (amount * 100).toString(), // Convert to cents
        currency: 'MYR',
        customerEmail,
        customerPhone,
        bankCode,
        returnUrl,
        callbackUrl
      });

      const fpxRequest = {
        merchantId: this.fpxConfig.merchantId,
        orderId,
        amount: (amount * 100).toString(),
        currency: 'MYR',
        customerEmail,
        customerPhone,
        bankCode,
        returnUrl,
        callbackUrl,
        checksum
      };

      // Send request to FPX
      const response = await fetch(`${this.fpxConfig.baseUrl}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.fpxConfig.merchantKey}`
        },
        body: JSON.stringify(fpxRequest)
      });

      return await response.json();
    } catch (error) {
      throw new Error(`FPX Payment Error: ${error.message}`);
    }
  }

  // Touch 'n Go eWallet Integration
  async processTouchNGoPayment(paymentData) {
    const {
      orderId,
      amount,
      customerPhone,
      returnUrl,
      callbackUrl
    } = paymentData;

    try {
      // Generate TnG access token
      const accessToken = await this.getTouchNGoAccessToken();

      const tngRequest = {
        orderId,
        amount: amount.toString(),
        currency: 'MYR',
        customerPhone,
        returnUrl,
        callbackUrl,
        description: `CORNMAN Order #${orderId}`
      };

      const response = await fetch(`${this.touchNGoConfig.baseUrl}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-App-Id': this.touchNGoConfig.appId
        },
        body: JSON.stringify(tngRequest)
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Touch 'n Go Payment Error: ${error.message}`);
    }
  }

  // GrabPay Integration
  async processGrabPayPayment(paymentData) {
    const {
      orderId,
      amount,
      customerPhone,
      returnUrl,
      callbackUrl
    } = paymentData;

    try {
      // Generate GrabPay access token
      const accessToken = await this.getGrabPayAccessToken();

      const grabPayRequest = {
        partnerTxID: orderId,
        partnerGroupTxID: orderId,
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'MYR',
        description: `CORNMAN Order #${orderId}`,
        metaInfo: {
          returnURL: returnUrl,
          callbackURL: callbackUrl
        }
      };

      const response = await fetch(`${this.grabPayConfig.baseUrl}/v1/charge/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-GID-AUTH': this.grabPayConfig.partnerId
        },
        body: JSON.stringify(grabPayRequest)
      });

      return await response.json();
    } catch (error) {
      throw new Error(`GrabPay Payment Error: ${error.message}`);
    }
  }

  // Stripe Integration (for international cards)
  async processStripePayment(paymentData) {
    const {
      orderId,
      amount,
      customerEmail,
      paymentMethodId,
      returnUrl
    } = paymentData;

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'myr',
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        return_url: returnUrl,
        metadata: {
          orderId,
          customerEmail
        }
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      throw new Error(`Stripe Payment Error: ${error.message}`);
    }
  }

  // Generate FPX Checksum
  generateFPXChecksum(data) {
    const sortedKeys = Object.keys(data).sort();
    const queryString = sortedKeys
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    return crypto
      .createHmac('sha256', this.fpxConfig.merchantKey)
      .update(queryString)
      .digest('hex');
  }

  // Get Touch 'n Go Access Token
  async getTouchNGoAccessToken() {
    const response = await fetch(`${this.touchNGoConfig.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.touchNGoConfig.appId,
        client_secret: this.touchNGoConfig.appSecret
      })
    });

    const data = await response.json();
    return data.access_token;
  }

  // Get GrabPay Access Token
  async getGrabPayAccessToken() {
    const response = await fetch(`${this.grabPayConfig.baseUrl}/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.grabPayConfig.partnerId,
        client_secret: this.grabPayConfig.partnerSecret
      })
    });

    const data = await response.json();
    return data.access_token;
  }

  // Verify Payment Status
  async verifyPaymentStatus(paymentMethod, transactionId) {
    switch (paymentMethod) {
      case 'fpx':
        return await this.verifyFPXPayment(transactionId);
      case 'touchngo':
        return await this.verifyTouchNGoPayment(transactionId);
      case 'grabpay':
        return await this.verifyGrabPayPayment(transactionId);
      case 'stripe':
        return await this.verifyStripePayment(transactionId);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  // Malaysian Bank Codes for FPX
  static getMalaysianBanks() {
    return [
      { code: 'MBB', name: 'Maybank', logo: '/images/banks/maybank.png' },
      { code: 'CIMB', name: 'CIMB Bank', logo: '/images/banks/cimb.png' },
      { code: 'HLB', name: 'Hong Leong Bank', logo: '/images/banks/hongleong.png' },
      { code: 'RHB', name: 'RHB Bank', logo: '/images/banks/rhb.png' },
      { code: 'PBB', name: 'Public Bank', logo: '/images/banks/public.png' },
      { code: 'AMB', name: 'AmBank', logo: '/images/banks/ambank.png' },
      { code: 'UOB', name: 'UOB Bank', logo: '/images/banks/uob.png' },
      { code: 'OCBC', name: 'OCBC Bank', logo: '/images/banks/ocbc.png' },
      { code: 'HSBC', name: 'HSBC Bank', logo: '/images/banks/hsbc.png' },
      { code: 'SCB', name: 'Standard Chartered', logo: '/images/banks/scb.png' }
    ];
  }

  // Delivery Fee Calculation (Malaysian zones)
  calculateDeliveryFee(postcode, orderAmount) {
    const deliveryZones = {
      '50000': { fee: 0, minOrder: 50 }, // KL City Center
      '50050': { fee: 0, minOrder: 50 }, // KL City Center
      '50088': { fee: 0, minOrder: 50 }, // KL City Center
      '40000': { fee: 5, minOrder: 30 }, // Shah Alam
      '40100': { fee: 5, minOrder: 30 }, // Shah Alam
      '47500': { fee: 8, minOrder: 40 }, // Subang Jaya
      '47500': { fee: 8, minOrder: 40 }, // Subang Jaya
      '47800': { fee: 10, minOrder: 50 }, // Petaling Jaya
      '47810': { fee: 10, minOrder: 50 }, // Petaling Jaya
      '11900': { fee: 15, minOrder: 60 }, // Bayan Lepas, Penang
      '80000': { fee: 15, minOrder: 60 }, // Johor Bahru
      '80300': { fee: 15, minOrder: 60 }, // Johor Bahru
      'default': { fee: 20, minOrder: 80 } // Other areas
    };

    const zone = deliveryZones[postcode] || deliveryZones['default'];
    
    if (orderAmount >= zone.minOrder) {
      return zone.fee;
    }
    
    return zone.fee + 5; // Additional fee for below minimum order
  }
}

export default MalaysianPaymentProcessor;
