import { Module } from '@nestjs/common';
import { GameRoundService } from './game-round.service';
import { GameRoundResolver } from './game-round.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRound } from './game-round.model';

@Module({
  imports: [TypeOrmModule.forFeature([GameRound])],
  providers: [GameRoundService, GameRoundResolver],
})
export class GameRoundModule {}
