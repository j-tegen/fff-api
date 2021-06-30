import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Direction } from '../enums/direction.enum';
import { GameEngineService } from '../game-engine/game-engine.service';
import { Game } from '../game/game.model';
import { Tile } from '../types/tile.type';
import { Repository } from 'typeorm';
import { Arrow } from './arrow.model';

@Injectable()
export class ArrowService {
  constructor(
    @InjectRepository(Arrow) private readonly repository: Repository<Arrow>,
    private readonly gameEngine: GameEngineService,
  ) {}

  async create(
    gameId: string,
    direction: Direction,
    tile: Tile,
  ): Promise<Arrow> {
    const arrow: Arrow = await this.repository.create({
      gameId,
      direction,
      tile,
    });
    arrow.id = nanoid(10);
    return this.repository.save(arrow);
  }

  async getArrow(id: string): Promise<Arrow> {
    return this.repository.findOne({ where: { id } });
  }

  async getArrows(gameId: string): Promise<Arrow[]> {
    return this.repository.find({ where: { gameId } });
  }

  async delete(arrow: Arrow): Promise<void> {
    await this.repository.delete(arrow);
  }

  async move(arrow: Arrow, game: Game): Promise<Arrow> {
    const targetTile: Tile = this.gameEngine.getTargetTile(
      arrow.tile,
      arrow.direction,
      game.boardSize,
      false,
    );
    return this.repository.save({ ...arrow, tile: targetTile });
  }

  checkArrowIsDead(
    { tile: { row, column } }: Arrow,
    { boardSize }: Game,
  ): boolean {
    if (row < 0 || column < 0) {
      return true;
    }
    if (row >= boardSize || column >= boardSize) {
      return true;
    }
    return false;
  }
}
