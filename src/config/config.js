import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = ['DISCORD_TOKEN', 'CLIENT_ID', 'MONGODB_URI', 'OWNER_ID'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables in .env: ${missingEnv.join(', ')}`);
}

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  mongoUri: process.env.MONGODB_URI,
  ownerId: process.env.OWNER_ID,
  defaultPrefix: process.env.DEFAULT_PREFIX || '%',
  env: process.env.NODE_ENV || 'development',
};