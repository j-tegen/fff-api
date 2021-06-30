export interface RedisConfig {
  host: string;
  port: number;
}

export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
};
