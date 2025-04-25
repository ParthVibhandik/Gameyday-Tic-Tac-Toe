import { useState, useRef } from 'react';
import './App.css';
import clickSound from './assets/click.mp3';
import winSound from './assets/win.mp3';
import restartIcon from './assets/restart.png';
import closeIcon from './assets/close.png';
import muteIcon from './assets/mute.png';
import unmuteIcon from './assets/unmute.png';
import fullscreenIcon from './assets/fullscreen.png';
import exitFullscreenIcon from './assets/exit-fullscreen.png';

function App() {
  const [gameMode, setGameMode] = useState(null); // null, 'single', or 'two'
  const [board, setBoard] = useState(Array(49).fill(null)); // 7x7 grid
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const appRef = useRef(null);

  const playAudio = (audioFile) => {
    if (!isMuted) {
      const audio = new Audio(audioFile);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  const handleMenuClick = (mode) => {
    playAudio(clickSound);
    setGameMode(mode);
    resetGame();
  };

  const resetGame = () => {
    playAudio(clickSound);
    setBoard(Array(49).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const handleCellClick = (index) => {
    if (board[index] || winner) return;

    playAudio(clickSound);

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      playAudio(winSound); // Play the win sound for the winner
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
    }
  };

  const toggleMute = () => {
    playAudio(clickSound);
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    playAudio(clickSound);
    if (!document.fullscreenElement) {
      appRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const calculateWinner = (board) => {
    const lines = generateWinningLines();
    for (let line of lines) {
      const [a, b, c, d] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
        return board[a];
      }
    }
    return null;
  };

  const generateWinningLines = () => {
    const lines = [];
    const size = 7;

    // Horizontal lines
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 4; col++) {
        lines.push([row * size + col, row * size + col + 1, row * size + col + 2, row * size + col + 3]);
      }
    }

    // Vertical lines
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 4; row++) {
        lines.push([row * size + col, (row + 1) * size + col, (row + 2) * size + col, (row + 3) * size + col]);
      }
    }

    // Diagonal lines (top-left to bottom-right)
    for (let row = 0; row <= size - 4; row++) {
      for (let col = 0; col <= size - 4; col++) {
        lines.push([
          row * size + col,
          (row + 1) * size + col + 1,
          (row + 2) * size + col + 2,
          (row + 3) * size + col + 3,
        ]);
      }
    }

    // Diagonal lines (top-right to bottom-left)
    for (let row = 0; row <= size - 4; row++) {
      for (let col = 3; col < size; col++) {
        lines.push([
          row * size + col,
          (row + 1) * size + col - 1,
          (row + 2) * size + col - 2,
          (row + 3) * size + col - 3,
        ]);
      }
    }

    return lines;
  };

  const renderMenu = () => (
    <div className="menu">
      <h1>Tic Tac Toe</h1>
      <button onClick={() => handleMenuClick('single')}>Single Player</button>
      <button onClick={() => handleMenuClick('two')}>Two Player</button>
    </div>
  );

  const renderGame = () => (
    <div className="game">
      <h1>{winner ? (winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`) : `Next Turn: ${isXNext ? 'X' : 'O'}`}</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell ? 'disabled' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={resetGame}>
          <img src={restartIcon} alt="Restart" />
        </button>
        <button onClick={() => setGameMode(null)}>
          <img src={closeIcon} alt="Close" />
        </button>
        <button onClick={toggleMute}>
          <img src={isMuted ? unmuteIcon : muteIcon} alt="Mute/Unmute" />
        </button>
        <button onClick={toggleFullScreen}>
          <img src={isFullscreen ? exitFullscreenIcon : fullscreenIcon} alt="Fullscreen" />
        </button>
      </div>
    </div>
  );

  return <div className="app" ref={appRef}>{gameMode ? renderGame() : renderMenu()}</div>;
}

export default App;
