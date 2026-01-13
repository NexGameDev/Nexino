const playerHandEl = document.getElementById("playerHand");
const computerHandEl = document.getElementById("computerHand");
const chainEl = document.getElementById("chain");
const statusEl = document.getElementById("status");
const rotateBtn = document.getElementById("rotateBtn");
const drawBtn = document.getElementById("drawBtn");

let stock = [];
let playerHand = [];
let computerHand = [];
let chain = [];

let selected = null;
let rotated = false;
let turn = "player";

// ---------- DOMINO UTILS ----------
function createDomino(a, b, hidden = false, small = false) {
  const d = document.createElement("div");
  d.className = "domino";
  if (hidden) d.classList.add("hidden");
  if (small) d.classList.add("small");

  const top = document.createElement("div");
  top.className = "pips";
  const bottom = document.createElement("div");
  bottom.className = "pips";

  renderPips(top, a);
  renderPips(bottom, b);

  d.append(top, bottom);
  d.dataset.a = a;
  d.dataset.b = b;

  return d;
}

function renderPips(container, count) {
  container.innerHTML = "";
  const map = [
    [], [1], [0,2], [0,1,2], [0,1,2,3], [0,1,2,3,4], [0,1,2,3,4,5]
  ];
  map[count].forEach(() => {
    const p = document.createElement("div");
    p.className = "pip";
    container.appendChild(p);
  });
}

// ---------- SETUP ----------
function init() {
  createStock();
  deal();
  render();
  highlightValid();
}

function createStock() {
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      stock.push([i, j]);
    }
  }
  stock.sort(() => Math.random() - 0.5);
}

function deal() {
  for (let i = 0; i < 7; i++) {
    playerHand.push(stock.pop());
    computerHand.push(stock.pop());
  }
}

// ---------- RENDER ----------
function render() {
  playerHandEl.innerHTML = "";
  computerHandEl.innerHTML = "";
  chainEl.innerHTML = "";

  playerHand.forEach((d, i) => {
    const dom = createDomino(d[0], d[1]);
    dom.onclick = () => selectDomino(i);
    playerHandEl.appendChild(dom);
  });

  computerHand.forEach(() => {
    computerHandEl.appendChild(createDomino(0, 0, true));
  });

  chain.forEach(d => {
    chainEl.appendChild(createDomino(d[0], d[1], false, true));
  });
}

// ---------- GAME LOGIC ----------
function selectDomino(i) {
  if (turn !== "player") return;
  selected = i;
  rotated = false;
  highlightValid();
}

rotateBtn.onclick = () => {
  if (selected === null) return;
  rotated = !rotated;
};

drawBtn.onclick = () => {
  if (stock.length === 0) return;
  playerHand.push(stock.pop());
  render();
  highlightValid();
};

function canPlace(domino) {
  if (chain.length === 0) return true;
  const left = chain[0][0];
  const right = chain[chain.length - 1][1];
  return domino.includes(left) || domino.includes(right);
}

function highlightValid() {
  [...playerHandEl.children].forEach((el, i) => {
    el.classList.toggle("valid", canPlace(playerHand[i]));
  });
}

// ---------- PLACE ----------
playerHandEl.onclick = () => {
  if (selected === null) return;
  const d = playerHand[selected];
  if (!canPlace(d)) return;

  if (chain.length === 0) {
    chain.push(rotated ? [d[1], d[0]] : d);
  } else {
    const left = chain[0][0];
    const right = chain[chain.length - 1][1];
    const [a, b] = rotated ? [d[1], d[0]] : d;

    if (b === left) chain.unshift([a, b]);
    else if (a === right) chain.push([a, b]);
    else return;
  }

  playerHand.splice(selected, 1);
  selected = null;
  turn = "computer";
  render();
  setTimeout(computerTurn, 800);
};

// ---------- AI ----------
function computerTurn() {
  statusEl.textContent = "Computer's turn";

  for (let i = 0; i < computerHand.length; i++) {
    if (canPlace(computerHand[i])) {
      chain.push(computerHand.splice(i, 1)[0]);
      turn = "player";
      statusEl.textContent = "Your turn";
      render();
      highlightValid();
      return;
    }
  }

  if (stock.length > 0) {
    computerHand.push(stock.pop());
    setTimeout(computerTurn, 600);
  } else {
    turn = "player";
    statusEl.textContent = "Your turn";
  }
}

init();
