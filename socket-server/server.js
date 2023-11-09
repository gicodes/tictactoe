const express = require('express');
const http = require('http');
const app = express();

/* instantiating app with http */
const socket = require('socket.io');

const server = http.createServer(app);
const port = process.env.PORT || 4000;
const client = 'http://localhost:3003';

const io = socket(server, {
  cors: {
    origin: client,
    credentials: true,
  },
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/* initial socket room number */
let roomNum = 1;

/* returns a random taunt message from the 'taunts' array */
const getRandomTaunt = () => {
  return taunts[
    Math.floor(Math.random() * taunts.length)];
}

const taunts = [
  'stop crying!',
  'Ha! what now?',
  'whats up bish?',
  'you are a joke!',
  'what scrub you are!',
  'you can go home now!',
  'you got no chance!',
  'damn I am so smart!',
  'you should feel bad!',
  'thanks for wasting my time!',
  'can i play with someone else!?',
];

// importing and using my controllers
const gameController = require('./controller/gameController')
const socketController = require('.controller/socketController');

// Use the game controller by passing the required parameters
io.on('connection', (socket) => {
  gameController.makeMove(io, boardState, room, currPlayer, nextPlayer);
  gameController.resetGame(io, socket, room);
});

// Use the socket controller by passing the required parameters
socketController(io, roomNum, getRandomTaunt);