const ROW_COUNT = 3;
const COL_COUNT = 3;
var player = "X";

const switchPlayer = () => {
  const X = document.getElementById("X");
  const O = document.getElementById("O");
  if (player === "X") {
    X.style.background = "white";
    O.style.background = "gray";
    player = "O";
  } else {
    O.style.background = "white";
    X.style.background = "gray";
    player = "X";
  }
};
const checkBoard = () => {
  const boardArray = getBoard();
  // check row and col
  for (let i = 0; i < ROW_COUNT; i++) {
    row = [boardArray[i][0], boardArray[i][1], boardArray[i][2]];
    col = [boardArray[0][i], boardArray[1][i], boardArray[2][i]];
    if (row.every((slot) => slot.innerText === "X")) return row;
    if (row.every((slot) => slot.innerText === "O")) return row;
    if (col.every((slot) => slot.innerText === "X")) return col;
    if (col.every((slot) => slot.innerText === "O")) return col;
  }
  // check diagonal
  diagonalLeft = [boardArray[0][0], boardArray[1][1], boardArray[2][2]];
  diagonalRight = [boardArray[2][0], boardArray[1][1], boardArray[0][2]];
  if (diagonalLeft.every((slot) => slot.innerText === "X")) return diagonalLeft;
  if (diagonalLeft.every((slot) => slot.innerText === "O")) return diagonalLeft;
  if (diagonalRight.every((slot) => slot.innerText === "X"))
    return diagonalRight;
  if (diagonalRight.every((slot) => slot.innerText === "O"))
    return diagonalRight;

  // check tie
  const slots = Array.from(document.querySelectorAll(".slot"));
  if (slots.every((slot) => slot.innerText.length > 0)) return slots;

  // nothing
  return [];
};
const setColor = (color, slots) => {
  slots.forEach((slot) => (slot.style.color = color));
};
const check = () => {
  const winningSlots = checkBoard();
  if (winningSlots.length === 9) {
    setColor("orange", winningSlots);
    restartScreen("Tie!");
  } else if (winningSlots.length === 3) {
    setColor("green", winningSlots);
    restartScreen(winningSlots[0].innerText + " Wins!");
  }
};
const play = (e) => {
  e.target.removeEventListener("click", play);
  e.target.innerText = player;
  e.target.style.cursor = "default";
  switchPlayer();
  check();
};
const initializeSlots = () => {
  const slots = document.querySelectorAll(".slot");
  slots.forEach((slot) => slot.addEventListener("click", play));
};
const resetSlots = () => {
  const slots = document.querySelectorAll(".slot");
  slots.forEach((slot) => {
    slot.removeEventListener("click", play);
    slot.innerText = "";
    slot.style.color = "black";
    slot.style.cursor = "pointer";
  });
};
const resetPlayers = () => {
  const X = document.getElementById("X");
  const O = document.getElementById("O");
  X.style.background = "gray";
  O.style.background = "white";
  player = "X";
};
const getBoard = () => {
  const slots = Array.from(document.querySelectorAll(".slot"));
  let board = [];
  for (let i = 0; i < ROW_COUNT; i++) {
    row = [];
    for (let j = 0; j < COL_COUNT; j++) {
      const slot = slots.shift();
      row.push(slot);
    }
    board.push(row);
  }
  return board;
};

const restartScreen = (status) => {
  const restartDiv = document.createElement("div");
  restartDiv.classList.add("restart");

  const restartText = document.createElement("h2");
  restartText.innerText = status;
  restartText.classList.add("restart-text");
  restartDiv.appendChild(restartText);

  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.classList.add("restart-button");
  restartButton.addEventListener("click", restart);
  restartDiv.appendChild(restartButton);

  document.querySelector("body").appendChild(restartDiv);
};
const start = () => {
  resetSlots();
  resetPlayers();
  initializeSlots();
};
const restart = () => {
  document
    .querySelector(".restart-button")
    .removeEventListener("click", restart);
  document
    .querySelector("body")
    .removeChild(document.querySelector(".restart"));
  start();
};

start();
