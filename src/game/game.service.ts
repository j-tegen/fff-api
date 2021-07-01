import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { CreateGameInput } from './dto/create-game.input';
import { Game } from './game.model';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
  ) {}

  async create({ isPublic, boardSize }: CreateGameInput): Promise<Game> {
    const game: Game = await this.repository.create({
      isPublic,
      boardSize,
    });
    game.id = nanoid(10);
    return this.repository.save(game);
  }

  async update(patch: Partial<Game>, game: Game): Promise<Game> {
    return this.repository.save({ ...game, ...patch });
  }

  async get(id: string): Promise<Game> {
    return this.repository.findOne(id);
  }

  async getPublic(): Promise<Game[]> {
    return this.repository.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
