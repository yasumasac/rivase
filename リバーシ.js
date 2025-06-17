const SIZE = 8;
const EMPTY = 0, BLACK = 1, WHITE = 2;
let board = [], currentPlayer = BLACK;

const gameEl = document.getElementById("game");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");

function initGame() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  currentPlayer = BLACK;
  renderBoard();
  updateStatus();
}

function renderBoard() {
  gameEl.innerHTML = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.onclick = () => handleMove(x, y);
      const value = board[y][x];
      if (value !== EMPTY) {
        const disk = document.createElement("div");
        disk.className = "disk " + (value === BLACK ? "black" : "white");
        cell.appendChild(disk);
      }
      gameEl.appendChild(cell);
    }
  }
}

const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [-1, -1], [1, -1], [-1, 1]
];

function inBounds(x, y) {
  return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
}

function validMove(x, y, color) {
  if (board[y][x] !== EMPTY) return false;
  for (let [dx, dy] of directions) {
    let nx = x + dx, ny = y + dy, flipped = 0;
    while (inBounds(nx, ny) && board[ny][nx] === 3 - color) {
      nx += dx;
      ny += dy;
      flipped++;
    }
    if (flipped > 0 && inBounds(nx, ny) && board[ny][nx] === color) {
      return true;
    }
  }
  return false;
}

function handleMove(x, y) {
  if (!validMove(x, y, currentPlayer)) return;
  board[y][x] = currentPlayer;
  for (let [dx, dy] of directions) {
    let path = [];
    let nx = x + dx, ny = y + dy;
    while (inBounds(nx, ny) && board[ny][nx] === 3 - currentPlayer) {
      path.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
    if (inBounds(nx, ny) && board[ny][nx] === currentPlayer) {
      for (let [fx, fy] of path) {
        board[fy][fx] = currentPlayer;
      }
    }
  }
  currentPlayer = 3 - currentPlayer;
  if (!hasValidMoves(currentPlayer)) {
    currentPlayer = 3 - currentPlayer;
    if (!hasValidMoves(currentPlayer)) {
      endGame();
      return;
    } else {
      alert("パスされました。");
    }
  }
  renderBoard();
  updateStatus();
}

function hasValidMoves(color) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (validMove(x, y, color)) return true;
    }
  }
  return false;
}

function endGame() {
  let black = 0, white = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell === BLACK) black++;
      if (cell === WHITE) white++;
    }
  }
  statusEl.textContent = `ゲーム終了！ 黒: ${black}, 白: ${white} → 勝者: ${black > white ? "黒" : black < white ? "白" : "引き分け"}`;
}

function updateStatus() {
  let black = 0, white = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell === BLACK) black++;
      if (cell === WHITE) white++;
    }
  }
  statusEl.textContent = `${currentPlayer === BLACK ? "黒" : "白"}の番です`;
  scoreEl.textContent = `黒: ${black} / 白: ${white}`;
}

initGame();
