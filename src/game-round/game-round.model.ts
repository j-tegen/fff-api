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
import { Game } from '../game/game.model';

@ObjectType()
@Entity()
export class GameRound {
  @Field()
  @PrimaryColumn('varchar', { length: 10, default: () => `'${nanoid()}'` })
  id: string;

  @Field((type) => Player, { nullable: true })
  @ManyToOne((type) => Player, (player) => player.wonRounds)
  winner: Player;

  @Column({ nullable: true })
  winnerId: string;

  @Field((type) => Game)
  @ManyToOne((type) => Game, (game) => game.rounds)
  game: Game;

  @Column()
  gameId: string;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  roundOver: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
