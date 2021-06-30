import { Injectable } from '@nestjs/common';
import { Direction } from '../enums/direction.enum';
import { ObjectTile } from '../object-tile/object-tile.model';
import { Player } from '../player/player.model';
import { Tile } from '../types/tile.type';

@Injectable()
export class GameEngineService {
  getTargetTile(
    { row: sourceRow, column: sourceColumn }: Tile,
    direction: Direction,
    boardSize: number,
    limitByBoard = false,
  ): Tile {
    switch (direction) {
      case Direction.UP: {
        const row: number = limitByBoard
          ? Math.max(sourceRow - 1, 0)
          : sourceRow - 1;
        return { column: sourceColumn, row };
      }
      case Direction.DOWN: {
        const row: number = limitByBoard
          ? Math.min(sourceRow + 1, boardSize - 1)
          : sourceRow + 1;
        return { column: sourceColumn, row };
      }
      case Direction.LEFT: {
        const column: number = limitByBoard
          ? Math.max(sourceColumn - 1, 0)
          : sourceColumn - 1;
        return { column, row: sourceRow };
      }
      case Direction.RIGHT: {
        const column: number = limitByBoard
          ? Math.min(sourceColumn + 1, boardSize - 1)
          : sourceColumn + 1;
        return { column, row: sourceRow };
      }
    }
  }

  blockingObject(
    objectTiles: ObjectTile[],
    { row: targetRow, column: targetCol }: Tile,
  ): ObjectTile {
    return objectTiles.find(({ tile: { row, column } }: ObjectTile) => {
      return row === targetRow && column === targetCol;
    });
  }

  blockingCharacter(
    players: Player[],
    { row: targetRow, column: targetCol }: Tile,
  ): Player {
    return players.find(({ isDead, tile: { row, column } }: Player) => {
      return !isDead && row === targetRow && column === targetCol;
    });
  }
}
