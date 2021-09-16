import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Cell from './Cell';

export enum CELL_TYPE {
  BOMB = -1,
  EMPTY = 0, 
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}

function App() {
  const [board, setBoard] = useState<CELL_TYPE[][]>([]);
  const [bombsSpawned, setBombsSpawned] = useState<boolean>(false);

  const initialiseBoard = (rows: number, columns: number) => {
    const oldState = [...board];  
    
    for (let i = 0; i < rows; i++) {
       oldState[i] = [];
        for (let j = 0; j < columns; j++) {
            oldState[i][j] = CELL_TYPE.EMPTY;
        }
    }

    setBoard(oldState);
  }

  useEffect(() => {
    initialiseBoard(9, 9)
  }, [])

  useEffect(() => {
    if (board.length > 0) {
      if (bombsSpawned === false) {
        spawnRandomBombs(10);
        setBombsSpawned(true);
        generateNumbers(9,9);
      } 
    }
  }, [board])

  const setBomb = (row: number, column: number) => {
    const oldState = [...board];
    oldState[row][column] = CELL_TYPE.BOMB;
    setBoard(oldState);
  }

  const spawnRandomBombs = (count: number) => {
    for(let i = 0; i < count; i++){
      let x = Math.floor(Math.random() * 9);
      let y = Math.floor(Math.random() * 9);
      setBomb(x,y);
    }
  }

  const countBombsNearby = (x: number, y: number): number => {
    const dx = [-1, -1, -1, 0, 1, 1, 1, 0];
    const dy = [-1, 0, 1, 1, 1, 0, -1, -1];
    let count = 0;

    for (let i = 0; i < 8; i++) {

      // calculam pozitiile de in jurul nostru pe rand
      const newX = x + dx[i];
      const newY = y + dy[i]; 

      // verificam daca pozitia unde cautam bomba se afla in matrice
      if (newX >= 0 && newY >= 0 && newX <= 8 && newY <= 8) {
        // verificam daca am gasit o bomba
        if (board[newX][newY] === CELL_TYPE.BOMB) {
          count++;
        }
      }

    }

    return count;

  }
  
  const generateNumbers = (rows: number, columns: number) => {
    const oldState = [...board];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if(oldState[i][j] === CELL_TYPE.EMPTY) {
          const count = countBombsNearby(i, j);
          if(count === 1) oldState[i][j] = CELL_TYPE.ONE
          else if(count === 2) oldState[i][j] = CELL_TYPE.TWO
          else if(count === 3) oldState[i][j] = CELL_TYPE.THREE
          else if(count === 4) oldState[i][j] = CELL_TYPE.FOUR;
        }
      }
    }

    setBoard(oldState);
  }

  const renderRow = (row: CELL_TYPE[]) => {
    return row.map((cellType: CELL_TYPE) => {
      return <Cell type={cellType}/>
    })
  }

  const renderBoard = () => {
    return board.map((row: CELL_TYPE[]) => {
      return <div className="row">
        {renderRow(row)}
      </div>
    })
  }

  return (
    <div className="App">
      <div>
        {renderBoard()}
       </div>
    </div>
  );
}

export default App;
