import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { Game } from '../game/game.model';
import { ObjectTileType } from './object-tile.enums';
import { Tile } from '../types/tile.type';

@ObjectType()
@Entity()
export class ObjectTile {
  @Field()
  @PrimaryColumn('varchar', { length: 10, default: () => `'${nanoid()}'` })
  id: string;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isAnimated: boolean;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isLethal: boolean;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isBlocking: boolean;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isStatic: boolean;

  @Field()
  @Column('enum', { enum: ObjectTileType })
  type: ObjectTileType;

  @Field((type) => Tile)
  @Column('jsonb')
  tile: Tile;

  @Field((type) => Game)
  @ManyToOne((type) => Game, (game) => game.objectTiles)
  @JoinColumn()
  game: Game;

  @Column('varchar', { length: 10 })
  gameId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
