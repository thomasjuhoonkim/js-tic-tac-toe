// constants and global variables
const ROW_COUNT = 3;
const COL_COUNT = 3;
var globalPlayer = null;

// slot factory
const slotFactory = (num) => {
  const element = document.getElementById(String(num));
  const addPlayerMark = (e) => {
    if (!globalPlayer) return;
    e.target.innerText = globalPlayer.player;
    removeEvent(e);
    switchPlayer();
    board.check();
  };
  const removeEvent = (e) => {
    e.target.removeEventListener("click", addPlayerMark);
    e.target.style.cursor = "default";
  };
  const removeEventEndGame = () => {
    element.removeEventListener("click", addPlayerMark);
    element.style.cursor = "default";
  };
  element.addEventListener("click", addPlayerMark);
  return { num, element, removeEventEndGame };
};

// board factory
const boardFactory = () => {
  // make board
  let boardArray = [];
  for (let i = 0; i < ROW_COUNT; i++) {
    row = [];
    for (let j = 0; j < COL_COUNT; j++) {
      row.push(slotFactory(ROW_COUNT * i + j));
    }
    boardArray.push(row);
  }

  // check board items and return winning slots
  const checkBoard = () => {
    // check row and col
    for (let i = 0; i < ROW_COUNT; i++) {
      row = [boardArray[i][0], boardArray[i][1], boardArray[i][2]];
      col = [boardArray[0][i], boardArray[1][i], boardArray[2][i]];
      if (row.every((slot) => slot.element.innerText === "X")) return row;
      if (row.every((slot) => slot.element.innerText === "O")) return row;
      if (col.every((slot) => slot.element.innerText === "X")) return col;
      if (col.every((slot) => slot.element.innerText === "O")) return col;
    }
    // check diagonal
    diagonalLeft = [boardArray[0][0], boardArray[1][1], boardArray[2][2]];
    diagonalRight = [boardArray[2][0], boardArray[1][1], boardArray[0][2]];
    if (diagonalLeft.every((slot) => slot.element.innerText === "X"))
      return diagonalLeft;
    if (diagonalLeft.every((slot) => slot.element.innerText === "O"))
      return diagonalLeft;
    if (diagonalRight.every((slot) => slot.element.innerText === "X"))
      return diagonalRight;
    if (diagonalRight.every((slot) => slot.element.innerText === "O"))
      return diagonalRight;

    checkTie = [];
    for (let i = 0; i < ROW_COUNT; i++) {
      for (let j = 0; j < COL_COUNT; j++) {
        checkTie.push(boardArray[i][j]);
      }
    }
    if (
      checkTie.every(
        (slot) =>
          slot.element.innerText === "X" || slot.element.innerText === "O"
      )
    )
      return checkTie;
    // nothing checks out
    return [];
  };
  const endGame = () => {
    boardArray.forEach((row) => {
      row.forEach((slot) => slot.removeEventEndGame());
    });
  };
  const check = () => {
    winningSlots = checkBoard();
    // tie
    if (winningSlots.length === 9) {
      winningSlots.forEach((slot) => {
        slot.element.style.color = "orange";
        for (player of Object.values(players)) {
          player.element.classList.add("selected");
          player.element.style.cursor = "default";
        }
      });
      return;
    }
    if (winningSlots.length > 0) {
      winningSlots.forEach((slot) => (slot.element.style.color = "green"));
      for (player of Object.values(players)) {
        player.element.classList.add("selected");
        player.element.style.cursor = "default";
      }
      endGame();
    }
  };
  return { boardArray, check };
};

// switch player
const switchPlayer = (e) => {
  if (!globalPlayer) {
    globalPlayer = players[e.target.innerText];
    e.target.classList.add("selected");
    for (player of Object.values(players)) {
      player.element.removeEventListener("click", switchPlayer);
      player.element.style.cursor = "default";
    }
    return;
  }
  globalPlayer.element.classList.remove("selected");
  if (globalPlayer.player === "X") globalPlayer = players["O"];
  else globalPlayer = players["X"];
  globalPlayer.element.classList.add("selected");
};

// player factory
const playerFactory = (player) => {
  const element = document.getElementById(player);
  element.addEventListener("click", switchPlayer);
  return { player, element };
};

let board = boardFactory();
let players = { X: playerFactory("X"), O: playerFactory("O") };

// restart button
const restartButton = document.createElement("div");
