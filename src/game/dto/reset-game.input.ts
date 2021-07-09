import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetGameInput {
  @Field()
  gameId: string;

  @Field()
  playerId: string;
}
