import { Resolver } from '@nestjs/graphql';
import { ObjectTile } from './object-tile.model';

@Resolver((of) => ObjectTile)
export class ObjectTileResolver {}
