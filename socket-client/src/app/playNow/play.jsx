import { useState } from 'react';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Button, ButtonGroup, Alert, Badge } from 'reactstrap';

const Play = () => {
  const [state, setState] = useState({
    boardState: ['', '', '', '', '', '', '', '', ''],
    sockets: {},
    room: '',
    playerSign: '',
    currentTurn: 'X',
    status: 'unstarted',
  });

  const endpoint = "http://localhost:3001/"
  const socket = io(endpoint);

  // Return a suitable status message depending on the game's state
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

  // Return a suitable color for the alert component depending on the game's state
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
      socket.emit('resetGame', state.room);
    }
  };

  // Setter method for playerSign ('X' or 'O')
  const setPlayerSign = (sign) => {
    setState(prevState => ({ ...prevState, playerSign: sign }));
  };

  // Get opponent's socket.id (assuming only 2 players in each room)
  const getOpponentId = () => {
    const socketArr = Object.keys(state.sockets);
    if (socketArr.length < 2) return 'none yet :(';
    socketArr.splice(socketArr.indexOf(state.mySocketId), 1);
    return socketArr[0];
  };

  // Triggered when the player clicks on a cell
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
      const boardStateCopy = [...state.boardState];
      boardStateCopy[cellIndex] = state.playerSign;
      const opponentSign = state.playerSign === 'X' ? 'O' : 'X';

      setState(prevState => ({
        ...prevState,
        boardState: boardStateCopy,
        currentTurn: opponentSign,
      }));
      socket.emit('makeMove', boardStateCopy, state.room, state.playerSign, opponentSign);
    }
  };

  // Show toast with message for a number of seconds (react-toastify)
  const showToast = (toastMessage, seconds) => {
    toast(toastMessage, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: seconds * 1000,
      closeButton: false,
      hideProgressBar: true,
      className: 'toast',
    });
  };

  // Tell the server to taunt the other opponent
  const tauntOpponent = () => {
    if (state.status === 'unstarted') {
      showToast('Who are you taunting to?', 2);
    } else {
      showToast('You taunted the opponent!', 2);
    }
    socket.emit('tauntOpponent', getOpponentId());
  };

  let toastId = null; // For non-duplicating incoming taunt toasts

  // Show the incoming taunt toast triggered by the opponent
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

  // All components are wrapped with .page-wrapper, which gives it a 100% viewport height
  // <Container> component from reactstrap will apply a bootstrap .container, wrapping all child nodes, making it mobile-friendly.
  // Within the tictactoe grid, the 9 buttons are aligned with cssgrid, each triggering the makeMove() event when clicked.

  return (
    <div className="page-wrapper" id="confetti-canvas">
      <Container>
        <div className="tictactoe__container">
          <Alert className="tictactoe__status" color={getStatusColor()}>
            {getStatusMessage()}
          </Alert>
          <div className="tictactoe__grid">
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(0)}>{state.boardState[0]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(1)}>{state.boardState[1]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(2)}>{state.boardState[2]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(3)}>{state.boardState[3]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(4)}>{state.boardState[4]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(5)}>{state.boardState[5]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(6)}>{state.boardState[6]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(7)}>{state.boardState[7]}</Button>{' '}
            <Button outline color="primary" className="tictactoe__button" onClick={() => makeMove(8)}>{state.boardState[8]}</Button>{' '}
          </div>
          <ButtonGroup className="button-group">
            <Button onClick={() => resetGame()}>Reset Game</Button>
            <Button onClick={() => tauntOpponent()}>Taunt</Button>
          </ButtonGroup>
        </div>
        <div className="tictactoe__infobar">
          <p>Playing in: <Badge color="secondary">{state.room}</Badge></p>
          <p>You are: <Badge color="secondary">{state.playerSign}</Badge></p>
          <p>Opponent: <Badge color="secondary">{getOpponentId()}</Badge></p>
        </div>
      </Container>
      <ToastContainer />
    </div>
  )
}

export default Play;