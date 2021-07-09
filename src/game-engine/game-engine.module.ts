import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRound } from '../game-round/game-round.model';
import { GameRoundService } from '../game-round/game-round.service';
import { Action } from '../action/action.model';
import { ActionService } from '../action/action.service';
import { Arrow } from '../arrow/arrow.model';
import { ArrowService } from '../arrow/arrow.service';
import { Game } from '../game/game.model';
import { GameService } from '../game/game.service';
import { ObjectTile } from '../object-tile/object-tile.model';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { GameEngineService } from './game-engine.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      Game,
      ObjectTile,
      Arrow,
      Action,
      GameRound,
    ]),
  ],
  providers: [
    GameEngineService,
    PlayerService,
    ArrowService,
    ActionService,
    GameService,
    ObjectTileService,
    UtilitiesService,
    GameRoundService,
  ],
})
export class GameEngineModule {}
