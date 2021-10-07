import React, { ReactElement, useState } from "react";
import { CELL_TYPE } from "./App";
import "./App.css";
import BombSVG from "./BombSVG";

interface Props {
  type: CELL_TYPE;
  isClicked: boolean;
  setIsClicked: Function;
}

export default function Cell(props: Props): ReactElement {
  const renderIcon = () => {
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
      className="cell"
      style={{
        backgroundColor: props.isClicked ? "#888888" : "#1E1014",
        color: "whitesmoke"
      }}
    >
      {renderIcon()}
    </div>
  );
}
