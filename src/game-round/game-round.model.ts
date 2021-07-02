import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { Player } from '../player/player.model';
import { Game } from 'src/game/game.model';

@ObjectType()
@Entity()
export class GameRound {
  @Field()
  @PrimaryColumn('varchar', { length: 10, default: () => `'${nanoid()}'` })
  id: string;

  @Field((type) => Player)
  @ManyToOne((type) => Player, (player) => player.wonRounds)
  winner: Player;

  @Column()
  winnerId: string;

  @Field((type) => Game)
  @ManyToOne((type) => Game, (game) => game.rounds)
  game: Game;

  @Column()
  gameId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
