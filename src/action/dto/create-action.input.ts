import { Field, InputType } from '@nestjs/graphql';
import { Direction } from '../../enums/direction.enum';
import { ActionType } from '../action.enums';

@InputType()
export class CreateActionInput {
  @Field()
  playerId: string;

  @Field()
  gameId: string;

  @Field((type) => ActionType)
  type: ActionType;

  @Field((type) => Direction, { nullable: true })
  direction?: Direction;
}
