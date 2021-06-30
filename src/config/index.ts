import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ormConfig } from './database';
import { redisConfig, RedisConfig } from './redis';

export interface IConfig {
  env: string;
  isProd: boolean;
  port: number;
  ormConfig: TypeOrmModuleOptions;
  redis: RedisConfig;
}

const config: IConfig = {
  env: process.env.ENVIRONMENT,
  isProd: process.env.ENVIRONMENT === 'PRODUCTION',
  port: parseInt(process.env.PORT, 10),
  ormConfig,
  redis: redisConfig,
};

export default config;
