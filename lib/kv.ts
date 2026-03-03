import { Redis } from '@upstash/redis';

export const kv = new Redis({
  url: process.env.REDIS_URL2_KV_URL!,
  token: process.env.REDIS_URL2_KV_REST_API_TOKEN!,
});
