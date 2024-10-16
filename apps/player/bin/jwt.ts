import * as jwt from 'jsonwebtoken';

(async () => {
    const args = process.argv.slice(2);

    const gameId = args[0];
    const playerId = args[1];

    const token = jwt.sign({ gid: gameId, uid: playerId }, 'shhhhhhhhhhhh');

    console.log('Token:', token);
})();