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
import { Arrow } from 'src/arrow/arrow.model';

@Resolver((of) => Game)
export class GameResolver {
  constructor(
    private readonly service: GameService,
    private readonly playerService: PlayerService,
    private readonly objectTileService: ObjectTileService,
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

  @ResolveField((returns) => [Player])
  async players(@Root() { id }: Game): Promise<Player[]> {
    return this.playerService.getPlayers(id);
  }

  @ResolveField((returns) => [ObjectTile])
  async objectTiles(@Root() { id }: Game): Promise<ObjectTile[]> {
    return this.objectTileService.get(id);
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
}
