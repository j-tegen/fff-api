import { Module } from '@nestjs/common';
import { GameRoundService } from './game-round.service';
import { GameRoundResolver } from './game-round.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRound } from './game-round.model';
import { Player } from 'src/player/player.model';
import { PlayerService } from 'src/player/player.service';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameRound, Player])],
  providers: [
    GameRoundService,
    GameRoundResolver,
    PlayerService,
    UtilitiesService,
  ],
})
export class GameRoundModule {}
