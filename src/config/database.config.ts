import mongoose from 'mongoose';
import { config } from './env.config';
import { logger } from '@/utils/logger';

const connectionOptions = {
  dbName: config.database.name,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
} as const;

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.uri, connectionOptions);
    logger.info('Database connected successfully');

    // Handle connection events
    mongoose.connection.on('error', error => {
      logger.error('Database connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Database disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Database reconnected');
    });

    // Handle process termination
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('Database disconnected');
};

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const getConnectionState = (): string => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
};

const gracefulShutdown = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed gracefully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during database disconnection:', error);
    process.exit(1);
  }
};
