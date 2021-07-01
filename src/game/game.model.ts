import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { Player } from '../player/player.model';
import { ObjectTile } from '../object-tile/object-tile.model';
import { Action } from '../action/action.model';
import { Arrow } from '../arrow/arrow.model';

@ObjectType()
@Entity()
export class Game {
  @Field()
  @PrimaryColumn('varchar', { length: 10, default: () => `'${nanoid()}'` })
  id: string;

  @Field((type) => [Player])
  @OneToMany((type) => Player, (player) => player.game)
  players: Player[];

  @Field((type) => [ObjectTile])
  @OneToMany((type) => ObjectTile, (player) => player.game)
  objectTiles: ObjectTile;

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isPublic: boolean;

  @OneToMany((type) => Action, (action) => action.game)
  actions: Action[];

  @Field((type) => [Arrow])
  @OneToMany((type) => Arrow, (arrow) => arrow.game)
  arrows: Arrow[];

  @Field((type) => Boolean)
  @Column('boolean', { default: false })
  isResolvingActions: boolean;

  @Field()
  @Column({ default: 12 })
  boardSize: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
