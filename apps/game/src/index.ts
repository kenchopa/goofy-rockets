import { AppContext } from './app/appContext';
import { AppService } from './app/appService';
import { GameInitializedEvent } from './socket/events/gameInitializedEvent';
import { RoomsReceivedEvent } from './socket/events/roomsReceivedEvent';
import { SocketContext } from './socket/socketContext';
import { SocketService } from './socket/socketService';

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

  return service;
}

async function main(): Promise<void> {
  const socket = await createSocket();
  const app = await createApp();
  app.run();
  await socket.sendGameInitialize();
  console.log('done');
}

window.addEventListener('load', main);
