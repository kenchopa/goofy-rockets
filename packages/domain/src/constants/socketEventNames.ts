const socketEventNames = {
  game: {
    initialised: 'game.initialised',
  },
  rooms: {
    received: 'rooms.received',
  },
  room: {
    player: {
      join: 'room.player.join',
      joined: 'room.player.joined',
    },
  },
};

export default socketEventNames;
