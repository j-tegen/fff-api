import { Module } from '@nestjs/common';
import { ObjectTileService } from './object-tile.service';
import { ObjectTileResolver } from './object-tile.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectTile } from './object-tile.model';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectTile])],
  providers: [ObjectTileService, ObjectTileResolver],
})
export class ObjectTileModule {}
