import { socketEventNames } from '@wgp/domain';
import { AppContext } from './app/appContext';
import { AppService } from './app/appService';
import { Game } from './game/game';
import { GameInitializedEvent } from './socket/events/gameInitializedEvent';
import { RoomPlayerJoinedEvent } from './socket/events/roomPlayerJoinedEvent';
import { RoomsReceivedEvent } from './socket/events/roomsReceivedEvent';
import { SocketContext } from './socket/socketContext';
import { SocketService } from './socket/socketService';
import { RoomsReceivedEventResponse } from '@wgp/domain/dist/src/types/socketEventResponse';

async function createApp(): Promise<AppService> {
  const context = new AppContext();

  await context.init();
  return new AppService(context);
}

async function createSocket(): Promise<SocketService> {
  const context = new SocketContext();

  const service = new SocketService(context);
  await service.connect('http://localhost:3002');

  context.addEvent(new GameInitializedEvent(context));
  context.addEvent(new RoomsReceivedEvent(context));
  context.addEvent(new RoomPlayerJoinedEvent(context));

  return service;
}

async function createGame(appService: AppService): Promise<Game> {
  const game = new Game();
  await game.init(appService);
  return game;
}

async function main(): Promise<void> {
  const socket = await createSocket();
  const app = await createApp();
  app.run();
  const result = await socket.sendGameInitialize();
  const roomsReceivedEvent = result?.find(v => v.event === socketEventNames.rooms.received)! as RoomsReceivedEventResponse;
  await socket.sendRoomJoin(roomsReceivedEvent.data.rooms[0].roomId);

  const game = await createGame(app);

}

window.addEventListener('load', main);
