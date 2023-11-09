/* Here is your game controller logic */

const { checkStalemate, checkWin } = require('../models/game')

// a player made a move, checks if it is a winning/ stalemate situation, emits the updated board to all users in room
function makeMove(boardState, room, currPlayer, nextPlayer) {
    if (checkWin(boardState, currPlayer)) {
      io.sockets.in(room).emit('gameWin', currPlayer);
    }
    if (checkStalemate(boardState)) {
      io.sockets.in(room).emit('stalemate');
    }
    io.sockets.in(room).emit('updateBoard', boardState, nextPlayer);
  }

// a player resets the game
function resetGame(room) {
    console.log(`${socket.id} reset the game in ${room}!`);
    io.sockets.in(room).emit('resetGame');
  }

  module.exports = {
    makeMove,
    resetGame
  }