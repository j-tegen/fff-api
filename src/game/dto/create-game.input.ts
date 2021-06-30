import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateGameInput {
  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  isPublic: boolean;

  @Field({ nullable: true })
  boardSize: number;
}
