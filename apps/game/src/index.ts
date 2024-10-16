import { AppContext } from './app/appContext';
import { AppService } from './app/appService';
import { GameInitializedEvent } from './socket/events/gameInitializedEvent';
import { SocketContext } from './socket/socketContext';
import { SocketService } from './socket/socketService';

async function createApp(): Promise<AppService> {
  const context = new AppContext();

  await context.init();
  return new AppService(context);
}

async function createSocket(): Promise<SocketService> {
  const context = new SocketContext();

  context.socketEventContainer.add(new GameInitializedEvent(context));

  const service = new SocketService(context);
  await service.connect('http://localhost:3002');

  return service;
}

async function main(): Promise<void> {
  const socket = await createSocket();
  const app = await createApp();
  app.run();
  await socket.sendGameInitialize();
}

window.addEventListener('load', main);
