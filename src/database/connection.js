import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';

export async function connectDatabase() {
  try {
    mongoose.connection.on('connected', () => {
      logger.info('Database connection established with MongoDB Atlas.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost. Reconnecting...');
    });

    await mongoose.connect(config.mongoUri);
  } catch (error) {
    logger.error(`Initial MongoDB Atlas connection failed: ${error.message}`);
    process.exit(1);
  }
}