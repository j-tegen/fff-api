import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.model';
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { ObjectTile } from '../object-tile/object-tile.model';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { GameEngineService } from '../game-engine/game-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player, ObjectTile])],
  providers: [
    GameService,
    PlayerService,
    GameResolver,
    ObjectTileService,
    GameEngineService,
  ],
})
export class GameModule {}
