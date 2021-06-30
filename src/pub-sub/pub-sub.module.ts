import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Global, Module } from '@nestjs/common';
import config from '../config';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: PUB_SUB,
      useFactory: () =>
        new RedisPubSub({
          connection: {
            host: config.redis.host,
            port: config.redis.port,
          },
        }),
      inject: [],
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
