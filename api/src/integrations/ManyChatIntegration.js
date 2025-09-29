// ManyChat Pro Integration for CORNMAN
// Complete WhatsApp automation system

import axios from 'axios';

export class ManyChatIntegration {
  constructor() {
    this.apiKey = process.env.MANYCHAT_API_KEY;
    this.baseUrl = 'https://api.manychat.com/fb';
    this.webhookSecret = process.env.MANYCHAT_WEBHOOK_SECRET;
  }

  // Send Message to Subscriber
  async sendMessage(subscriberId, message, options = {}) {
    try {
      const payload = {
        subscriber_id: subscriberId,
        data: {
          version: 'v2.0',
          content: {
            type: 'text',
            text: message
          },
          ...options
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/sending/sendContent`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('ManyChat Send Message Error:', error);
      throw error;
    }
  }

  // Send Rich Content (Buttons, Quick Replies, etc.)
  async sendRichContent(subscriberId, content) {
    try {
      const payload = {
        subscriber_id: subscriberId,
        data: {
          version: 'v2.0',
          content: content
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/sending/sendContent`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('ManyChat Rich Content Error:', error);
      throw error;
    }
  }

  // Send Product Catalog
  async sendProductCatalog(subscriberId, products) {
    const catalogContent = {
      type: 'card',
      elements: products.map(product => ({
        title: product.name,
        subtitle: product.description,
        image_url: product.image,
        buttons: [
          {
            type: 'web_url',
            url: `${process.env.FRONTEND_URL}/product/${product.id}`,
            title: 'View Details'
          },
          {
            type: 'postback',
            payload: `ADD_TO_CART_${product.id}`,
            title: 'Add to Cart'
          }
        ]
      }))
    };

    return await this.sendRichContent(subscriberId, catalogContent);
  }

  // Send Order Confirmation
  async sendOrderConfirmation(subscriberId, order) {
    const message = `🎉 *Order Confirmed!*

*Order #${order.orderNumber}*
📅 ${new Date(order.createdAt).toLocaleDateString('ms-MY')}
💰 Total: RM ${order.total.toFixed(2)}

*Items:*
${order.items.map(item => `• ${item.productName} x${item.quantity} - RM ${item.totalPrice.toFixed(2)}`).join('\n')}

*Delivery Address:*
${order.deliveryAddress.street}
${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.postcode}

*Estimated Delivery:* ${new Date(order.estimatedDelivery).toLocaleString('ms-MY')}

Track your order: ${process.env.FRONTEND_URL}/track/${order.orderNumber}`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Order Status Update
  async sendOrderStatusUpdate(subscriberId, order) {
    const statusMessages = {
      confirmed: `✅ *Order Confirmed!* Your order #${order.orderNumber} is being prepared.`,
      preparing: `👨‍🍳 *Preparing Your Order!* Your corn is being cooked fresh. Order #${order.orderNumber}`,
      out_for_delivery: `🚚 *Out for Delivery!* Your order #${order.orderNumber} is on its way!`,
      delivered: `🎉 *Delivered!* Your order #${order.orderNumber} has been delivered. Enjoy your corn!`
    };

    const message = statusMessages[order.status] || `Order #${order.orderNumber} status updated.`;
    return await this.sendMessage(subscriberId, message);
  }

  // Send Abandoned Cart Recovery
  async sendAbandonedCartRecovery(subscriberId, cartItems) {
    const message = `🛒 *Don't forget your corn!*

You left these delicious items in your cart:
${cartItems.map(item => `• ${item.productName} x${item.quantity} - RM ${item.price.toFixed(2)}`).join('\n')}

*Total: RM ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}*

Complete your order now: ${process.env.FRONTEND_URL}/cart

Use code *WELCOME10* for 10% off your first order! 🌽`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Review Request
  async sendReviewRequest(subscriberId, order) {
    const message = `⭐ *How was your corn?*

We hope you enjoyed your order #${order.orderNumber}!

Please rate your experience:
1️⃣ ⭐ (Poor)
2️⃣ ⭐⭐ (Fair)  
3️⃣ ⭐⭐⭐ (Good)
4️⃣ ⭐⭐⭐⭐ (Very Good)
5️⃣ ⭐⭐⭐⭐⭐ (Excellent)

Your feedback helps us improve! 💚`;

    const quickReplies = {
      type: 'quick_replies',
      text: message,
      buttons: [
        { type: 'postback', payload: 'REVIEW_1', title: '⭐' },
        { type: 'postback', payload: 'REVIEW_2', title: '⭐⭐' },
        { type: 'postback', payload: 'REVIEW_3', title: '⭐⭐⭐' },
        { type: 'postback', payload: 'REVIEW_4', title: '⭐⭐⭐⭐' },
        { type: 'postback', payload: 'REVIEW_5', title: '⭐⭐⭐⭐⭐' }
      ]
    };

    return await this.sendRichContent(subscriberId, quickReplies);
  }

  // Send Promotional Message
  async sendPromotionalMessage(subscriberId, promotion) {
    const message = `🎉 *Special Offer!*

${promotion.title}

${promotion.description}

*Code: ${promotion.code}*
*Valid until: ${new Date(promotion.validUntil).toLocaleDateString('ms-MY')}*

Order now: ${process.env.FRONTEND_URL}/menu`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Birthday Message
  async sendBirthdayMessage(subscriberId, customerName) {
    const message = `🎂 *Happy Birthday, ${customerName}!*

Wishing you a corn-tastic birthday! 🎉

As a special treat, here's a *20% discount* on your next order!

*Code: BIRTHDAY20*
*Valid for 7 days*

Order your favorite corn: ${process.env.FRONTEND_URL}/menu

Have a wonderful day! 🌽💚`;

    return await this.sendMessage(subscriberId, message);
  }

  // Update Subscriber Custom Fields
  async updateSubscriberFields(subscriberId, fields) {
    try {
      const payload = {
        subscriber_id: subscriberId,
        fields: fields
      };

      const response = await axios.post(
        `${this.baseUrl}/subscriber/setInfo`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('ManyChat Update Fields Error:', error);
      throw error;
    }
  }

  // Add Tags to Subscriber
  async addSubscriberTags(subscriberId, tags) {
    try {
      const payload = {
        subscriber_id: subscriberId,
        tags: tags
      };

      const response = await axios.post(
        `${this.baseUrl}/subscriber/addTag`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('ManyChat Add Tags Error:', error);
      throw error;
    }
  }

  // Remove Tags from Subscriber
  async removeSubscriberTags(subscriberId, tags) {
    try {
      const payload = {
        subscriber_id: subscriberId,
        tags: tags
      };

      const response = await axios.post(
        `${this.baseUrl}/subscriber/removeTag`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('ManyChat Remove Tags Error:', error);
      throw error;
    }
  }

  // Get Subscriber Info
  async getSubscriberInfo(subscriberId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/subscriber/getInfo?subscriber_id=${subscriberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('ManyChat Get Subscriber Error:', error);
      throw error;
    }
  }

  // Handle Webhook Events
  async handleWebhookEvent(event) {
    try {
      const { type, data } = event;

      switch (type) {
        case 'message':
          return await this.handleIncomingMessage(data);
        case 'postback':
          return await this.handlePostback(data);
        case 'quick_reply':
          return await this.handleQuickReply(data);
        default:
          console.log('Unhandled webhook event type:', type);
      }
    } catch (error) {
      console.error('ManyChat Webhook Error:', error);
      throw error;
    }
  }

  // Handle Incoming Messages
  async handleIncomingMessage(data) {
    const { subscriber_id, message } = data;
    
    // Simple keyword responses
    const responses = {
      'menu': () => this.sendMenuOptions(subscriber_id),
      'order': () => this.sendOrderOptions(subscriber_id),
      'track': () => this.sendTrackingOptions(subscriber_id),
      'help': () => this.sendHelpMessage(subscriber_id),
      'contact': () => this.sendContactInfo(subscriber_id)
    };

    const messageText = message.text.toLowerCase();
    const response = responses[messageText];

    if (response) {
      return await response();
    }

    // Default response
    return await this.sendDefaultResponse(subscriber_id);
  }

  // Send Menu Options
  async sendMenuOptions(subscriberId) {
    const message = `🌽 *CORNMAN Menu*

Choose a category:
1️⃣ Sweet Corn
2️⃣ Chocolate Corn  
3️⃣ Cheese Corn
4️⃣ Savory Corn
5️⃣ Special Flavors

Type the number or category name to browse!`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Order Options
  async sendOrderOptions(subscriberId) {
    const message = `🛒 *How would you like to order?*

1️⃣ Browse our menu
2️⃣ Track existing order
3️⃣ Repeat last order
4️⃣ Speak to our team

Choose an option or visit: ${process.env.FRONTEND_URL}/menu`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Tracking Options
  async sendTrackingOptions(subscriberId) {
    const message = `📦 *Track Your Order*

Please provide your order number (e.g., #ORD-123456) or visit: ${process.env.FRONTEND_URL}/track`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Help Message
  async sendHelpMessage(subscriberId) {
    const message = `🆘 *How can we help?*

*Common Commands:*
• "menu" - Browse our corn selection
• "order" - Start ordering
• "track" - Track your order
• "contact" - Get in touch

*Need more help?*
Call us: +601121112919
Email: crnmnwtf@gmail.com
Website: ${process.env.FRONTEND_URL}

We're here to help! 💚`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Contact Info
  async sendContactInfo(subscriberId) {
    const message = `📞 *Contact CORNMAN*

*Phone:* +601121112919
*Email:* crnmnwtf@gmail.com
*Website:* ${process.env.FRONTEND_URL}

*Operating Hours:*
Monday - Sunday: 10:00 AM - 10:00 PM

*Delivery Areas:*
Kuala Lumpur, Selangor, Penang, Johor

We're here to help! 💚`;

    return await this.sendMessage(subscriberId, message);
  }

  // Send Default Response
  async sendDefaultResponse(subscriberId) {
    const message = `Hi! 👋 

I'm CORNMAN's virtual assistant. I can help you with:

🌽 Browse our delicious corn menu
🛒 Place an order
📦 Track your delivery
💬 Get support

Type "help" for more options or visit: ${process.env.FRONTEND_URL}`;

    return await this.sendMessage(subscriberId, message);
  }
}

export default ManyChatIntegration;
