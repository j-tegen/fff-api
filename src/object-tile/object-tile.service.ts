import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Game } from '../game/game.model';
import { TileUtils } from '../utils/tile.utils';
import { Repository } from 'typeorm';
import { ObjectTileType } from './object-tile.enums';
import { ObjectTile } from './object-tile.model';

@Injectable()
export class ObjectTileService {
  constructor(
    @InjectRepository(ObjectTile)
    private readonly repository: Repository<ObjectTile>,
  ) {}

  async get(gameId: string): Promise<ObjectTile[]> {
    return this.repository.find({ where: { gameId } });
  }

  async addObjectTiles(game: Game): Promise<ObjectTile[]> {
    const spikes: Partial<ObjectTile>[] = this.getSpikes(game);
    const holes: Partial<ObjectTile>[] = this.getHoles(game);
    const crates: Partial<ObjectTile>[] = this.getCrates(game);
    return this.repository.save([...spikes, ...holes, ...crates]);
  }

  getSpikes({ boardSize, id }: Game): Partial<ObjectTile>[] {
    const spikes: number = Math.floor(boardSize / 4);
    return new Array(spikes).fill(null).map(() => {
      return {
        id: nanoid(10),
        gameId: id,
        type: ObjectTileType.SPIKES,
        isAnimated: true,
        isBlocking: true,
        isLethal: true,
        isStatic: true,
        tile: TileUtils.getRandomTile(boardSize),
      };
    });
  }

  getHoles({ boardSize, id }: Game): Partial<ObjectTile>[] {
    const spikes: number = Math.floor(boardSize / 4);
    return new Array(spikes).fill(null).map(() => {
      return {
        id: nanoid(10),
        gameId: id,
        type: ObjectTileType.HOLE,
        isAnimated: false,
        isBlocking: false,
        isLethal: true,
        isStatic: true,
        tile: TileUtils.getRandomTile(boardSize),
      };
    });
  }

  getCrates({ boardSize, id }: Game): Partial<ObjectTile>[] {
    const spikes: number = Math.floor(boardSize / 4);
    return new Array(spikes).fill(null).map(() => {
      return {
        id: nanoid(10),
        gameId: id,
        type: ObjectTileType.CRATE,
        isAnimated: false,
        isBlocking: true,
        isLethal: false,
        isStatic: true,
        tile: TileUtils.getRandomTile(boardSize),
      };
    });
  }
}
