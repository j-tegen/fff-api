import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionResolver } from './action.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './action.model';
import { Game } from '../game/game.model';
import { Player } from '../player/player.model';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { GameEngineService } from '../game-engine/game-engine.service';
import { ObjectTile } from '../object-tile/object-tile.model';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { ArrowService } from '../arrow/arrow.service';
import { Arrow } from '../arrow/arrow.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action, Game, Player, ObjectTile, Arrow]),
  ],
  providers: [
    ActionService,
    ActionResolver,
    GameService,
    PlayerService,
    GameEngineService,
    ObjectTileService,
    ArrowService,
  ],
})
export class ActionModule {}
