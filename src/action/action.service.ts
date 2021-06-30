import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Direction } from '../enums/direction.enum';
import { Player } from '../player/player.model';
import { Repository } from 'typeorm';
import { Action } from './action.model';
import { CreateActionInput } from './dto/create-action.input';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action) private readonly repository: Repository<Action>,
  ) {}

  async create(payload: CreateActionInput, player: Player): Promise<Action> {
    const direction: Direction = this.getDirection(player, payload.direction);
    const action: Action = await this.repository.create({
      ...payload,
      direction,
    });
    action.id = nanoid(10);
    return this.repository.save(action);
  }

  getDirection(player: Player, direction?: Direction): Direction {
    return direction ? direction : player.direction;
  }
}
