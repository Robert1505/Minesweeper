import React, { ReactElement, useState } from "react";
import { CELL_TYPE } from "./App";
import "./App.css";
import BombSVG from "./BombSVG";

interface Props {
  type: CELL_TYPE;
}

export default function Cell(props: Props): ReactElement {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const renderIcon = () => {
    if (!isClicked) return;
    if (props.type === CELL_TYPE.BOMB) {
      return <BombSVG />;
    }
    if (props.type !== CELL_TYPE.EMPTY) return <>{props.type}</>;
    return <></>;
  };

  return (
    <div onClick={() => setIsClicked(true)} className="cell"
        style={{
            backgroundColor: isClicked ? "#C7DBE6" : "#9893DA"
        }}
    >

      {renderIcon()}
    </div>
  );
}
