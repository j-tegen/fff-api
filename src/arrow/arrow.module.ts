import { Module } from '@nestjs/common';
import { ArrowService } from './arrow.service';
import { ArrowResolver } from './arrow.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrow } from './arrow.model';
import { GameEngineService } from '../game-engine/game-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Arrow])],
  providers: [ArrowService, ArrowResolver, GameEngineService],
})
export class ArrowModule {}
