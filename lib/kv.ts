import { Redis } from '@upstash/redis';

export const kv = new Redis({
  url: process.env.mm_KV_REST_API_URL!,
  token: process.env.mm_KV_REST_API_TOKEN!,
});
