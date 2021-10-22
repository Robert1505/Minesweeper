import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Cell from "./Cell";
import ReplayCursor from "./ReplayCursor";

export enum CELL_TYPE {
  BOMB = -1,
  EMPTY = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
}

export enum GAME_STATE {
  IN_PROGRESS,
  WIN,
  LOST,
}

export interface CellContent {
  type: CELL_TYPE;
  isClicked: boolean;
  visited: boolean;
  isFlagged: boolean;
}

export type Move = {
  positionX: number;
  positionY: number;
  isLeftClick: boolean;
};

export type Coordinate = {
  coordX: number;
  coordY: number;
};

const dx = [-1, 0, 1, 0, -1, -1, 1, 1];
const dy = [0, 1, 0, -1, -1, 1, 1, -1];

const INITIAL_BOMBS: number = 20;

function App() {
  const [board, setBoard] = useState<CellContent[][]>([]);
  const [bombsSpawned, setBombsSpawned] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GAME_STATE>(
    GAME_STATE.IN_PROGRESS
  );
  const [bombsRemaining, setBombsRemaining] = useState(INITIAL_BOMBS);
  const [cellsRemaining, setCellsRemaining] = useState(81);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [replayCoordinates, setReplayCoordinates] = useState<Coordinate>({
    coordX: 0,
    coordY: -620,
  });
  const [cursorVisible, setCursorVisible] = useState(false)

  const initialiseBoard = (rows: number, columns: number) => {
    const oldState = [...board];

    for (let i = 0; i < rows; i++) {
      oldState[i] = [];
      for (let j = 0; j < columns; j++) {
        oldState[i][j] = {
          type: CELL_TYPE.EMPTY,
          isClicked: false,
          visited: false,
          isFlagged: false,
        };
      }
    }

    setBoard(oldState);
  };

  useEffect(() => {
    initialiseBoard(9, 9);
  }, []);

  useEffect(() => {
    console.log("moveHistory", moveHistory);
  }, [moveHistory]);

  useEffect(() => {
    if (cellsRemaining === INITIAL_BOMBS) setGameState(GAME_STATE.WIN);
  }, [cellsRemaining]);

  useEffect(() => {
    if (board.length > 0) {
      if (bombsSpawned === false) {
        spawnRandomBombs(INITIAL_BOMBS);
        setBombsSpawned(true);
        generateNumbers(9, 9);
      }
    }
  }, [board]);

  const setBomb = (row: number, column: number) => {
    const oldState = [...board];
    oldState[row][column].type = CELL_TYPE.BOMB;
    setBoard(oldState);
  };

  const spawnRandomBombs = (count: number) => {
    for (let i = 0; i < count; i++) {
      let x = Math.floor(Math.random() * 9);
      let y = Math.floor(Math.random() * 9);
      setBomb(x, y);
    }
  };

  const generateNumbers = (rows: number, columns: number) => {
    const oldState = [...board];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (oldState[i][j].type === CELL_TYPE.EMPTY) {
          const count = countBombsNearby(i, j);
          if (count === 1) oldState[i][j].type = CELL_TYPE.ONE;
          else if (count === 2) oldState[i][j].type = CELL_TYPE.TWO;
          else if (count === 3) oldState[i][j].type = CELL_TYPE.THREE;
          else if (count === 4) oldState[i][j].type = CELL_TYPE.FOUR;
        }
      }
    }

    setBoard(oldState);
  };

  const countBombsNearby = (x: number, y: number): number => {
    let count = 0;

    for (let i = 0; i < 8; i++) {
      // calculam pozitiile din jurul nostru pe rand
      const newX = x + dx[i];
      const newY = y + dy[i];

      // verificam daca pozitia unde cautam bomba se afla in matrice
      if (newX >= 0 && newY >= 0 && newX <= 8 && newY <= 8) {
        // verificam daca am gasit o bomba
        if (board[newX][newY].type === CELL_TYPE.BOMB) {
          count++;
        }
      }
    }

    return count;
  };

  const floodFillRecursive = (i: number, j: number) => {
    const squares = [...board];

    const discorveredCells = floodFillRecursiveHelper(squares, i, j);
    setCellsRemaining(cellsRemaining - discorveredCells);
    setBoard(squares);
  };

  const floodFillRecursiveHelper = (
    squares: CellContent[][],
    i: number,
    j: number
  ): number => {
    // check out of bounds
    if (i < 0 || i > 8) return 0;
    if (j < 0 || j > 8) return 0;
    // check if it's visited
    if (squares[i][j].visited) return 0;
    // Indicate node has been visited
    squares[i][j].visited = true;
    squares[i][j].isClicked = true;

    if (squares[i][j].type !== CELL_TYPE.EMPTY) {
      squares[i][j].isClicked = true;
      return 1;
    }
    let sum = 0;
    for (let a = 0; a < 4; a++) {
      sum += floodFillRecursiveHelper(squares, i + dx[a], j + dy[a]);
    }
    return sum + 1;
  };

  const renderRow = (row: CellContent[], rowIndex: number) => {
    return row.map((cellContent: CellContent, columnIndex: number) => {
      return (
        <Cell
          key={`cell-${rowIndex}-${columnIndex}`}
          type={cellContent.type}
          isClicked={cellContent.isClicked}
          isFlagged={cellContent.isFlagged}
          setIsFlagged={(flagged: boolean) => {
            const oldBoard = [...board];
            oldBoard[rowIndex][columnIndex].isFlagged = flagged;
            if (flagged) setBombsRemaining(bombsRemaining - 1);
            else setBombsRemaining(bombsRemaining + 1);
            setBoard(oldBoard);
            setMoveHistory([
              ...moveHistory,
              {
                positionX: rowIndex,
                positionY: columnIndex,
                isLeftClick: false,
              },
            ]);
          }}
          setIsClicked={() => {
            const oldBoard = [...board];

            oldBoard[rowIndex][columnIndex].isClicked = true;

            setCellsRemaining(cellsRemaining - 1);

            setBoard(oldBoard);

            setMoveHistory([
              ...moveHistory,
              {
                positionX: rowIndex,
                positionY: columnIndex,
                isLeftClick: true,
              },
            ]);

            if (board[rowIndex][columnIndex].type === CELL_TYPE.EMPTY) {
              floodFillRecursive(rowIndex, columnIndex);
            }
          }}
          setGameState={setGameState}
          gameState={gameState}
        />
      );
    });
  };

  const renderBoard = () => {
    return board.map((row: CellContent[], index: number) => {
      return (
        <div className="row" key={`row-${index}`}>
          {renderRow(row, index)}
        </div>
      );
    });
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const clearBoard = () => {
    const oldBoard = [...board];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        oldBoard[i][j].isClicked = false;
        oldBoard[i][j].visited = false;
        oldBoard[i][j].isFlagged = false;
      }
    }

    setBoard(oldBoard);
  };

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    const oldBoard = [...board];

    oldBoard[rowIndex][columnIndex].isClicked = true;

    setCellsRemaining(cellsRemaining - 1);

    setBoard(oldBoard);

    if (board[rowIndex][columnIndex].type === CELL_TYPE.EMPTY) {
      floodFillRecursive(rowIndex, columnIndex);
    }
  };

  const handleRightClick = (rowIndex: number, columnIndex: number) => {
    const oldBoard = [...board];

    oldBoard[rowIndex][columnIndex].isFlagged =
      !oldBoard[rowIndex][columnIndex].isFlagged;

    setBoard(oldBoard);
  };

  function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const getCoordinates = (rowIndex: number, columnIndex: number): Coordinate => {
    // [0, 0] = {0, -620}
    // [0, 1] = {70, -620}
    // [0, 2] = {140, -620}
    // [1, 0] = [0, -550]
    // [x, y] = {y * 70, -620 + x * 70}
    return {coordX: columnIndex * 70, coordY: -620 + rowIndex * 70}
  }

  const replayMoves = async () => {
    clearBoard();
    setCursorVisible(true)

    for (let i = 0; i < moveHistory.length; i++) {
      await delay(1000).then(() => {
        if (moveHistory[i].isLeftClick) {
          setReplayCoordinates(getCoordinates(moveHistory[i].positionX, moveHistory[i].positionY))
          handleCellClick(moveHistory[i].positionX, moveHistory[i].positionY);
        }
        else{
          setReplayCoordinates(getCoordinates(moveHistory[i].positionX, moveHistory[i].positionY))
          handleRightClick(moveHistory[i].positionX, moveHistory[i].positionY);
        }
      });
    }
  };

  return (
    <div className="App">
      <div className="bombcounter">Bomb Counter: {bombsRemaining}</div>
      <div className="board">
        {renderBoard()}
        <ReplayCursor
          coordX={replayCoordinates.coordX}
          coordY={replayCoordinates.coordY}
          isVisible = {cursorVisible}
          startX = {moveHistory[0]?.positionX ? moveHistory[0].positionX : 0}
          startY = {moveHistory[0]?.positionY ? moveHistory[0].positionY : -620}
        />
      </div>
      <div className="buttons">
        <button
          className="restartButton"
          onClick={refreshPage}
          style={{
            visibility:
              gameState !== GAME_STATE.IN_PROGRESS ? "visible" : "hidden",
          }}
        >
          Restart
        </button>
        <button
          className="replayButton"
          onClick={() => replayMoves()}
          style={{
            visibility:
              gameState !== GAME_STATE.IN_PROGRESS ? "visible" : "hidden",
          }}
        >
          Replay
        </button>
      </div>
    </div>
  );
}

export default App;
