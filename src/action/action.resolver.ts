import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GameEngineService } from '../game-engine/game-engine.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { Arrow } from '../arrow/arrow.model';
import { ArrowService } from '../arrow/arrow.service';
import { ErrorCode } from '../enums/error-codes.enum';
import { Subscriptions } from '../enums/subscriptions.enum';
import { Game } from '../game/game.model';
import { GameService } from '../game/game.service';
import { ObjectTile } from '../object-tile/object-tile.model';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { Action } from './action.model';
import { ActionService } from './action.service';
import { CreateActionInput } from './dto/create-action.input';
import { GetActionsArgs } from './dto/get-actions.args';

@Resolver((of) => Action)
export class ActionResolver {
  constructor(
    private readonly service: ActionService,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly gameEngine: GameEngineService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query((returns) => [Action])
  async actions(@Args() args: GetActionsArgs): Promise<Action[]> {
    return this.service.get(args);
  }

  @Mutation((type) => Action)
  async addAction(
    @Args('payload') payload: CreateActionInput,
  ): Promise<Action> {
    const game: Game = await this.gameService.get(payload.gameId);
    if (!game) {
      throw new GraphQLError(ErrorCode.GAME_NOT_FOUND);
    }
    const playerActions: Action[] = await this.service.get({
      gameId: payload.gameId,
      isResolved: false,
      playerId: payload.playerId,
    });
    if (playerActions.length >= 4) {
      throw new GraphQLError(ErrorCode.MAX_ACTIONS);
    }
    const player: Player = await this.playerService.get(payload.playerId);
    const players: Player[] = await this.playerService.getPlayers(
      payload.gameId,
      { isDead: false },
    );

    const action: Action = await this.service.create(payload, player);
    const actions: Action[] = await this.service.get({
      gameId: payload.gameId,
      isResolved: false,
    });

    if (actions.length >= 4 * players.length) {
      this.pubSub.publish(Subscriptions.RESOLVE_ACTIONS, {
        resolveActions: game,
      });
    }
    return action;
  }

  @Mutation((type) => Boolean)
  async resolveActions(@Args('gameId') gameId: string): Promise<boolean> {
    const game: Game = await this.gameService.get(gameId);
    const actions: Action[] = await this.service.get({
      gameId,
      isResolved: false,
    });
    await this.gameEngine.resolveActions(actions, game);
    return true;
  }
}
