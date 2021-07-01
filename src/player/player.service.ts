import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { nanoid } from 'nanoid';
import { ErrorCode } from '../enums/error-codes.enum';
import { Repository } from 'typeorm';
import { AddPlayerInput } from './dto/add-player.input';
import { PlayerColour } from './player.enums';
import { Player } from './player.model';
import { Tile } from '../types/tile.type';
import { Game } from '../game/game.model';
import { Direction } from '../enums/direction.enum';
import { ObjectTile } from '../object-tile/object-tile.model';
import { UtilitiesService } from '../utilities/utilities.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private readonly repository: Repository<Player>,
    private readonly utilService: UtilitiesService,
  ) {}

  async get(id: string): Promise<Player> {
    return this.repository.findOne({ where: { id } });
  }

  async create(
    { gameId, name }: AddPlayerInput,
    { boardSize }: Game,
  ): Promise<Player> {
    const existingPlayers: Player[] = await this.getPlayers(gameId);
    const colour: PlayerColour = this.getPlayerColour(existingPlayers);
    if (!colour) {
      throw new GraphQLError(ErrorCode.GAME_FULL);
    }
    const player: Player = await this.repository.create({
      gameId,
      name,
      colour,
      isOwner: existingPlayers.length === 0,
      tile: this.getStartingPosition(colour, boardSize),
    });
    player.id = nanoid(10);
    return this.repository.save(player);
  }

  async getPlayers(
    gameId: string,
    optional?: Partial<Player>,
  ): Promise<Player[]> {
    return this.repository.find({ where: { gameId, ...optional } });
  }

  async update(patch: Partial<Player>, player: Player): Promise<Player> {
    return this.repository.save({ ...player, ...patch });
  }

  async move(
    player: Player,
    game: Game,
    allPlayers: Player[],
    objectTiles: ObjectTile[],
    direction: Direction,
  ): Promise<Player> {
    const targetTile: Tile = this.utilService.getTargetTile(
      player.tile,
      direction,
      game.boardSize,
      true,
    );
    const blockingPlayer: Player = this.utilService.blockingCharacter(
      allPlayers,
      targetTile,
    );
    const blockingObject: ObjectTile = this.utilService.blockingObject(
      objectTiles,
      targetTile,
    );
    const isDead: boolean = blockingObject?.isLethal ? true : player.isDead;
    if (!blockingObject && !blockingPlayer) {
      return this.update({ isDead, direction, tile: targetTile }, player);
    }
    if (blockingObject && !blockingObject.isBlocking) {
      return this.update({ isDead, direction, tile: targetTile }, player);
    }
    if (isDead) {
      return this.update({ isDead, direction }, player);
    }
    return this.update({ direction }, player);
  }

  getStartingPosition(colour: PlayerColour, boardSize: number): Tile {
    switch (colour) {
      case PlayerColour.RED:
        return {
          row: 0,
          column: 0,
        };
      case PlayerColour.BLUE:
        return {
          row: 0,
          column: boardSize - 1,
        };
      case PlayerColour.GREEN:
        return {
          row: boardSize - 1,
          column: boardSize - 1,
        };
      case PlayerColour.YELLOW:
        return {
          row: boardSize - 1,
          column: 0,
        };
    }
  }

  getPlayerColour(existingPlayers: Player[]): PlayerColour {
    return [
      PlayerColour.RED,
      PlayerColour.BLUE,
      PlayerColour.GREEN,
      PlayerColour.YELLOW,
    ].find(
      (colour: PlayerColour) =>
        !existingPlayers.find((player: Player) => player.colour === colour),
    );
  }
}
