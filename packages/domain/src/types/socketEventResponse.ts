export interface SocketEventResponse<TData = unknown> {
  correlationId: string;
  data: TData;
  event: string;
}

export type RoomsReceivedEventResponse = SocketEventResponse<{
  rooms: {
    gameId: string;
    roomId: string;
    users: string[];
  }[];
}>;
