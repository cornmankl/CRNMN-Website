// CORNMAN Specific Routes
// Based on comprehensive development guide

import express from 'express';
import { CornProducts, AddOns, ProductCategories } from '../data/CornProducts.js';
import { DeliveryZones, DeliveryTimeSlots } from '../data/DeliveryZones.js';
import { MalaysianPaymentProcessor } from '../payments/MalaysianPayments.js';
import ManyChatIntegration from '../integrations/ManyChatIntegration.js';

const router = express.Router();
const paymentProcessor = new MalaysianPaymentProcessor();
const manyChat = new ManyChatIntegration();

// Get all corn products with filtering
router.get('/products', async (req, res) => {
  try {
    const { category, subcategory, isHalal, isAvailable, isPopular, isNew, isSeasonal, minPrice, maxPrice, search } = req.query;
    
    let filteredProducts = [...CornProducts];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (subcategory) {
      filteredProducts = filteredProducts.filter(product => product.subcategory === subcategory);
    }
    
    if (isHalal === 'true') {
      filteredProducts = filteredProducts.filter(product => product.isHalal === true);
    }
    
    if (isAvailable === 'true') {
      filteredProducts = filteredProducts.filter(product => product.isAvailable === true);
    }
    
    if (isPopular === 'true') {
      filteredProducts = filteredProducts.filter(product => product.isPopular === true);
    }
    
    if (isNew === 'true') {
      filteredProducts = filteredProducts.filter(product => product.isNew === true);
    }
    
    if (isSeasonal === 'true') {
      filteredProducts = filteredProducts.filter(product => product.isSeasonal === true);
    }
    
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.basePrice >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.basePrice <= parseFloat(maxPrice));
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.nameMs.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.descriptionMs.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    res.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
      categories: ProductCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = CornProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Get product categories
router.get('/categories', async (req, res) => {
  try {
    res.json({
      success: true,
      data: ProductCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Get add-ons
router.get('/addons', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredAddOns = [...AddOns];
    
    if (category) {
      filteredAddOns = filteredAddOns.filter(addon => addon.category === category);
    }

    res.json({
      success: true,
      data: filteredAddOns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching add-ons',
      error: error.message
    });
  }
});

// Get delivery zones
router.get('/delivery-zones', async (req, res) => {
  try {
    const { state, postcode } = req.query;
    
    let filteredZones = [...DeliveryZones];
    
    if (state) {
      filteredZones = filteredZones.filter(zone => zone.state === state);
    }
    
    if (postcode) {
      filteredZones = filteredZones.filter(zone => 
        zone.postcodes.includes(postcode) || zone.postcodes.includes('default')
      );
    }

    res.json({
      success: true,
      data: filteredZones,
      timeSlots: DeliveryTimeSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery zones',
      error: error.message
    });
  }
});

// Calculate delivery fee
router.post('/calculate-delivery', async (req, res) => {
  try {
    const { postcode, orderAmount } = req.body;
    
    if (!postcode || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Postcode and order amount are required'
      });
    }

    const deliveryFee = paymentProcessor.calculateDeliveryFee(postcode, orderAmount);
    
    res.json({
      success: true,
      data: {
        postcode,
        orderAmount,
        deliveryFee,
        total: orderAmount + deliveryFee
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating delivery fee',
      error: error.message
    });
  }
});

// Get Malaysian banks for FPX
router.get('/payment/banks', async (req, res) => {
  try {
    const banks = MalaysianPaymentProcessor.getMalaysianBanks();
    
    res.json({
      success: true,
      data: banks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banks',
      error: error.message
    });
  }
});

// Process FPX payment
router.post('/payment/fpx', async (req, res) => {
  try {
    const paymentData = req.body;
    const result = await paymentProcessor.processFPXPayment(paymentData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing FPX payment',
      error: error.message
    });
  }
});

// Process Touch 'n Go payment
router.post('/payment/touchngo', async (req, res) => {
  try {
    const paymentData = req.body;
    const result = await paymentProcessor.processTouchNGoPayment(paymentData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing Touch \'n Go payment',
      error: error.message
    });
  }
});

// Process GrabPay payment
router.post('/payment/grabpay', async (req, res) => {
  try {
    const paymentData = req.body;
    const result = await paymentProcessor.processGrabPayPayment(paymentData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing GrabPay payment',
      error: error.message
    });
  }
});

// ManyChat webhook
router.post('/manychat/webhook', async (req, res) => {
  try {
    const event = req.body;
    const result = await manyChat.handleWebhookEvent(event);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error handling ManyChat webhook',
      error: error.message
    });
  }
});

// Send ManyChat message
router.post('/manychat/send', async (req, res) => {
  try {
    const { subscriberId, message, type = 'text' } = req.body;
    
    if (!subscriberId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subscriber ID and message are required'
      });
    }

    let result;
    if (type === 'rich') {
      result = await manyChat.sendRichContent(subscriberId, message);
    } else {
      result = await manyChat.sendMessage(subscriberId, message);
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending ManyChat message',
      error: error.message
    });
  }
});

// Get ManyChat subscriber info
router.get('/manychat/subscriber/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await manyChat.getSubscriberInfo(id);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriber info',
      error: error.message
    });
  }
});

// Update ManyChat subscriber fields
router.put('/manychat/subscriber/:id/fields', async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;
    
    if (!fields) {
      return res.status(400).json({
        success: false,
        message: 'Fields are required'
      });
    }

    const result = await manyChat.updateSubscriberFields(id, fields);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subscriber fields',
      error: error.message
    });
  }
});

// Add tags to ManyChat subscriber
router.post('/manychat/subscriber/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Tags array is required'
      });
    }

    const result = await manyChat.addSubscriberTags(id, tags);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding tags',
      error: error.message
    });
  }
});

// Remove tags from ManyChat subscriber
router.delete('/manychat/subscriber/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Tags array is required'
      });
    }

    const result = await manyChat.removeSubscriberTags(id, tags);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing tags',
      error: error.message
    });
  }
});

// Get popular products
router.get('/products/popular', async (req, res) => {
  try {
    const popularProducts = CornProducts
      .filter(product => product.isPopular && product.isAvailable)
      .sort((a, b) => b.stockQuantity - a.stockQuantity)
      .slice(0, 8);

    res.json({
      success: true,
      data: popularProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular products',
      error: error.message
    });
  }
});

// Get new products
router.get('/products/new', async (req, res) => {
  try {
    const newProducts = CornProducts
      .filter(product => product.isNew && product.isAvailable)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    res.json({
      success: true,
      data: newProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching new products',
      error: error.message
    });
  }
});

// Get seasonal products
router.get('/products/seasonal', async (req, res) => {
  try {
    const seasonalProducts = CornProducts
      .filter(product => product.isSeasonal && product.isAvailable);

    res.json({
      success: true,
      data: seasonalProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching seasonal products',
      error: error.message
    });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, isHalal } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let results = CornProducts.filter(product => 
      product.name.toLowerCase().includes(q.toLowerCase()) ||
      product.nameMs.toLowerCase().includes(q.toLowerCase()) ||
      product.description.toLowerCase().includes(q.toLowerCase()) ||
      product.descriptionMs.toLowerCase().includes(q.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
    );

    // Apply additional filters
    if (category) {
      results = results.filter(product => product.category === category);
    }
    
    if (minPrice) {
      results = results.filter(product => product.basePrice >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      results = results.filter(product => product.basePrice <= parseFloat(maxPrice));
    }
    
    if (isHalal === 'true') {
      results = results.filter(product => product.isHalal === true);
    }

    res.json({
      success: true,
      data: results,
      total: results.length,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
});

export default router;
