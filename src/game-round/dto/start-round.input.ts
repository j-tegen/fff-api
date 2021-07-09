import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StartRoundInput {
  @Field()
  gameId: string;

  @Field()
  playerId: string;
}
