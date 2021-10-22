import React, { PureComponent, ReactElement, useEffect, useState } from "react";
import { Animate } from "react-move";
import { easeExpOut } from "d3-ease";

interface Props {
  coordX: number;
  coordY: number;
  isVisible: boolean;
  startX: number;
  startY: number;
}

export default function ReplayCursor(props: Props): ReactElement {
  useEffect(() => {}, [props.startX, props.startY]);

  return (
    <div>
      <Animate
        start={() => ({
          x: props.startX,
          y: props.startY,
        })}
        update={{
          x: [props.coordX],
          y: [props.coordY],
          timing: { duration: 400, ease: easeExpOut },
        }}
      >
        {(state) => {
          const { x, y } = state;

          return (
            <div>
              <div
                style={{
                  position: "absolute",
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  opacity: 0.3,
                  backgroundColor: "white",
                  WebkitTransform: `translate3d(${x}px, ${y}px, 0)`,
                  transform: `translate3d(${x}px, ${y}px, 0)`,
                  visibility: props.isVisible ? "visible" : "hidden",
                }}
              />
            </div>
          );
        }}
      </Animate>
    </div>
  );
}
