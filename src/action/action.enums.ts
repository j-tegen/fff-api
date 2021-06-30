import { registerEnumType } from '@nestjs/graphql';

export enum ActionType {
  MOVE = 'MOVE',
  SHOOT = 'SHOOT',
}

registerEnumType(ActionType, {
  name: 'ActionType',
  description: 'All action types',
});
