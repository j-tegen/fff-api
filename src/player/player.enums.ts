import { registerEnumType } from '@nestjs/graphql';

export enum PlayerColour {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
}

registerEnumType(PlayerColour, {
  name: 'PlayerColour',
  description: 'Available player colours',
});
