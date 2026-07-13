import { VelocityClient } from './bot.js';
import { config } from './config/config.js';
import { connectDatabase } from './database/connection.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  logger.info('Starting Velocity boot sequence...');

  // 1. Establish Database Connection
  await connectDatabase();

  // 2. Initialize and Start Client
  const client = new VelocityClient();
  
  await client.start(config.token);

  // Fallback handler for unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Promise Rejection: ${reason}`);
  });
}

bootstrap().catch((error) => {
  logger.error(`Initialization sequence failed: ${error.message}`);
  process.exit(1);
});