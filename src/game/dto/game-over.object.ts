import { Field, ObjectType } from '@nestjs/graphql';
import { Player } from '../../player/player.model';
import { Game } from '../game.model';

@ObjectType()
export class GameOver {
  @Field((type) => Game)
  game: Game;

  @Field((type) => [Player])
  alivePlayers: Player[];
}
