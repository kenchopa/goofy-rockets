import logger from '@wgp/logger';
import { Server } from 'socket.io';

import playerService from './player.service';

// TODO: move this to a game logic microservice
export class GameLogicService {
  private baseMultiplier: number;

  private restartGameInSeconds: number;

  private currentMultiplier: number;

  private crashPoint: number;

  private isGameRunning: boolean;

  private interval: NodeJS.Timeout | null;

  constructor(baseMultiplier: number = 0.1, restartGameInSeconds = 5) {
    this.baseMultiplier = baseMultiplier;
    this.restartGameInSeconds = restartGameInSeconds;
    this.currentMultiplier = baseMultiplier;
    this.crashPoint = 0;
    this.isGameRunning = false;
    this.interval = null;
  }

  private generateCrashPoint(): number {
    return parseFloat(
      (Math.random() * (5 - this.baseMultiplier) + this.baseMultiplier).toFixed(
        2,
      ),
    );
  }

  public startGame(server: Server): void {
    this.isGameRunning = true;
    this.currentMultiplier = this.baseMultiplier;
    this.crashPoint = this.generateCrashPoint();
    logger.info(`New Game Started! Crash point: ${this.crashPoint}x`);

    playerService.resetPlayers();

    server.emit('gameStart', { crashPoint: this.crashPoint });

    this.interval = setInterval(() => {
      this.currentMultiplier += 0.01;
      server.emit('multiplierUpdate', { multiplier: this.currentMultiplier });

      if (this.currentMultiplier >= this.crashPoint) {
        this.stopGame(server);
      }
    }, 100);
  }

  public stopGame(server: Server): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isGameRunning = false;

    server.emit('gameCrash', { crashPoint: this.crashPoint });
    logger.info(`Game Crashed at ${this.crashPoint}x`);

    // Handle players who did not cash out
    this.handlePlayerLosses(server);

    // Restart game after x seconds
    setTimeout(() => {
      this.startGame(server);
    }, this.restartGameInSeconds * 1000);
  }

  public isRunning(): boolean {
    return this.isGameRunning;
  }

  public getCurrentMultiplier(): number {
    return this.currentMultiplier;
  }

  // eslint-disable-next-line class-methods-use-this
  private handlePlayerLosses(server: Server): void {
    const players = playerService.getAllPlayers();
    Object.keys(players).forEach((playerId) => {
      const player = players[playerId];
      if (!player.cashedOut && player.betAmount > 0) {
        server
          .to(playerId)
          .emit('playerLost', { message: 'You lost your bet!' });
        logger.info(`Player ${playerId} lost their bet.`);
        playerService.resetPlayerBet(playerId); // Reset the player's bet
      }
    });
  }
}

const gameLogicService = new GameLogicService();

export default gameLogicService;
