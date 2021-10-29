import { dx, dy } from "../../App";
import { CellContent, CELL_TYPE } from "../../Types";

export const floodFillRecursiveHelper = (
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