import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { DateTime } from 'luxon';
import { ActionService } from 'src/action/action.service';
import { GameRound } from 'src/game-round/game-round.model';
import { GameRoundService } from 'src/game-round/game-round.service';
import { GameService } from 'src/game/game.service';
import { ActionType } from '../action/action.enums';
import { Action } from '../action/action.model';
import { Arrow } from '../arrow/arrow.model';
import { ArrowService } from '../arrow/arrow.service';
import { Subscriptions } from '../enums/subscriptions.enum';
import { Game } from '../game/game.model';
import { ObjectTile } from '../object-tile/object-tile.model';
import { ObjectTileService } from '../object-tile/object-tile.service';
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { UtilitiesService } from '../utilities/utilities.service';

@Injectable()
export class GameEngineService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly arrowService: ArrowService,
    private readonly actionService: ActionService,
    private readonly utilService: UtilitiesService,
    private readonly objectTileService: ObjectTileService,
    private readonly gameService: GameService,
    private readonly roundService: GameRoundService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  async resolveActions(actions: Action[], game: Game): Promise<void> {
    let allPlayers: Player[] = await this.playerService.getPlayers(game.id);
    let arrows: Arrow[] = [];
    const objectTiles: ObjectTile[] = await this.objectTileService.get(game.id);
    for (const action of actions) {
      const start: number = DateTime.now().toMillis();
      const player: Player = await this.playerService.get(action.playerId);
      if (!player.isDead && action.type === ActionType.MOVE) {
        const updatedPlayer: Player = await this.playerService.move(
          player,
          game,
          allPlayers,
          objectTiles,
          action.direction,
        );
        await this.pubSub.publish(Subscriptions.PLAYER_UPDATED, {
          playerUpdated: updatedPlayer,
        });
        allPlayers = this.mergePlayers(allPlayers, updatedPlayer);
      } else if (!player.isDead && action.type === ActionType.SHOOT) {
        const arrow: Arrow = await this.arrowService.create(
          game.id,
          player.direction,
          player.tile,
        );
        arrows = this.mergeArrows(arrows, arrow);
      }
      for (const arrow of arrows) {
        const updatedArrow: Arrow = await this.handleMoveArrow(
          arrow,
          game,
          allPlayers,
        );
        arrows = this.mergeArrows(arrows, updatedArrow);
      }
      await this.actionService.resolve(action);
      const end: number = DateTime.now().toMillis();
      await this.utilService.sleep(150 - (end - start));
    }
    while (!!arrows.length) {
      const start: number = DateTime.now().toMillis();
      arrows = await this.loopArrows(arrows, game, allPlayers);
      const end: number = DateTime.now().toMillis();
      await this.utilService.sleep(150 - (end - start));
    }
    await this.gameService.update({ isResolvingActions: false }, game);
    await this.pubSub.publish(Subscriptions.ACTIONS_RESOLVED, {
      actionsResolved: game,
    });
    const alivePlayers: Player[] = await this.playerService.getPlayers(
      game.id,
      {
        isDead: false,
      },
    );
    if (alivePlayers.length <= 1) {
      this.handleGameOver(alivePlayers, game);
    }
  }

  async handleGameOver(alivePlayers: Player[], game: Game): Promise<void> {
    const winnerId: string = !!alivePlayers.length
      ? alivePlayers[0]?.id
      : undefined;
    const round: GameRound = await this.roundService.create(game.id, winnerId);
    await this.pubSub.publish(Subscriptions.GAME_OVER, {
      gameOver: round,
    });
  }

  async loopArrows(
    arrows: Arrow[],
    game: Game,
    allPlayers: Player[],
  ): Promise<Arrow[]> {
    for (const arrow of arrows) {
      const updatedArrow: Arrow = await this.handleMoveArrow(
        arrow,
        game,
        allPlayers,
      );
      arrows = this.mergeArrows(arrows, updatedArrow);
    }
    return arrows.filter((arrow: Arrow) => !arrow.isResolved);
  }

  async handleMoveArrow(
    arrow: Arrow,
    game: Game,
    allPlayers: Player[],
  ): Promise<Arrow> {
    const arrowIsDead: boolean = this.arrowService.checkArrowIsDead(
      arrow,
      game,
    );
    if (arrowIsDead) {
      return this.arrowService.update({ isResolved: true }, arrow);
    }
    const updatedArrow: Arrow = await this.arrowService.move(arrow, game);
    await this.pubSub.publish(Subscriptions.ARROW_UPDATED, {
      arrowUpdated: updatedArrow,
    });
    const player: Player = await this.utilService.blockingCharacter(
      allPlayers,
      updatedArrow.tile,
    );
    if (player) {
      const playerUpdated: Player = await this.playerService.update(
        { isDead: true },
        player,
      );
      await this.pubSub.publish(Subscriptions.PLAYER_UPDATED, {
        playerUpdated,
      });
    }
    return updatedArrow;
  }

  mergeArrows(arrows: Arrow[], updatedArrow: Arrow): Arrow[] {
    const updatedArrows: Arrow[] = arrows.map((arrow: Arrow) => {
      if (arrow.id === updatedArrow.id) {
        return updatedArrow;
      }
      return arrow;
    });
    if (!updatedArrows.find((arrow: Arrow) => arrow.id === updatedArrow.id)) {
      updatedArrows.push(updatedArrow);
    }
    return updatedArrows;
  }

  mergePlayers(players: Player[], updatedPlayer: Player): Player[] {
    return players.map((player: Player) => {
      if (player.id === updatedPlayer.id) {
        return updatedPlayer;
      }
      return player;
    });
  }
}
