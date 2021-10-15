import React, { ReactElement, useState } from "react";
import { CELL_TYPE } from "./App";
import "./App.css";
import BombSVG from "./BombSVG";
import FlagSVG from "./FlagSVG";

interface Props {
  type: CELL_TYPE;
  isClicked: boolean;
  setIsClicked: Function;
  isFlagged: boolean;
  setIsFlagged: Function;
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

  return (
    <div
      onClick={() => props.setIsClicked()}
      onContextMenu={(e) => {
        e.preventDefault();
        props.setIsFlagged();
      }}
      className="cell"
      style={{
        backgroundColor: props.isClicked ? "#888888" : "#1E1014",
        color: "whitesmoke",
      }}
    >
      {renderIcon()}
    </div>
  );
}
