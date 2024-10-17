/* eslint-disable import/prefer-default-export */
import { Player } from './player';

export class RoomHandler {
  public players: Player[] = [];

  public resetPlayers(): void {
    this.players.forEach((player) => player.reset());
  }

  public addPlayer(): Player {
    const player = new Player(this.players.length);
    this.players.push(player);
    return player;
  }
}
