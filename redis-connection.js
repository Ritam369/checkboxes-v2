import Redis from "ioredis";

const createChannel = () => {
  return new Redis({
    host: "localhost",
    port: 6379,
  });
};

export const readwriteRedis = createChannel();

export const publisher = createChannel();

export const subscriber = createChannel();