import { Tile } from '../types/tile.type';

export class TileUtils {
  static getRandomTile(boardSize: number): Tile {
    const min = 1;
    const max = boardSize - 1;
    return {
      row: Math.floor(Math.random() * (max - min) + min),
      column: Math.floor(Math.random() * (max - min) + min),
    };
  }
}
