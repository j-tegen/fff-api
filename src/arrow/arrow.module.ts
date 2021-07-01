import { Module } from '@nestjs/common';
import { ArrowService } from './arrow.service';
import { ArrowResolver } from './arrow.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arrow } from './arrow.model';
import { UtilitiesService } from '../utilities/utilities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Arrow])],
  providers: [ArrowService, ArrowResolver, UtilitiesService],
})
export class ArrowModule {}
