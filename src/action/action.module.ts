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
import { UtilitiesService } from '../utilities/utilities.service';
import { ArrowService } from '../arrow/arrow.service';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { Arrow } from '../arrow/arrow.model';
import { ObjectTile } from '../object-tile/object-tile.model';
import { GameRoundService } from 'src/game-round/game-round.service';
import { GameRound } from 'src/game-round/game-round.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Action,
      Game,
      Player,
      Arrow,
      ObjectTile,
      GameRound,
    ]),
  ],
  providers: [
    ActionService,
    ActionResolver,
    GameService,
    PlayerService,
    GameEngineService,
    UtilitiesService,
    ArrowService,
    ObjectTileService,
    GameRoundService,
  ],
})
export class ActionModule {}
