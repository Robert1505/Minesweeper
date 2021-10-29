import { CellContent, CELL_TYPE, GAME_STATE, Move } from "../../Types";
import Cell from "../../Cell";

export const renderRow = (
  row: CellContent[],
  rowIndex: number,
  board: CellContent[][],
  bombsRemaining: number,
  moveHistory: Move[],
  cellsRemaining: number,
  gameState: GAME_STATE,
  setBoard: Function,
  setBombsRemaining: Function,
  setMoveHistory: Function,
  setCellsRemaining: Function,
  setGameState: Function,
  floodFillRecursive: Function,
  seconds: number
) => {
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
              second: seconds
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
              second: seconds
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
