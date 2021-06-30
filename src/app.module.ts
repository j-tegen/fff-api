import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { GameEngineModule } from './game-engine/game-engine.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { ObjectTileModule } from './object-tile/object-tile.module';
import { ActionModule } from './action/action.module';
import { ArrowModule } from './arrow/arrow.module';
import config from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.ormConfig),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      playground: !config.isProd,
      debug: !config.isProd,
      context: ({ req }) => {
        return { ...req };
      },
    }),
    GameModule,
    PlayerModule,
    GameEngineModule,
    PubSubModule,
    ObjectTileModule,
    ActionModule,
    ArrowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
