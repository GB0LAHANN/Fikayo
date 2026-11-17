
import { useState } from "react";
import "./App.css";

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  function calculateWinner(squares) {
    for (let line of winningLines) {
      const [a, b, c] = line;

      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  }

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((square) => square !== "");

  function handleClick(index) {
    if (board[index] !== "" || winner || isDraw) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";

    const newWinner = calculateWinner(newBoard);
    const newDraw =
      !newWinner && newBoard.every((square) => square !== "");

    if (newWinner) {
      setScores((previous) => ({
        ...previous,
        [newWinner]: previous[newWinner] + 1,
      }));
    } else if (newDraw) {
      setScores((previous) => ({
        ...previous,
        draws: previous.draws + 1,
      }));
    }

    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  }

  function restartGame() {
    setBoard(Array(9).fill(""));
    setIsXTurn(true);
  }

  function resetScores() {
    setScores({ X: 0, O: 0, draws: 0 });
    restartGame();
  }

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>

      <div className="scoreboard">
        <p>Player X: {scores.X}</p>
        <p>Draws: {scores.draws}</p>
        <p>Player O: {scores.O}</p>
      </div>

      <h2>
        {winner
          ? `Player ${winner} wins!`
          : isDraw
          ? "It's a draw!"
          : `Player ${isXTurn ? "X" : "O"}'s turn`}
      </h2>

      <div className="board">
        {board.map((square, index) => {
          const isWinningSquare =
            winner &&
            winningLines.some(
              (line) =>
                line.includes(index) &&
                line.every((i) => board[i] === winner)
            );

          return (
            <button
              className={`square ${
                isWinningSquare ? "winning-square" : ""
              }`}
              key={index}
              onClick={() => handleClick(index)}
            >
              {square}
            </button>
          );
        })}
      </div>
        
      <button className="restart" onClick={restartGame}>
        Restart Game
      </button>

      <button className="restart" onClick={resetScores}>
        Reset Scores
      </button>
    </div>
  );
}

export default App;
