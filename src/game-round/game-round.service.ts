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

  async getActiveRound(gameId: string): Promise<GameRound> {
    return this.repository.findOne({
      where: { gameId },
      order: { createdAt: 'DESC' },
    });
  }

  async getList(gameId: string): Promise<GameRound[]> {
    return this.repository.find({ where: { gameId } });
  }

  async create(gameId: string, winnerId?: string): Promise<GameRound> {
    const round: GameRound = await this.repository.create({ winnerId, gameId });
    round.id = nanoid(10);
    return this.repository.save(round);
  }

  async update(
    round: GameRound,
    patch: Partial<GameRound>,
  ): Promise<GameRound> {
    return this.repository.save({ ...round, ...patch });
  }
}
