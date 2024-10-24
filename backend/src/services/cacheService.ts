import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheSet = async (key: string, value: any, expirationInSeconds: number) => {
  await redis.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
};

export const cacheGet = async (key: string) => {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};
