
import { useState, useEffect } from "react";
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
  // Game states
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);

  // Scoreboard
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  // Timer states
  const [selectedTime, setSelectedTime] = useState(2);
  const [customTime, setCustomTime] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);

  // Check for winner
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

  const isDraw =
    !winner && board.every((square) => square !== "");

  // Countdown timer
  useEffect(() => {
    if (!gameStarted || winner || isDraw || timeLeft === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, winner, isDraw, timeLeft]);

  // Stop game when it ends
  useEffect(() => {
    if (winner || isDraw || timeLeft === 0) {
      setGameStarted(false);
    }
  }, [winner, isDraw, timeLeft]);

  // Format timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Select preset time
  function chooseTime(minute) {
    setSelectedTime(minute);
    setCustomTime("");
    setTimeLeft(minute * 60);
  }

  // Set custom time
  function setCustomGameTime() {
    const minutes = Number(customTime);

    if (
      customTime.trim() === "" ||
      !Number.isInteger(minutes) ||
      minutes < 1 ||
      minutes > 60
    ) {
      alert("Please enter a whole number between 1 and 60 minutes.");
      return;
    }

    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
  }

  // Handle square clicks
  function handleClick(index) {
    if (
      board[index] !== "" ||
      winner ||
      isDraw ||
      timeLeft === 0
    ) {
      return;
    }

    setGameStarted(true);

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

  // Restart game
  function restartGame() {
    setBoard(Array(9).fill(""));
    setIsXTurn(true);
    setTimeLeft(selectedTime * 60);
    setGameStarted(false);
  }

  // Reset scores
  function resetScores() {
    setScores({
      X: 0,
      O: 0,
      draws: 0,
    });

    restartGame();
  }

  // Main JSX
  return (
    <div className="game">

      <h1>Tic-Tac-Toe</h1>

      {/* Time Settings */}
      <div className="time-settings">
        <h3>Choose Game Time</h3>

        <div className="time-options">
          {[1, 2, 3, 5].map((minute) => (
            <button
              key={minute}
              className={
                selectedTime === minute && !customTime
                  ? "active-time"
                  : ""
              }
              onClick={() => chooseTime(minute)}
              disabled={gameStarted}
            >
              {minute} Min
            </button>
          ))}
        </div>

        <div className="custom-time">
          <input
            type="number"
            min="1"
            max="60"
            placeholder="Custom minutes (1-60)"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            disabled={gameStarted}
          />

          <button
            onClick={setCustomGameTime}
            disabled={gameStarted}
          >
            Set Time
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="scoreboard">
        <p>Player X: {scores.X}</p>
        <p>Draws: {scores.draws}</p>
        <p>Player O: {scores.O}</p>
      </div>

      {/* Timer */}
      <div className="timer">
        <h3>Time Left</h3>
        <h2>{formattedTime}</h2>
      </div>

      {/* Game Status */}
      <h2>
        {winner
          ? `Player ${winner} wins!`
          : isDraw
          ? "It's a draw!"
          : timeLeft === 0
          ? "Time's up!"
          : `Player ${isXTurn ? "X" : "O"}'s turn`}
      </h2>

      {/* Game Board */}
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

      {/* Game Buttons */}
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
