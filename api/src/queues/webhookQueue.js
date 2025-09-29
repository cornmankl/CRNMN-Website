import Queue from 'bull';
import { getRedisClient } from '../config/redis.js';
import { Webhook } from '../models/Webhook.js';
import { WebhookDelivery } from '../models/WebhookDelivery.js';
import { logger } from '../utils/logger.js';
import axios from 'axios';

// Create webhook queue
export const webhookQueue = new Queue('webhook delivery', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Process webhook deliveries
webhookQueue.process('deliver-webhook', async (job) => {
  const { webhookId, event, payload, isTest = false } = job.data;
  
  try {
    const webhook = await Webhook.findById(webhookId);
    if (!webhook || !webhook.isActive) {
      throw new Error('Webhook not found or inactive');
    }

    // Create delivery record
    const delivery = new WebhookDelivery({
      webhookId,
      event,
      payload,
      isTest
    });
    await delivery.save();

    // Prepare webhook payload
    const webhookPayload = {
      event,
      data: payload,
      timestamp: new Date().toISOString(),
      webhookId: webhook._id
    };

    // Generate signature
    const signature = webhook.generateSignature(webhookPayload);

    // Send webhook
    const response = await axios.post(webhook.url, webhookPayload, {
      headers: {
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event,
        'User-Agent': 'CORNMAN-Webhook/1.0.0'
      },
      timeout: webhook.timeout || 5000
    });

    // Mark as delivered
    await delivery.markAsDelivered(
      response.status,
      response.headers,
      response.data,
      Date.now() - delivery.createdAt.getTime()
    );

    logger.info('Webhook delivered successfully', {
      webhookId,
      event,
      status: response.status,
      deliveryId: delivery._id
    });

  } catch (error) {
    logger.error('Webhook delivery failed', {
      webhookId,
      event,
      error: error.message,
      deliveryId: job.data.deliveryId
    });

    // Schedule retry if attempts remaining
    if (job.attemptsMade < webhook.retryAttempts) {
      throw error; // This will trigger a retry
    } else {
      // Mark as failed
      const delivery = await WebhookDelivery.findById(job.data.deliveryId);
      if (delivery) {
        await delivery.markAsFailed(error.message);
      }
    }
  }
});

// Handle failed jobs
webhookQueue.on('failed', async (job, err) => {
  logger.error('Webhook job failed permanently', {
    webhookId: job.data.webhookId,
    event: job.data.event,
    error: err.message,
    attempts: job.attemptsMade
  });
});

export default webhookQueue;
