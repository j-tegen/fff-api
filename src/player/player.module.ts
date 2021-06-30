import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerResolver } from './player.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../game/game.model';
import { Player } from './player.model';
import { GameService } from '../game/game.service';
import { GameEngineService } from '../game-engine/game-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player])],
  providers: [PlayerService, PlayerResolver, GameService, GameEngineService],
})
export class PlayerModule {}
