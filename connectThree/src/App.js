import { useState } from 'react';

function Square({ value , onSquareClick, isWinningSquare }) {
  let className;
  if (!isWinningSquare){
    className = "square"
  }
  else {
    className = "winner-square"
  }
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares)?.winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winningInfo = calculateWinner(squares);
  const winner = winningInfo?.winner;
  const line = winningInfo?.line; 
  let status;
  const isDraw = !winner && squares.every(square => square !== null);

if (winner) {
  status = 'Winner: ' + winner;
} else if (isDraw) {
  status = 'Draw!';
} else {
  status = 'Next player: ' + (xIsNext ? 'X' : 'O');
}

  const finalBoard = [];


for (let j = 0; j < 3; j++) {
  const row = [];

  for (let i = 0; i < 3; i++) {
    const isWinningSquare = line?.includes(j * 3 + i);
    row.push(
      <Square
        value={squares[j * 3 + i]}
        onSquareClick={() => handleClick(j * 3 + i)}
        isWinningSquare={isWinningSquare}
      />
    );
  }

  finalBoard.push(
    <div className="board-row" key={j}>
      {row}
    </div>
  );
}

return (
  <>
    <div className="status">{status}</div>
    {finalBoard}
  </>
);

};

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo (nextMove){
    setCurrentMove(nextMove)
  }

  function calculateCoords(move){
    const row = Math.floor((move-1)/3);
    const column = (move-1)%3;
    if (move === 0){ return " ";}
    return " Coords: ("+row+","+column+")"
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #" + move + calculateCoords(move);
    } else if (move > 0){
        description = 'Go to move #' + move + calculateCoords(move);
    }
    else {
      description = 'Go to game start';
    }
    if (move !== currentMove){
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    ) }
    return (
      <li key={move}> {description} </li>
    )

  })

  const invertedMoves = moves.toReversed();
  const [isHistoryInverted, setIsHistoryInverted] = useState(false);

  function handleInvert (list){
    setIsHistoryInverted(!isHistoryInverted);
  }

  const moveFinal = isHistoryInverted ? invertedMoves : moves;

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
      <InvertButton onInvertClick={handleInvert}/>
        <ol> {moveFinal} </ol>
      </div>
    </div>
  );
}

function InvertButton({ onInvertClick }) {
  return (
    <button onClick={onInvertClick}>
      Invert
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

