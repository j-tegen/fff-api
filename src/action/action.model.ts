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
import { Direction } from '../enums/direction.enum';
import { ActionType } from './action.enums';

@ObjectType()
@Entity()
export class Action {
  @Field()
  @PrimaryColumn('varchar', { length: 10, default: () => `'${nanoid()}'` })
  id: string;

  @Field((type) => Game)
  @ManyToOne((type) => Game, (game) => game.actions)
  game: Game;

  @Column()
  gameId: string;

  @Field((type) => Player)
  @ManyToOne((type) => Player, (player) => player.actions)
  player: Player;

  @Field()
  @Column()
  playerId: string;

  @Field((type) => Direction)
  @Column('enum', { enum: Direction })
  direction: Direction;

  @Field((type) => ActionType)
  @Column('enum', { enum: ActionType, default: ActionType.MOVE })
  type: ActionType;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isResolved: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
