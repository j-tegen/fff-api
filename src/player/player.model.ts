import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { PlayerColour } from './player.enums';
import { Game } from '../game/game.model';
import { Tile } from '../types/tile.type';
import { Direction } from '../enums/direction.enum';
import { Action } from '../action/action.model';

@ObjectType()
@Entity()
export class Player {
  @Field()
  @PrimaryColumn('varchar', { length: 10, default: () => `'${nanoid()}'` })
  id: string;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isOwner: boolean;

  @Field()
  @Column('varchar', { default: '' })
  name: string;

  @Field((type) => PlayerColour)
  @Column('enum', { enum: PlayerColour })
  colour: PlayerColour;

  @Field((type) => Direction)
  @Column('enum', { enum: Direction, default: Direction.RIGHT })
  direction: Direction;

  @Field((type) => Game)
  @ManyToOne((type) => Game, (game) => game.players)
  @JoinColumn()
  game: Game;

  @Column('varchar', { length: 10 })
  gameId: string;

  @Field((type) => Tile)
  @Column('jsonb')
  tile: Tile;

  @OneToMany((type) => Action, (action) => action.player)
  actions: Action[];

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isDead: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
