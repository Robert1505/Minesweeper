import React from 'react';
import logo from './logo.svg';
import './App.css';
import Cell from './Cell';

function App() {


  const renderRow = (columns: number) => {
    return new Array(columns).fill(0).map(() => {
      return <Cell />
    })
  }

  const renderBoard = (rows: number, columns: number) => {
    return new Array(rows).fill(0).map(() => {
      return <div className="row">
        {renderRow(columns)}
      </div>
    })
  }

  return (
    <div className="App">
      <div>
        {renderBoard(9, 9)}
       </div>
    </div>
  );
}

export default App;
