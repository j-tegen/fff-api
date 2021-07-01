import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetActionsArgs {
  @Field()
  gameId: string;

  @Field((type) => Boolean, { nullable: true, defaultValue: true })
  isResolved?: boolean;
}
