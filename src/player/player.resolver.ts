import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ErrorCode } from '../enums/error-codes.enum';
import { Subscriptions } from '../enums/subscriptions.enum';
import { Game } from '../game/game.model';
import { GameService } from '../game/game.service';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { AddPlayerInput } from './dto/add-player.input';
import { Player } from './player.model';
import { PlayerService } from './player.service';

@Resolver((of) => Player)
export class PlayerResolver {
  constructor(
    private readonly service: PlayerService,
    private readonly gameService: GameService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Mutation((type) => Player)
  async addPlayer(@Args('payload') payload: AddPlayerInput): Promise<Player> {
    const game: Game = await this.gameService.get(payload.gameId);
    if (!game) {
      throw new GraphQLError(ErrorCode.GAME_NOT_FOUND);
    }
    const player: Player = await this.service.create(payload, game);
    this.pubSub.publish(Subscriptions.PLAYER_ADDED, { playerAdded: player });
    return player;
  }
}
