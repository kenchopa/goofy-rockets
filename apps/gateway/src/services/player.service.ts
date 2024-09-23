export type Player = {
  betAmount: number;
  cashedOut: boolean;
};

// TODO: move to a player microservice
export class PlayerService {
  private players: { [key: string]: Player };

  constructor() {
    // Initialize the in-memory player store
    this.players = {};
  }

  // Add a new player
  public addPlayer(playerId: string): void {
    this.players[playerId] = { betAmount: 0, cashedOut: false };
  }

  // Get a player's data
  public getPlayer(playerId: string): Player | null {
    return this.players[playerId] || null;
  }

  // Remove a player
  public removePlayer(playerId: string): void {
    delete this.players[playerId];
  }

  // Reset all players' bet amounts and cash-out status
  public resetPlayers(): void {
    Object.keys(this.players).forEach((playerId) => {
      this.players[playerId].betAmount = 0;
      this.players[playerId].cashedOut = false;
    });
  }

  // Place a bet for a player
  public placeBet(playerId: string, amount: number): void {
    if (!this.players[playerId]) {
      throw new Error('Player not found when placing bet');
    }

    if (this.players[playerId]) {
      this.players[playerId].betAmount = amount;
      this.players[playerId].cashedOut = false;
    }
  }

  // Cash out a player's bet
  public cashOut(playerId: string, currentMultiplier: number): number {
    const player = this.players[playerId];
    if (player && player.betAmount > 0 && !player.cashedOut) {
      const payout = player.betAmount * currentMultiplier;
      player.cashedOut = true;
      return payout;
    }

    throw new Error(`Unable to cash out for player ${playerId}`);
  }

  // Get all players (for debugging or administrative purposes)
  public getAllPlayers(): { [key: string]: Player } {
    return this.players;
  }

  // Reset a specific player's bet and cash-out status
  public resetPlayerBet(playerId: string): void {
    if (this.players[playerId]) {
      this.players[playerId].betAmount = 0;
      this.players[playerId].cashedOut = false;
    } else {
      throw new Error(`Player ${playerId} not found when resetting bet`);
    }
  }
}

const playerService = new PlayerService();

export default playerService;
