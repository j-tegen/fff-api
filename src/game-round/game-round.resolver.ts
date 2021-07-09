import {
  Args,
  Mutation,
  ResolveField,
  Resolver,
  Root,
  Query,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Player } from 'src/player/player.model';
import { PlayerService } from 'src/player/player.service';
import { ErrorCode } from '../enums/error-codes.enum';
import { StartRoundInput } from './dto/start-round.input';
import { GameRound } from './game-round.model';
import { GameRoundService } from './game-round.service';

@Resolver((of) => GameRound)
export class GameRoundResolver {
  constructor(
    private readonly service: GameRoundService,
    private readonly playerService: PlayerService,
  ) {}

  @Query((type) => [GameRound])
  async rounds(@Args('gameId') gameId: string): Promise<GameRound[]> {
    return this.service.getList(gameId);
  }

  @Mutation((type) => GameRound)
  async startRound(
    @Args('payload') { gameId, playerId }: StartRoundInput,
  ): Promise<GameRound> {
    const player: Player = await this.playerService.get(playerId);
    if (!player?.isOwner) {
      throw new GraphQLError(ErrorCode.PLAYER_NOT_OWNER);
    }
    return this.service.create(gameId);
  }

  @ResolveField((returns) => Player)
  async winner(@Root() round: GameRound): Promise<Player> {
    return this.playerService.get(round.winnerId);
  }
}
