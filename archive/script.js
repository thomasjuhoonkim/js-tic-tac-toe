// constants and global variables
const ROW_COUNT = 3;
const COL_COUNT = 3;
var globalPlayer = null;

// slot factory
const slotFactory = (num) => {
  const removeEvent = (e) => {
    e.target.removeEventListener("click", addPlayerMark);
    e.target.style.cursor = "default";
  };
  const removeEventEndGame = () => {
    element.removeEventListener("click", addPlayerMark);
    element.style.cursor = "default";
  };
  const addPlayerMark = (e) => {
    if (!globalPlayer) return;
    e.target.innerText = globalPlayer.player;
    removeEvent(e);
    switchPlayer();
    board.check();
  };
  // build board
  const element = document.createElement("div");
  element.classList.add("slot");
  element.id = String(num);
  element.addEventListener("click", addPlayerMark);
  document.querySelector(".board").appendChild(element);
  return { num, element, removeEventEndGame };
};

// board factory
const boardFactory = () => {
  // reset first
  document.querySelectorAll(".slot").forEach((slot) => slot.remove());

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

    restartGameScreen();
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
      endGame();
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
  element.classList.remove("selected");
  element.style.cursor = "pointer";
  element.addEventListener("click", switchPlayer);
  return { player, element };
};

const restartGameScreen = () => {
  const restart = document.createElement("div");
  restart.classList.add("restart");

  const restartText = document.createElement("h2");
  restartText.innerText = "Game Over!";
  restartText.classList.add("restart-text");
  restart.appendChild(restartText);

  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.classList.add("restart-button");
  restartButton.addEventListener("click", start);
  restart.appendChild(restartButton);

  // add it
  document.querySelector("body").appendChild(restart);
};

const start = () => {
  document
    .querySelector("body")
    .removeChild(document.querySelector(".restart"));
  board = boardFactory();
  players = { X: playerFactory("X"), O: playerFactory("O") };
  globalPlayer = null;
};

var board = boardFactory();
var players = { X: playerFactory("X"), O: playerFactory("O") };
