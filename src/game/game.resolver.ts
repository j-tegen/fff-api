import { Inject } from '@nestjs/common';
import {
  Query,
  Args,
  Resolver,
  Mutation,
  ResolveField,
  Root,
  Subscription,
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { Subscriptions } from '../enums/subscriptions.enum';
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { CreateGameInput } from './dto/create-game.input';
import { Game } from './game.model';
import { GameService } from './game.service';
import { ObjectTile } from '../object-tile/object-tile.model';
import { Arrow } from '../arrow/arrow.model';
import { Action } from '../action/action.model';
import { GameOver } from './dto/game-over.object';
import { GameRound } from '../game-round/game-round.model';
import { GameRoundService } from '../game-round/game-round.service';
import { ResetGameInput } from './dto/reset-game.input';
import { GraphQLError } from 'graphql';
import { ErrorCode } from 'src/enums/error-codes.enum';
import { GameEngineService } from 'src/game-engine/game-engine.service';

@Resolver((of) => Game)
export class GameResolver {
  constructor(
    private readonly service: GameService,
    private readonly playerService: PlayerService,
    private readonly objectTileService: ObjectTileService,
    private readonly roundService: GameRoundService,
    private readonly engineService: GameEngineService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query((returns) => Game)
  async game(@Args('id') id: string): Promise<Game> {
    return this.service.get(id);
  }

  @Query((returns) => [Game])
  async publicGames(): Promise<Game[]> {
    return this.service.getPublic();
  }

  @Mutation((type) => Game)
  async createGame(@Args('payload') payload: CreateGameInput): Promise<Game> {
    const game: Game = await this.service.create(payload);
    await this.objectTileService.addObjectTiles(game);
    return game;
  }

  @Mutation((type) => Boolean)
  async resetGame(
    @Args('payload') { gameId, playerId }: ResetGameInput,
  ): Promise<boolean> {
    const game: Game = await this.service.get(gameId);
    if (!game) {
      throw new GraphQLError(ErrorCode.GAME_NOT_FOUND);
    }
    const player: Player = await this.playerService.get(playerId);
    if (!player?.isOwner) {
      throw new GraphQLError(ErrorCode.PLAYER_NOT_OWNER);
    }
    const players: Player[] = await this.playerService.getPlayers(game.id);
    await this.engineService.resetGame(game, players);
    return true;
  }

  @ResolveField((returns) => [Player])
  async players(@Root() { id }: Game): Promise<Player[]> {
    return this.playerService.getPlayers(id);
  }

  @ResolveField((returns) => [ObjectTile])
  async objectTiles(@Root() { id }: Game): Promise<ObjectTile[]> {
    return this.objectTileService.get(id);
  }

  @ResolveField((returns) => GameRound)
  async activeRound(@Root() { id }: Game): Promise<GameRound> {
    return this.roundService.getActiveRound(id);
  }

  @Subscription(() => Player, {
    filter: (payload, variables) => {
      return payload.playerAdded.gameId === variables.gameId;
    },
  })
  playerAdded(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.PLAYER_ADDED);
  }

  @Subscription(() => Player, {
    filter: (payload, variables) => {
      return payload.playerUpdated.gameId === variables.gameId;
    },
  })
  playerUpdated(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.PLAYER_UPDATED);
  }

  @Subscription(() => Arrow, {
    filter: (payload, variables) => {
      return payload.arrowUpdated.gameId === variables.gameId;
    },
  })
  arrowUpdated(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.ARROW_UPDATED);
  }

  @Subscription(() => Game, {
    filter: (payload, variables) => {
      return payload.actionsResolved.id === variables.gameId;
    },
  })
  actionsResolved(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.ACTIONS_RESOLVED);
  }

  @Subscription(() => Game, {
    filter: (payload, variables) => {
      return payload.resolveActions.id === variables.gameId;
    },
  })
  resolveActions(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.RESOLVE_ACTIONS);
  }

  @Subscription(() => Action, {
    filter: (payload, variables) => {
      return payload.actionAdded.gameId === variables.gameId;
    },
  })
  actionAdded(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.ACTION_ADDED);
  }

  @Subscription(() => GameRound, {
    filter: (payload, variables) => {
      return payload.gameOver.gameId === variables.gameId;
    },
  })
  gameOver(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.GAME_OVER);
  }

  @Subscription(() => Game, {
    filter: (payload, variables) => {
      return payload.gameReset.id === variables.gameId;
    },
  })
  gameReset(@Args('gameId') _: string) {
    return this.pubSub.asyncIterator(Subscriptions.GAME_RESET);
  }
}
