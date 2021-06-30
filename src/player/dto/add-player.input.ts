import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddPlayerInput {
  @Field()
  gameId: string;

  @Field()
  name: string;
}
