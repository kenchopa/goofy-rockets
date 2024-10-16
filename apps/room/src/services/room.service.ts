export type Room = {
  roomId: string;
  gameId: string;
  playerIds: string[];
};

// TODO: move to a player microservice
export class RoomService {
  private rooms: { [key: string]: Room };

  constructor() {
    // Initialize the in-memory player store
    this.rooms = {};
  }

  // Add a new room
  public addRoom(roomId: string, gameId: string): void {
    this.rooms[roomId] = { gameId, playerIds: [], roomId };
  }

  // Get a player's data
  public getRoom(): Room | null {
    return this.rooms[Object.keys(this.rooms)[0]] || null; // gets the first (and only) room for now
  }

  // Add a player
  public addPlayer(roomId: string, playerId: string): void {
    this.rooms[roomId].playerIds.push(playerId);
  }

  // Remove a player
  public removePlayer(roomId: string, playerId: string): void {
    this.rooms[roomId].playerIds = this.rooms[roomId].playerIds.filter(
      (id) => id !== playerId,
    );
  }
}

const roomService = new RoomService();

export default roomService;
