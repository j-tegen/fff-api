import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { GameRound } from './game-round.model';

@Injectable()
export class GameRoundService {
  constructor(
    @InjectRepository(GameRound)
    private readonly repository: Repository<GameRound>,
  ) {}

  async getList(gameId: string): Promise<GameRound[]> {
    return this.repository.find({ where: { gameId } });
  }

  async create(gameId: string, winnerId?: string): Promise<GameRound> {
    const round: GameRound = await this.repository.create({ winnerId, gameId });
    round.id = nanoid(10);
    return this.repository.save(round);
  }
}
