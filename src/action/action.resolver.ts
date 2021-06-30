import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Arrow } from '../arrow/arrow.model';
import { ArrowService } from '../arrow/arrow.service';
import { ErrorCode } from '../enums/error-codes.enum';
import { Subscriptions } from '../enums/subscriptions.enum';
import { GameEngineService } from '../game-engine/game-engine.service';
import { Game } from '../game/game.model';
import { GameService } from '../game/game.service';
import { ObjectTile } from '../object-tile/object-tile.model';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { ActionType } from './action.enums';
import { Action } from './action.model';
import { ActionService } from './action.service';
import { CreateActionInput } from './dto/create-action.input';

@Resolver((of) => Action)
export class ActionResolver {
  constructor(
    private readonly service: ActionService,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly objectTileService: ObjectTileService,
    private readonly arrowService: ArrowService,
    private readonly gameEngine: GameEngineService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Mutation((type) => Action)
  async addAction(
    @Args('payload') payload: CreateActionInput,
  ): Promise<Action> {
    const game: Game = await this.gameService.get(payload.gameId);
    if (!game) {
      throw new GraphQLError(ErrorCode.GAME_NOT_FOUND);
    }
    const player: Player = await this.playerService.get(payload.playerId);
    const allPlayers: Player[] = await this.playerService.getPlayers(
      payload.gameId,
    );
    const objectTiles: ObjectTile[] = await this.objectTileService.get(
      payload.gameId,
    );
    const action: Action = await this.service.create(payload, player);
    switch (action.type) {
      case ActionType.MOVE: {
        const updatedPlayer: Player = await this.playerService.move(
          player,
          game,
          allPlayers,
          objectTiles,
          action.direction,
        );
        this.pubSub.publish(Subscriptions.PLAYER_UPDATED, {
          playerUpdated: updatedPlayer,
        });
        break;
      }
      case ActionType.SHOOT: {
        const arrow: Arrow = await this.arrowService.create(
          game.id,
          player.direction,
          player.tile,
        );
        await this.handleMoveArrow(arrow, game, allPlayers);
        break;
      }
    }
    return action;
  }

  async handleMoveArrow(
    arrow: Arrow,
    game: Game,
    allPlayers: Player[],
  ): Promise<void> {
    const updatedArrow: Arrow = await this.arrowService.move(arrow, game);
    this.pubSub.publish(Subscriptions.ARROW_UPDATED, {
      arrowUpdated: updatedArrow,
    });
    const player: Player = await this.gameEngine.blockingCharacter(
      allPlayers,
      updatedArrow.tile,
    );
    const arrowIsDead: boolean = this.arrowService.checkArrowIsDead(
      updatedArrow,
      game,
    );
    if (player) {
      await this.arrowService.delete(updatedArrow);
      const playerUpdated: Player = await this.playerService.update(
        { isDead: true },
        player,
      );
      this.pubSub.publish(Subscriptions.PLAYER_UPDATED, { playerUpdated });
      return;
    }
    if (arrowIsDead) {
      await this.arrowService.delete(updatedArrow);
      return;
    }
    setTimeout(() => {
      return this.handleMoveArrow(updatedArrow, game, allPlayers);
    }, 150);
  }
}
