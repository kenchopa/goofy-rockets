export interface SocketEventResponse<TData = unknown> {
  correlationId: string;
  data: TData;
  event: string;
}
