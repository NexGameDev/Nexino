const stock = [];
const playerHand = [];
const aiHand = [];
let board = [];
let selectedTile = null;
let playerTurn = true;

const statusEl = document.getElementById("status");
const boardEl = document.getElementById("board");
const playerEl = document.getElementById("player");
const aiEl = document.getElementById("computer");
const drawBtn = document.getElementById("drawBtn");
const rotateBtn = document.getElementById("rotateBtn");

/* ===== INIT ===== */
function init(){
  for(let i=0;i<=6;i++){
    for(let j=i;j<=6;j++){
      stock.push([i,j]);
    }
  }
  shuffle(stock);
  for(let i=0;i<7;i++){
    playerHand.push(stock.pop());
    aiHand.push(stock.pop());
  }
  board.push(stock.pop());
  render();
}
function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

/* ===== RULE ===== */
function ends(){
  return [board[0][0], board[board.length-1][1]];
}
function isValid(tile){
  const [l,r]=ends();
  return tile[0]===l||tile[1]===l||tile[0]===r||tile[1]===r;
}
function hasMove(hand){
  return hand.some(isValid);
}

/* ===== DRAW ===== */
drawBtn.onclick=()=>{
  if(!playerTurn) return;
  playerHand.push(stock.pop());
  render();
};
rotateBtn.onclick=()=>{
  if(!selectedTile) return;
  [selectedTile[0],selectedTile[1]]=[selectedTile[1],selectedTile[0]];
  render();
};

/* ===== PLACE ===== */
function place(tile){
  const [l,r]=ends();
  if(tile[1]===l) board.unshift(tile);
  else if(tile[0]===l) board.unshift([tile[1],tile[0]]);
  else if(tile[0]===r) board.push(tile);
  else if(tile[1]===r) board.push([tile[1],tile[0]]);
  else return false;
  return true;
}

/* ===== AI ===== */
function aiTurn(){
  statusEl.textContent="Computer's turn";
  setTimeout(()=>{
    let moved=false;
    for(let t of aiHand){
      if(isValid(t)){
        place(t);
        aiHand.splice(aiHand.indexOf(t),1);
        moved=true;
        break;
      }
    }
    if(!moved && stock.length){
      aiHand.push(stock.pop());
      aiTurn();
      return;
    }
    playerTurn=true;
    render();
  },700);
}

/* ===== RENDER ===== */
function makeTile(tile, hidden=false){
  const d=document.createElement("div");
  d.className="tile";
  if(hidden) d.classList.add("hidden");
  const h1=document.createElement("div");
  const h2=document.createElement("div");
  h1.className=h2.className="half";
  h1.textContent="•".repeat(tile[0]);
  h2.textContent="•".repeat(tile[1]);
  const div=document.createElement("div");
  div.className="divider";
  d.append(h1,div,h2);
  return d;
}

function render(){
  boardEl.innerHTML="";
  playerEl.innerHTML="";
  aiEl.innerHTML="";

  board.forEach(t=>boardEl.appendChild(makeTile(t)));

  aiHand.forEach(()=>aiEl.appendChild(makeTile([0,0],true)));

  playerHand.forEach(t=>{
    const el=makeTile(t);
    if(isValid(t)){
      el.classList.add("valid");
      el.onclick=()=>{
        if(place(t)){
          playerHand.splice(playerHand.indexOf(t),1);
          playerTurn=false;
          render();
          aiTurn();
        }
      };
    }else{
      el.classList.add("invalid");
    }
    el.onclick=()=>selectedTile=t;
    playerEl.appendChild(el);
  });

  drawBtn.disabled=hasMove(playerHand);
  statusEl.textContent=playerTurn?"Your turn":"Computer's turn";
}

init();
