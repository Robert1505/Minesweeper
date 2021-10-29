import React, { ReactElement, useState } from "react";
import { CELL_TYPE, GAME_STATE } from "./Types";
import "./App.css";
import BombSVG from "./BombSVG";
import FlagSVG from "./FlagSVG";

interface Props {
  type: CELL_TYPE;
  isClicked: boolean;
  setIsClicked: Function;
  isFlagged: boolean;
  setIsFlagged: Function;
  setGameState: Function;
  gameState: GAME_STATE;
}

export default function Cell(props: Props): ReactElement {
  const renderIcon = () => {
    if (props.isFlagged) return <FlagSVG />;
    if (!props.isClicked) return;
    if (props.type === CELL_TYPE.BOMB) {
      return <BombSVG />;
    }

    if (props.type !== CELL_TYPE.EMPTY) return <>{props.type}</>;
    return <></>;
  };

  const handleClick = () => {
    if(props.gameState !== GAME_STATE.IN_PROGRESS) return;
    if (props.isFlagged) return;
    if (props.type === CELL_TYPE.BOMB) {
      props.setGameState(GAME_STATE.LOST)
    }
    props.setIsClicked();
  }

  return (
    <div
      onClick={() => handleClick()}
      onContextMenu={(e) => {
        e.preventDefault();
        if(!props.isClicked) props.setIsFlagged(true);
        if(props.isFlagged) props.setIsFlagged(false);
      }}
      className="cell"
      style={{
        backgroundColor: props.isClicked ? "#00b4d8" : "#03045e",
        color: "whitesmoke",
      }}
    >
      {renderIcon()}
    </div>
  );
}
