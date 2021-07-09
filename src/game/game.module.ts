import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.model';
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { ObjectTile } from '../object-tile/object-tile.model';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { GameRoundService } from '../game-round/game-round.service';
import { GameRound } from '../game-round/game-round.model';
import { GameEngineService } from 'src/game-engine/game-engine.service';
import { ArrowService } from 'src/arrow/arrow.service';
import { Arrow } from 'src/arrow/arrow.model';
import { ActionService } from 'src/action/action.service';
import { Action } from 'src/action/action.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game,
      Player,
      ObjectTile,
      GameRound,
      Arrow,
      Action,
    ]),
  ],
  providers: [
    GameService,
    PlayerService,
    GameResolver,
    ObjectTileService,
    UtilitiesService,
    GameRoundService,
    GameEngineService,
    ArrowService,
    ActionService,
  ],
})
export class GameModule {}
