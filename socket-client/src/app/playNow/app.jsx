'use client'

// library imports
import Play from './play';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

// stylesheet imports
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// React App component class, is exported to index.js
const App = () => {
  const endpoint = "http://localhost:3001/"

  const [state, setState] = useState({
    boardState: ['', '', '', '', '', '', '', '', ''],
    sockets: {},
    room: '',
    playerSign: '',
    currentTurn: 'X',
    status: 'unstarted',
  });

  console.log('rendering')
  console.count('rendering')

  useEffect(() => {
    const socket = io(endpoint);
    socket.on('connect', () => {
      console.log('Connected to the server');
      // When a client (any client) connects to the current room, update the room number
      socket.on('connectToRoom', (socketid, roomNo, sockets) => {
        console.log(`${socketid} connected to the game`);
        setState((prevState) => ({
          ...prevState,
          room: roomNo,
          mySocketId: socket.id,
          sockets: sockets,
        }));
      });

      // When a player has disconnected from the room
      socket.on('userLeft', (leavingSocketId) => {
        showToast('Your opponent left the game...', 3);
        resetGame();
      });

      // Update state accordingly when server assigns a playerSign to the client
      socket.on('playerSign', (playerSign) => {
        console.log('Received playerSign from server: ', playerSign);
        setPlayerSign(playerSign);
      });

      // Update game status to 'started' when server emits startGame event
      socket.on('startGame', () => {
        console.log('Game has started');
        setState((prevState) => ({ ...prevState, status: 'started' }));
      });

      // Update state.boardState when server emits a new boardState
      socket.on('updateBoard', (newBoardState, currentPlayer) => {
        setState((prevState) => ({
          ...prevState,
          boardState: newBoardState,
          currentTurn: currentPlayer,
        }));
      });

      // Server announces a winner, update state.status accordingly
      socket.on('gameWin', (winningPlayer) => {
        console.log(`${winningPlayer} is the winner!`);
        let outcome;
        if (winningPlayer === state.playerSign) {
          outcome = 'win';
        } else {
          outcome = 'lose';
        }
        setState((prevState) => ({ ...prevState, status: outcome }));
      });

      // Server announces stalemate, update state.status accordingly
      socket.on('stalemate', () => {
        console.log('Stalemate!');
        setState((prevState) => ({ ...prevState, status: 'stalemate' }));
      })

      // Reset game state when the server emits a resetGame event
      socket.on('resetGame', () => {
        resetGame();
        showToast('The game has been reset!', 2);
      });

      socket.on('incomingTaunt', (message) => {
        incomingTauntToast(message, 3);
      });
    });

    /* Clean up the socket connection when the component is unmounted */
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Play />
  )
}

export default App;