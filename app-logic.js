
const io = socketIO(server);

/* initial socket room number */
let roomNum = 1;

/* socket io onConnect */
io.on('connection', (socket) => {
  // define current room Id
  let currentRoomId = 'room_' + roomNum;
  socket.join(currentRoomId);
  console.log(`${socket.id} has connected to ${currentRoomId}`);

  // increase roomNum if 2 clients are present in a room.
  if (io.sockets.adapter.rooms.get(currentRoomId) && io.sockets.adapter.rooms.size > 1) roomNum++;

  // decides the playerSign ('X' or 'O') of the player who just connected, emits it to the player.
  let playerSign = (io.sockets.adapter.rooms.get(currentRoomId).length > 1) ? 'O' : 'X';
  io.sockets.to(socket.id).emit('playerSign', playerSign)

  // notify everyone in the room that a player had just joined.
  io.sockets.in(currentRoomId).emit('connectToRoom', socket.id, currentRoomId,
    io.sockets.adapter.rooms.get(currentRoomId).sockets);
  console.log(`${currentRoomId} just joined`)

  // emit startGame event if there are enough players in this room
  if (io.sockets.adapter.rooms.get(currentRoomId).length > 1) {
    io.sockets.in(currentRoomId).emit('startGame');
  }

  // a player made a move, checks if it is a winning/stalemate situation, emits the updated board to all users in room
  socket.on('makeMove', (boardState, room, currPlayer, nextPlayer) => {
    if (checkWin(boardState, currPlayer)) {
      io.sockets.in(room).emit('gameWin', currPlayer);
    }
    if (checkStalemate(boardState)) {
      io.sockets.in(room).emit('stalemate');
    }
    io.sockets.in(room).emit('updateBoard', boardState, nextPlayer);
  })

  // a player resets the game.
  socket.on('resetGame', (room) => {
    console.log(`${socket.id} reset the game in ${room}!`);
    io.sockets.in(room).emit('resetGame');
  })

  // when a player disconnects from the game, notifies remaining player in the room
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected from ${currentRoomId}`);
    socket.broadcast.in(currentRoomId).emit('userLeft', socket.id);
  })

  // a player taunts their opponent
  socket.on('tauntOpponent', (opponentId) => {
    io.sockets.to(opponentId).emit('incomingTaunt', getRandomTaunt());
  })
})

/* winning board index combinations */
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

/* receives a board, checks if it's in a stalemate situation */
const checkStalemate = (boardState) => {
  // checking if board is completely occupied
  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === '') {
      return false;
    }
  }

  /* checking if board has a winner */
  if (checkWin(boardState, 'X') || checkWin(boardState, 'O')) {
    return false;
  }

  return true;
}

/* receives a board state and a player sign, checks if that player has won */
const checkWin = (boardState, currPlayer) => {
  for (let i = 0; i < winConditions.length; i++) {
    let win = true;
    for (let j = 0; j < winConditions[i].length; j++) {
      if (boardState[winConditions[i][j]] !== currPlayer) {
        win = false;
      };
    }
    if (win === true) {
      return true;
    }
  }
  return false;
}

/* returns a random taunt message from the 'taunts' array */
const getRandomTaunt = () => {
  return taunts[
    Math.floor(Math.random() * taunts.length)];
}

const taunts = [
  'stop crying',
  'HA what now',
  'what up bish',
  'u are a joke',
  'what a scrub',
  'u can go home',
  'u got no chance',
  'damn im SO smart',
  'u should feel bad',
  'thanks for wasting my time',
  'can i play with someone else',
];