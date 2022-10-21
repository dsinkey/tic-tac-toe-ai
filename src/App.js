import './App.css';
import { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import winningPatterns from './winningPatterns';

import Square from './Components/Square';

const useStyles = createUseStyles({
  board: {
    width: 500,
    height: 500,
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flex: '33%',
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid black',
  },
});

function App() {
  const classes = useStyles();
  const [board, setBoard] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [player, setPlayer] = useState('O');
  const [result, setResult] = useState({ winner: 'none', state: 'none' });
  const aiPlayer = 'O';

  useEffect(() => {
    checkIfWin();
    checkIfTied();

    if (player === 'X') {
      setPlayer('O');
    } else {
      setPlayer('X');
    }
  }, [board]);

  useEffect(() => {
    const emptySquares = getEmptySquares();
    if (player === 'O' && emptySquares.length < 9) {
      const bestMove = minimax(board, 'O');
      chooseSquare(bestMove.index);
    }
  }, [player]);

  useEffect(() => {
    if (result.state !== 'none') {
      alert(`Player: ${result.winner} won`);
      restartGame();
    }
  }, [result]);

  const chooseSquare = (square) => {
    const newBoardValues = board.map((val, index) => {
      if (index === square && typeof val === 'number') {
        return player;
      }

      return val;
    });
    setBoard(newBoardValues);
  };

  const restartGame = () => {
    setBoard([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    setPlayer('O');
  };

  const minimax = (newBoard, player) => {
    const availableSpots = getEmptySquares(newBoard);

    if (getWinForAI(newBoard, player)) {
      return { score: -10 };
    } else if (getWinForAI(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = newBoard[availableSpots[i]];
      newBoard[availableSpots[i]] = player;

      if (player === 'O') {
        const result = minimax(newBoard, 'X');
        move.score = result.score;
      } else {
        const result = minimax(newBoard, 'O');
        move.score = result.score;
      }

      newBoard[availableSpots[i]] = move.index;

      moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  const getWinForAI = (board, player) => {
    const plays = board
      .map((square, index) => {
        if (square === player) {
          return index;
        }
        return null;
      })
      .filter((play) => play !== null);
    let gameWon = null;
    for (let i = 0; i < winningPatterns.length; i++) {
      const currentWinningPatterns = winningPatterns[i];
      const winner = currentWinningPatterns.every(
        (elem) => plays.indexOf(elem) > -1
      );
      if (winner) {
        gameWon = { index: i, player: player };
        break;
      }
    }
    return gameWon;
  };

  const getEmptySquares = () => {
    const emptyIndexesArray = board
      .map((square, index) => {
        if (square !== 'X' && square !== 'O') {
          return index;
        }
        return null;
      })
      .filter((square) => {
        return square !== null;
      });
    return emptyIndexesArray;
  };

  const checkIfWin = () => {
    winningPatterns.forEach((currentPattern) => {
      const firstPlayer = board[currentPattern[0]];
      if (firstPlayer === '') return;
      let foundWinningPattern = true;

      currentPattern.forEach((index) => {
        if (board[index] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: player, state: 'won' });
      }
    });
  };

  const checkIfTied = () => {
    let filled = true;
    board.forEach((square) => {
      if (typeof square === 'number') {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: 'No one', state: 'Tied' });
    }
  };

  return (
    <div className="App">
      <div className={classes.board}>
        <div className={classes.row}>
          <Square
            value={typeof board[0] === 'string' ? board[0] : ''}
            onClick={() => chooseSquare(0)}
          />
          <Square
            value={typeof board[1] === 'string' ? board[1] : ''}
            onClick={() => chooseSquare(1)}
          />
          <Square
            value={typeof board[2] === 'string' ? board[2] : ''}
            onClick={() => chooseSquare(2)}
          />
        </div>
        <div className={classes.row}>
          <Square
            value={typeof board[3] === 'string' ? board[3] : ''}
            onClick={() => chooseSquare(3)}
          />
          <Square
            value={typeof board[4] === 'string' ? board[4] : ''}
            onClick={() => chooseSquare(4)}
          />
          <Square
            value={typeof board[5] === 'string' ? board[5] : ''}
            onClick={() => chooseSquare(5)}
          />
        </div>
        <div className={classes.row}>
          <Square
            value={typeof board[6] === 'string' ? board[6] : ''}
            onClick={() => chooseSquare(6)}
          />
          <Square
            value={typeof board[7] === 'string' ? board[7] : ''}
            onClick={() => chooseSquare(7)}
          />
          <Square
            value={typeof board[8] === 'string' ? board[8] : ''}
            onClick={() => chooseSquare(8)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
