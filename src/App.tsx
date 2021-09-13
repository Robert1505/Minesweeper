import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Cell from './Cell';

export enum CELL_TYPE {
  BOMB,
  EMPTY
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
