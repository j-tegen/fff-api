import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerResolver } from './player.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../game/game.model';
import { Player } from './player.model';
import { UtilitiesService } from '../utilities/utilities.service';
import { GameService } from '../game/game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player])],
  providers: [PlayerService, PlayerResolver, UtilitiesService, GameService],
})
export class PlayerModule {}
