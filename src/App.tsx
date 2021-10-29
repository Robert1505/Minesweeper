import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import ReplayCursor from "./ReplayCursor";
import BombImage from "./Assets/bomb.png";
import WinnerImage from "./Assets/winner.png";
import { floodFillRecursiveHelper } from "./Helpers/Logic/floodFillRecursiveHelper";
import { renderRow } from "./Helpers/Render/renderRow";
import { delay } from "./Helpers/Logic/delay";
import { replayMoves } from "./Helpers/Logic/replayMoves";
import { CellContent, CELL_TYPE, Coordinate, GAME_STATE, Move } from "./Types";

export const dx = [-1, 0, 1, 0, -1, -1, 1, 1];
export const dy = [0, 1, 0, -1, -1, 1, 1, -1];

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
  const [cursorVisible, setCursorVisible] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [secondsReplay, setSecondsReplay] = useState(0);

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
    timerFunction();
  }, [seconds]);

  useEffect(() => {
    replayTimerFunction();
    setSeconds(secondsReplay);
  }, [secondsReplay]);

  useEffect(() => {
    console.log(moveHistory);
  }, [moveHistory]);

  const timerFunction = async () => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      await delay(1000).then(() => {
        setSeconds(seconds + 1);
      });
    }
  };

  const replayTimerFunction = async () => {
    if (openWinDialog || openLossDialog) return;
    await delay(1000).then(() => {
      setSecondsReplay(secondsReplay + 1);
    });
  };

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

  const renderBoard = () => {
    return board.map((row: CellContent[], index: number) => {
      return (
        <div className="row" key={`row-${index}`}>
          {renderRow(
            row,
            index,
            board,
            bombsRemaining,
            moveHistory,
            cellsRemaining,
            gameState,
            setBoard,
            setBombsRemaining,
            setMoveHistory,
            setCellsRemaining,
            setGameState,
            floodFillRecursive,
            seconds
          )}
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

  const getCoordinates = (
    rowIndex: number,
    columnIndex: number
  ): Coordinate => {
    // [0, 0] = {0, -620}
    // [0, 1] = {70, -620}
    // [0, 2] = {140, -620}
    // [1, 0] = [0, -550]
    // [x, y] = {y * 70, -620 + x * 70}
    return { coordX: columnIndex * 70, coordY: -620 + rowIndex * 70 };
  };

  // MODAL START

  const [openWinDialog, setOpenWinDialog] = React.useState(false);
  const [openLossDialog, setOpenLossDialog] = React.useState(false);

  useEffect(() => {
    if (gameState === GAME_STATE.WIN) handleClickOpenWinDialog();
    if (gameState === GAME_STATE.LOST) handleClickOpenLossDialog();
  }, [gameState]);

  const handleClickOpenWinDialog = async () => {
    await delay(1500).then(() => {
      setOpenWinDialog(true);
    });
  };

  const handleClickOpenLossDialog = async () => {
    await delay(1500).then(() => {
      setOpenLossDialog(true);
    });
  };

  const handleCloseRestart = () => {
    setOpenWinDialog(false);
    setOpenLossDialog(false);
    refreshPage();
  };

  const handleCloseReplay = () => {
    setOpenWinDialog(false);
    setOpenLossDialog(false);
    setSecondsReplay(0);
    replayTimerFunction();
    replayMoves(
      clearBoard,
      setCursorVisible,
      moveHistory,
      setReplayCoordinates,
      getCoordinates,
      handleCellClick,
      handleRightClick,
      handleClickOpenWinDialog,
      handleClickOpenLossDialog,
      gameState
    );
  };

  //MODAL END

  return (
    <div className="App">
      <div>
        <Dialog
          open={openWinDialog}
          onClose={handleCloseRestart}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"💣Congratulations, you won the game!💣"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Congratulations!!!💣💣💣 Now you can play another game by clicking
              Restart Button or watch the replay of the game by clicking Replay
              Button!
              <div className="centerImage">
                <img height="300" width="700" src={WinnerImage} />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRestart}>RESTART</Button>
            <Button onClick={handleCloseReplay}>REPLAY</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={openLossDialog}
          onClose={handleCloseRestart}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"💣Unfortunately, you didn't win this game!💣"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Maybe next time :(💣 Now you can play another game by clicking
              Restart Button or watch the replay of the game by clicking Replay
              Button!
              <div className="centerImage">
                <img src={BombImage} />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRestart}>RESTART</Button>
            <Button onClick={handleCloseReplay}>REPLAY</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="line-up">
        <div className="bombcounter">Bomb Counter: {bombsRemaining}</div>
        <div className="seconds">Time: {seconds} seconds</div>
      </div>
      <div className="board">
        {renderBoard()}
        <ReplayCursor
          coordX={replayCoordinates.coordX}
          coordY={replayCoordinates.coordY}
          isVisible={cursorVisible}
          startX={moveHistory[0]?.positionX ? moveHistory[0].positionX : 0}
          startY={moveHistory[0]?.positionY ? moveHistory[0].positionY : -620}
        />
      </div>
    </div>
  );
}

export default App;
