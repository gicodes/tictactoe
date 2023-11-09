/* Here is the game logic, how to play, win or lose */

// winning board index combinations
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
  
  // receives a board, checks if it's in a stalemate situation //
  const checkStalemate = (boardState) => {
    // checking if board is completely occupied
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === '') {
        return false;
      }
    }
  
    // checking if board has a winner 
    if (checkWin(boardState, 'X') || checkWin(boardState, 'O')) {
      return false;
    } return true;
  }
  
  // receives a board state and a player sign, checks if that player has won
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

module.exports = {
    checkStalemate,
    checkWin,
  };