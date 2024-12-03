import { useState } from 'react';
import './App.css';
import { useMemo } from 'react';

function App() {
  const BOARD_SIZE = 3;

  const initialState = useMemo(() => {
    return Array(BOARD_SIZE * BOARD_SIZE).fill(null);
  }, [BOARD_SIZE]);

  const winningPatterns = useMemo(() => {
    const winningPatterns = [];
    // Rows and Columns
    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowPattern = [];
      const colPattern = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        rowPattern.push(row * BOARD_SIZE + col);
        colPattern.push(col * BOARD_SIZE + row);
      }
      winningPatterns.push(rowPattern);
      winningPatterns.push(colPattern);
    }

    // primary diagonal
    const primaryDiagonal = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      primaryDiagonal.push(row * BOARD_SIZE + row);
    }

    // secondary diagonal
    const secondaryDiagonal = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      secondaryDiagonal.push(row * BOARD_SIZE + (BOARD_SIZE - row - 1));
    }
    winningPatterns.push(primaryDiagonal);
    winningPatterns.push(secondaryDiagonal);
    return winningPatterns;
  }, []);

  const [board, setBoard] = useState(initialState);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (board) => {
    for (const pattern of winningPatterns) {
      const [first, ...rest] = pattern;
      if (board[first] && rest.every((idx) => board[idx] === board[first])) {
        setWinner(board[first]);
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner('Draw');
    }
  };

  const handlePlayerMove = (boxIdx) => {
    if (board[boxIdx] || winner) return;
    const newBoard = [...board];
    newBoard[boxIdx] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    checkWinner(newBoard);
  };

  return (
    <div className="game">
      <div className="menu">
        {winner ? (
          <h2>
            {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} wins!`}
          </h2>
        ) : (
          <h2>{!winner && `Player ${isXNext ? 'X' : 'O'} is playing`}</h2>
        )}
        <button
          onClick={() => {
            setBoard(initialState);
            setIsXNext(true);
          }}
        >
          Reset
        </button>
      </div>
      <div className="board" style={{ '--boardWidth': `${BOARD_SIZE * 54}px` }}>
        {board.map((box, boxIdx) => {
          return (
            <div
              key={boxIdx}
              className="cell"
              onClick={handlePlayerMove.bind(this, boxIdx)}
            >
              {box}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
