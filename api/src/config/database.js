import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cornman_api';

export async function connectDatabase() {
    try {
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering
        };

        await mongoose.connect(MONGODB_URI, options);

        logger.info('✅ Connected to MongoDB successfully');

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        logger.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}

export default mongoose;
