import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const cacheBooking = async (pnr: string, tenantId: string, bookingData: any) => {
  await redisClient.connect();
  await redisClient.set(`booking:${tenantId}:${pnr}`, JSON.stringify(bookingData), {
    EX: 3600, // Expire after 1 hour
  });
  await redisClient.quit();
};

export const getCachedBooking = async (pnr: string, tenantId: string) => {
  await redisClient.connect();
  const cachedBooking = await redisClient.get(`booking:${tenantId}:${pnr}`);
  await redisClient.quit();
  return cachedBooking ? JSON.parse(cachedBooking) : null;
};
