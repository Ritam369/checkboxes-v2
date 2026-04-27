import Redis from "ioredis";
import 'dotenv/config'

const createChannel = () => {
  // Use the REDIS_URL if it exists, otherwise fall back to localhost
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL);
  }
  
  return new Redis({
    host: "localhost",
    port: 6379,
  });
};

export const readwriteRedis = createChannel();

export const publisher = createChannel();

export const subscriber = createChannel();