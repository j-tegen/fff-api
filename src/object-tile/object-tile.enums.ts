import { registerEnumType } from '@nestjs/graphql';

export enum ObjectTileType {
  SPIKES = 'SPIKES',
  HOLE = 'HOLE',
  CRATE = 'CRATE',
}

registerEnumType(ObjectTileType, {
  name: 'ObjectTileType',
  description: 'Object tile types',
});
