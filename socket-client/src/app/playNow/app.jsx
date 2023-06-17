'use client' // use client

// import react hooks and libraries
import io from 'socket.io-client'
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Button, ButtonGroup, Alert, Badge } from 'reactstrap';

// imports stylesheet
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// React App component class, is exported to index.js
const TicTacToe = () => {
  const [state, setState] = useState({
    boardState: ['', '', '', '', '', '', '', '', ''],
    sockets: {},
    room: '',
    playerSign: '',
    mySocketId: '',
    currentTurn: 'X',
    status: 'unstarted',
  });

  console.count('rendering')

  // useEffect(() => socketInitializer(), [])

  // const socketInitializer = async () => {
  //   await fetch('/api/playNow/route')
  // };

  useEffect(() => {
    const endpoint = "http://localhost:4000"
    const socket = io(endpoint);

    socket.on('connect', () => {
      console.log('Connected to the server');

      // When a client (any client) connects to the current room, update the room number
      socket.on('connectToRoom', (socketid, roomNo, sockets) => {
        console.log(`${socketid} connected to the game`);
        setState(prevState => {
          return {
            ...prevState,
            room: roomNo,
            mySocketId: socket.id,
            sockets: sockets
          }
        });
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

      return (
        socket.disconnect()
      )
    })

  }, []);

  /* Return a suitable status message depending on the game's state */
  const getStatusMessage = () => {
    if (state.status === "unstarted") {
      return "Waiting for opponent to connect...";
    } else if (state.status === "stalemate") {
      return "It's a stalemate!";
    } else if (state.status === "win") {
      return "You win!";
    } else if (state.status === "lose") {
      return "You lose...";
    } else if (state.currentTurn === state.playerSign) {
      return "It's your turn";
    } else if (state.currentTurn !== state.playerSign) {
      return "Opponent's turn";
    }
  };

  /* Return a suitable color for the alert component depending on the game's state */
  const getStatusColor = () => {
    if (state.status === "unstarted") {
      return 'secondary';
    } else if (state.status === "stalemate") {
      return 'warning';
    } else if (state.status === "win") {
      return 'success';
    } else if (state.status === "lose") {
      return 'dark';
    } else if (state.currentTurn === state.playerSign) {
      return 'primary';
    } else if (state.currentTurn !== state.playerSign) {
      return 'danger';
    }
  };

  // Send game reset request to the server
  const resetGame = () => {
    if (state.status === 'unstarted') {
      showToast("Your opponent is not here!", 2);
    } else {
      showToast("You reset the game!", 2);
      socket.emit('resetGame', state.room);
    }
  };

  // Tell the server to taunt the other opponent
  const tauntOpponent = () => {
    if (state.status === 'unstarted') {
      showToast('Who are you taunting to?', 2);
    } else {
      showToast('You taunted the opponent!', 2);
      socket.emit('tauntOpponent', getOpponentId());
    }
  };

  /* Setter method for playerSign ('X' or 'O') */
  const setPlayerSign = (sign) => {
    setState({ playerSign: sign });
  };

  /* Get opponent's socket.id (assuming only 2 players in each room) */
  const getOpponentId = () => {
    const socketArr = Object.keys(state.sockets);
    if (socketArr.length < 2) return 'none yet :(';
    socketArr.splice(socketArr.indexOf(state.mySocketId), 1);
    return socketArr[0];
  };

  /* Triggered when the player clicks on a cell */
  const makeMove = (cellIndex) => {
    if (state.status === "unstarted") {
      showToast("The game hasn't started yet!", 2);
    } else if (state.status === "win" || state.status === "lose" || state.status === "stalemate") {
      showToast("The game is over!", 2);
    } else if (state.currentTurn !== state.playerSign) {
      showToast("It's not your turn!", 2);
    } else if (state.boardState[cellIndex] !== '') {
      showToast("This spot is taken!", 2);
    } else {
      /* eslint-disable-next-line */
      const boardStateCopy = [...state.boardState];
      boardStateCopy[cellIndex] = state.playerSign;
      const opponentSign = state.playerSign === 'X' ? 'O' : 'X';

      setState(prevState => ({
        ...prevState,
        boardState: boardStateCopy,
        currentTurn: opponentSign,
      }));
      state.socket.emit('makeMove', boardStateCopy, state.room, state.playerSign, opponentSign);
    }
  };

  /* Show toast with message for a number of seconds (react-toastify) */
  const showToast = (toastMessage, seconds) => {
    toast(toastMessage, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: seconds * 1000,
      closeButton: false,
      hideProgressBar: true,
      className: 'toast',
    });
  };

  let toastId = null; // For non-duplicating incoming taunt toasts

  /* Show the incoming taunt toast triggered by the opponent */
  const incomingTauntToast = (toastMessage, seconds) => {
    if (!toast.isActive(toastId)) {
      toastId = toast(toastMessage, {
        position: toast.POSITION.TOP_LEFT,
        autoClose: seconds * 1000,
        closeButton: true,
        hideProgressBar: true,
        className: 'toast__taunt',
      });
    }
  };

  /* 
    React's render method. JSX components provide realtime automatic updates from the state tree upon re-render.

    All components are wrapped with .page-wrapper, which gives it a 100% viewport height
    <Container> component from reactstrap will apply a bootstrap .container, wrapping all child nodes, making it mobile-friendly.
    The TicTacToe game itself is a component, defined by the .tictactoe__container div.
    Within the tictactoe grid, the 9 buttons are aligned with cssgrid, each triggering the makeMove() event when clicked. 
  */

  return (
    <div className="page-wrapper" id="confetti-canvas">
      <Container>
        <div className="tictactoe__container">
          <Alert className="tictactoe__status" color={getStatusColor()}>
            {getStatusMessage()}
          </Alert>
          <div className="tictactoe__grid">
            {[...Array(9)].map((_, index) => (
              <Button
                key={index}
                outline
                color="secondary"
                className="tictactoe__button"
                onClick={() => makeMove(index)}
              >
                {state.boardState[index]}
              </Button>
            ))}
          </div>
          <ButtonGroup className="button-group">
            <Button onClick={() => resetGame()}>Reset Game</Button>
            <Button onClick={() => tauntOpponent()}>Taunt</Button>
          </ButtonGroup>
        </div>
        <div className="tictactoe__infobar">
          <p>
            Playing in: <Badge color="secondary">{state.room}</Badge>
          </p>
          <p>
            You are: <Badge color="secondary">{state.playerSign}</Badge>
          </p>
          <p>
            Opponent: <Badge color="secondary">{getOpponentId()}</Badge>
          </p>
        </div>
        <ToastContainer />
      </Container>
    </div>
  );
}

export default TicTacToe;