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
    second: number;
  };
  
  export type Coordinate = {
    coordX: number;
    coordY: number;
  };
  