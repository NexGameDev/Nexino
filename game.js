// ===== DOM REFERENCES =====
const playerHandEl = document.getElementById("player-hand");
const computerHandEl = document.getElementById("computer-hand");
const boardEl = document.getElementById("domino-line");
const statusEl = document.getElementById("status");
const rotateBtn = document.getElementById("rotate-btn");

// ===== GAME STATE =====
let deck = [];
let playerHand = [];
let computerHand = [];
let board = [];
let currentPlayer = "player";
let selectedTile = null;
let rotation = "horizontal";

// ===== INIT =====
initGame();

function initGame() {
  deck = generateDeck();
  shuffle(deck);

  playerHand = deck.splice(0, 7);
  computerHand = deck.splice(0, 7);

  renderHands();
  updatePlayable();
  statusEl.textContent = "Your turn";
}

// ===== DECK =====
function generateDeck() {
  let d = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      d.push({ a: i, b: j });
    }
  }
  return d;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ===== RENDER =====
function renderHands() {
  playerHandEl.innerHTML = "";
  computerHandEl.innerHTML = "";

  playerHand.forEach((tile, i) => {
    const el = createDomino(tile, true);
    el.onclick = () => selectTile(i);
    playerHandEl.appendChild(el);
  });

  computerHand.forEach(() => {
    const back = document.createElement("div");
    back.className = "computer-tile";
    computerHandEl.appendChild(back);
  });
}

function createDomino(tile, isPlayer) {
  const d = document.createElement("div");
  d.className = `domino horizontal draw tile-dark`;

  const h1 = document.createElement("div");
  const h2 = document.createElement("div");
  h1.className = h2.className = "domino-half";
  h1.textContent = tile.a;
  h2.textContent = tile.b;

  d.appendChild(h1);
  d.appendChild(h2);

  if (!isPlayer) d.classList.add("computer");

  return d;
}

// ===== SELECT & ROTATE =====
function selectTile(index) {
  if (currentPlayer !== "player") return;
  selectedTile = index;
}

rotateBtn.onclick = () => {
  rotation = rotation === "horizontal" ? "vertical" : "horizontal";
  document.querySelectorAll(".domino").forEach(d => {
    d.classList.toggle("vertical");
    d.classList.toggle("horizontal");
  });
};

// ===== PLAYABLE LOGIC =====
function updatePlayable() {
  const ends = getBoardEnds();

  document.querySelectorAll("#player-hand .domino").forEach((el, i) => {
    const tile = playerHand[i];
    const playable =
      board.length === 0 ||
      tile.a === ends.left ||
      tile.b === ends.left ||
      tile.a === ends.right ||
      tile.b === ends.right;

    el.classList.remove("tile-dark", "tile-playable");

    if (playable) {
      el.classList.add("tile-light", "tile-playable");
    } else {
      el.classList.add("tile-dark");
    }
  });
}

// ===== BOARD =====
function getBoardEnds() {
  if (board.length === 0) return {};
  return {
    left: board[0].a,
    right: board[board.length - 1].b
  };
}

function placeTile(tile, fromPlayer = true) {
  const d = createDomino(tile, fromPlayer);
  d.classList.add("placing");
  boardEl.appendChild(d);
  board.push(tile);
}

// ===== PLAYER TURN =====
playerHandEl.onclick = () => {
  if (selectedTile == null) return;

  const tile = playerHand[selectedTile];
  const ends = getBoardEnds();

  const canPlay =
    board.length === 0 ||
    tile.a === ends.left ||
    tile.b === ends.left ||
    tile.a === ends.right ||
    tile.b === ends.right;

  if (!canPlay) return;

  placeTile(tile);
  playerHand.splice(selectedTile, 1);
  selectedTile = null;

  renderHands();
  checkWin("player");
  nextTurn();
};

// ===== COMPUTER AI =====
function computerTurn() {
  statusEl.textContent = "Computer’s turn";

  setTimeout(() => {
    let played = false;
    const ends = getBoardEnds();

    for (let i = 0; i < computerHand.length; i++) {
      const t = computerHand[i];
      if (
        board.length === 0 ||
        t.a === ends.left ||
        t.b === ends.left ||
        t.a === ends.right ||
        t.b === ends.right
      ) {
        placeTile(t, false);
        computerHand.splice(i, 1);
        played = true;
        break;
      }
    }

    if (!played) {
      if (deck.length > 0) {
        statusEl.textContent = "Giving tile to Computer";
        computerHand.push(deck.pop());
      }
    }

    renderHands();
    checkWin("computer");
    currentPlayer = "player";
    statusEl.textContent = "Your turn";
    updatePlayable();
  }, 900);
}

// ===== TURN HANDLING =====
function nextTurn() {
  currentPlayer = "computer";
  computerTurn();
  updatePlayable();
}

// ===== WIN =====
function checkWin(who) {
  if (who === "player" && playerHand.length === 0) {
    statusEl.textContent = "You Win!";
  }
  if (who === "computer" && computerHand.length === 0) {
    statusEl.textContent = "Computer Wins!";
  }
}
