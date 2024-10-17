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
import { GameLogic } from './mock/gameLogic';
import { RoomHandler } from './mock/roomHandler';
import { Round } from './mock/round';
import { RoundStepType } from './mock/roundTypes';
import { ChickenState } from './game/chicken';

function setButtonEnabled(button: HTMLButtonElement, enabled: boolean): void {
  if (enabled) {
    button.disabled = false;
    button.style.display = "";
  } else {
    button.disabled = true;
    button.style.display = "none";
  }
}

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
  const game = new Game(appService);
  await game.init();
  return game;
}

async function main(): Promise<void> {
  //const socket = await createSocket();
  const app = await createApp();
  app.run();
  //const result = await socket.sendGameInitialize();
  //const roomsReceivedEvent = result?.find(v => v.event === socketEventNames.rooms.received)! as RoomsReceivedEventResponse;
  //await socket.sendRoomJoin(roomsReceivedEvent.data.rooms[0].roomId);

  const game = await createGame(app);


  const roomHandler = new RoomHandler();
  const gameLogic = new GameLogic();
  const round = new Round(gameLogic);

  const playerLane = game.addLane();
  const player = roomHandler.addPlayer();

  const bet = document.getElementById('bet')!;
  const multiplier = document.getElementById('multiplier')!;
  const timer = document.getElementById('timer')!;
  const balance = document.getElementById('balance')!;
  const betInput = document.getElementById('betInput')! as HTMLInputElement;
  const placeBetBtn = document.getElementById('placeBetBtn')! as HTMLButtonElement;
  const cashOutBtn = document.getElementById('cashOutBtn')! as HTMLButtonElement;
  betInput.placeholder = '100';
  betInput.value = '100';
  multiplier.textContent = 'Multiplier: 0';

  const balanceUpdate = (): void => {
    balance.textContent = 'Balance: ' + player.balance;
  }

  app.tickEventHandler.addEvent('roundTimerUpdate', (dt) => {
    round.timer.update(dt * 1000);
  })

  round.timer.updateEvent = (dtMS) => {
    timer.textContent = 'Timer: ' + (dtMS / 1000).toFixed(0);
  }

  placeBetBtn.onclick = () => {
    player.bet = betInput.value === '' ? undefined : { value: Number(betInput.value) };
    console.log('placeBet', betInput.value, player.bet);
    bet.textContent = 'Bet: ' + (player.bet?.value ?? '0');

  }

  cashOutBtn.onclick = () => {
    if (player.bet === undefined) {
      return;
    }
    console.log('cashout');

    player.cashedOut = true;
  }


  round.betEnableEvent = () => {
    console.log('betEnable');
    setButtonEnabled(cashOutBtn, false);
    setButtonEnabled(placeBetBtn, true);

    game.resetGame();
    roomHandler.resetPlayers();
  }

  round.startRoundEvent = () => {
    console.log('startRound');
    gameLogic.startRound(roomHandler.players);

    balanceUpdate();

    setButtonEnabled(cashOutBtn, false);
    setButtonEnabled(placeBetBtn, false);

    if (player.bet === undefined || player.cashedOut) {
      return;
    }

    playerLane.setChickenOnLaneStep(0);
  }

  round.startStepEvent = (roundStepIndex) => {
    const roundStep = gameLogic.roundSteps[roundStepIndex];
    console.log('startStep', roundStep);

    setButtonEnabled(placeBetBtn, false);
    setButtonEnabled(cashOutBtn, true);

    cashOutBtn.disabled = false;
    multiplier.textContent = 'Multiplier: ' + roundStep.multiplierValue.toString();

  }

  round.endStepEvent = (roundStepIndex) => {
    const roundStep = gameLogic.roundSteps[roundStepIndex];
    console.log('endStep', roundStepIndex);

    gameLogic.endStep(roomHandler.players, roundStepIndex);

    balanceUpdate();

    setButtonEnabled(cashOutBtn, false);
    setButtonEnabled(placeBetBtn, false);

    if (player.bet === undefined || player.cashedOut) {
      return;
    }

    playerLane.setChickenOnLaneStep(roundStepIndex + 1);
    if (roundStep.type === RoundStepType.Crash) {
      playerLane.chicken.chickenState = ChickenState.Hurt;
    }
  }


  round.endRoundEvent = () => {
    console.log('endRound');
  }

  round.start();
}



window.addEventListener('load', main);
