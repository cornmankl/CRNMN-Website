import { getRedisClient } from '../config/redis.js';

export function cacheMiddleware(ttl = 300) {
  return async (req, res, next) => {
    try {
      const cacheKey = `cache:${req.method}:${req.originalUrl}`;
      
      // Try to get from cache
      const cached = await getRedisClient().get(cacheKey);
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original res.json
      const originalJson = res.json;
      
      // Override res.json to cache response
      res.json = function(data) {
        // Cache the response
        getRedisClient().setex(cacheKey, ttl, JSON.stringify(data));
        
        // Call original res.json
        return originalJson.call(this, data);
      };
      
      // Add clearCache function to request
      req.clearCache = async () => {
        const pattern = `cache:${req.method}:${req.originalUrl.split('?')[0]}*`;
        const keys = await getRedisClient().keys(pattern);
        if (keys.length > 0) {
          await getRedisClient().del(...keys);
        }
      };
      
      next();
    } catch (error) {
      // If cache fails, continue without caching
      next();
    }
  };
}
