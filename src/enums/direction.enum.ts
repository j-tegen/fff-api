import { registerEnumType } from '@nestjs/graphql';

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

registerEnumType(Direction, {
  name: 'Direction',
  description: 'Directions',
});
