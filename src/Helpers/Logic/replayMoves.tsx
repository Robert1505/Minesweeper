import { GAME_STATE, Move } from "../../Types";
import { delay } from "./delay";

export const replayMoves = async (
  clearBoard: Function,
  setCursorVisible: Function,
  moveHistory: Move[],
  setReplayCoordinates: Function,
  getCoordinates: Function,
  handleCellClick: Function,
  handleRightClick: Function,
  handleClickOpenWinDialog: Function,
  handleClickOpenLossDialog: Function,
  gameState: GAME_STATE
) => {
  clearBoard();
  setCursorVisible(true);

  for (let i = 0; i < moveHistory.length; i++) {
    let secondsToWait: number = 0;
    if(i === 0) secondsToWait = moveHistory[0].second
    else secondsToWait = moveHistory[i].second - moveHistory[i - 1].second;
    await delay(secondsToWait * 1000).then(() => {
      if (moveHistory[i].isLeftClick) {
        setReplayCoordinates(
          getCoordinates(moveHistory[i].positionX, moveHistory[i].positionY)
        );
        handleCellClick(moveHistory[i].positionX, moveHistory[i].positionY);
      } else {
        setReplayCoordinates(
          getCoordinates(moveHistory[i].positionX, moveHistory[i].positionY)
        );
        handleRightClick(moveHistory[i].positionX, moveHistory[i].positionY);
      }
    });
  }

  if (gameState === GAME_STATE.WIN) handleClickOpenWinDialog();
  if (gameState === GAME_STATE.LOST) handleClickOpenLossDialog();
};
