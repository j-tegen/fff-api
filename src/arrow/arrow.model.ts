import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { Tile } from '../types/tile.type';
import { Direction } from '../enums/direction.enum';
import { Game } from '../game/game.model';

@ObjectType()
@Entity()
export class Arrow {
  @Field()
  @PrimaryColumn('varchar', { length: 10, default: () => `'${nanoid()}'` })
  id: string;

  @Field((type) => Tile)
  @Column('jsonb')
  tile: Tile;

  @Field((type) => Direction)
  @Column('enum', { enum: Direction })
  direction: Direction;

  @ManyToOne((type) => Game, (game) => game.arrows)
  game: Game;

  @Column()
  gameId: string;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isResolved: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
