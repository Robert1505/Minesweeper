import React, { ReactElement } from "react";
import { CELL_TYPE } from "./App";
import "./App.css";
import BombSVG from "./BombSVG";

interface Props {
  type: CELL_TYPE;
}

export default function Cell(props: Props): ReactElement {
  const renderIcon = () => {
    if (props.type === CELL_TYPE.BOMB) {
      return <BombSVG />;
    }
    if (props.type !== CELL_TYPE.EMPTY) return <>{props.type}</>;
    return <></>;
  };

  return <div className="cell">{renderIcon()}</div>;
}
