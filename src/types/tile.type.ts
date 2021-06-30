import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tile {
  @Field()
  column: number;

  @Field()
  row: number;
}
