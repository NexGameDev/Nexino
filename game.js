/* ========= DATA ========= */
const board = document.getElementById("board");
const playerHandEl = document.getElementById("playerHand");
const computerHandEl = document.getElementById("computerHand");
const statusEl = document.getElementById("status");

let stock = [];
let playerHand = [];
let computerHand = [];
let boardChain = [];
let currentTurn = "player";
let selectedDomino = null;

/* BOARD PATH */
const path = [];
let pathIndex = 0;

for(let i=0;i<6;i++) path.push({x:60+i*36,y:160,dir:"right"});
for(let i=1;i<4;i++) path.push({x:60+5*36,y:160+i*36,dir:"down"});

/* ========= INIT ========= */
initStock();
dealHands();
renderHands();
updateValidDomino();

/* ========= FUNCTIONS ========= */

function initStock(){
  for(let a=0;a<=6;a++){
    for(let b=a;b<=6;b++){
      stock.push([a,b]);
    }
  }
  stock.sort(()=>Math.random()-0.5);
}

function dealHands(){
  for(let i=0;i<7;i++){
    playerHand.push(stock.pop());
    computerHand.push(stock.pop());
  }
}

function createDomino([a,b], hidden=false){
  const d=document.createElement("div");
  d.className="domino hand";
  d.dataset.a=a;
  d.dataset.b=b;
  d.dataset.rot="0";

  if(hidden){
    d.style.background="#ccc";
    return d;
  }

  d.appendChild(makeSide(a));
  d.appendChild(makeSide(b));
  return d;
}

function makeSide(n){
  const s=document.createElement("div");
  s.className="side";
  for(let i=0;i<n;i++){
    const dot=document.createElement("div");
    dot.className="dot";
    s.appendChild(dot);
  }
  return s;
}

function renderHands(){
  playerHandEl.innerHTML="";
  playerHand.forEach(dom=>{
    const d=createDomino(dom);
    d.onclick=()=>selectDomino(d);
    playerHandEl.appendChild(d);
  });

  computerHandEl.innerHTML="";
  computerHand.forEach(()=>computerHandEl.appendChild(createDomino([0,0],true)));
}

function selectDomino(d){
  if(currentTurn!=="player") return;
  document.querySelectorAll(".domino").forEach(x=>x.classList.remove("selected"));
  selectedDomino=d;
  d.classList.add("selected");
}

function updateValidDomino(){
  document.querySelectorAll(".domino").forEach(d=>d.classList.remove("valid"));
  if(boardChain.length===0){
    playerHandEl.querySelectorAll(".domino").forEach(d=>d.classList.add("valid"));
    return;
  }
  const left=boardChain[0][0];
  const right=boardChain.at(-1)[1];

  playerHandEl.querySelectorAll(".domino").forEach(d=>{
    const a=+d.dataset.a,b=+d.dataset.b;
    if(a===left||b===left||a===right||b===right) d.classList.add("valid");
  });
}

/* ========= PLACE ========= */
function placeDomino(domino, values){
  const pos=path[pathIndex++];
  domino.classList.remove("hand","valid","selected");
  domino.classList.add("board");

  board.appendChild(domino);

  domino.style.left=pos.x+"px";
  domino.style.top=pos.y+"px";

  if(pos.dir==="down") domino.style.transform="rotate(90deg)";
}

/* ========= ROTATE ========= */
document.getElementById("rotateBtn").onclick=()=>{
  if(!selectedDomino) return;
  selectedDomino.style.transform =
    selectedDomino.style.transform ? "" : "rotate(180deg)";
  [selectedDomino.dataset.a,selectedDomino.dataset.b]=
  [selectedDomino.dataset.b,selectedDomino.dataset.a];
};

/* ========= DRAW ========= */
document.getElementById("drawBtn").onclick=()=>{
  if(currentTurn!=="player"||stock.length===0) return;
  playerHand.push(stock.pop());
  renderHands();
  updateValidDomino();
};

/* ========= AI ========= */
function computerTurn(){
  statusEl.textContent="Computer’s Turn";
  setTimeout(()=>{
    const left=boardChain[0]?.[0];
    const right=boardChain.at(-1)?.[1];

    let idx=computerHand.findIndex(d=>
      !boardChain.length || d[0]===left||d[1]===left||d[0]===right||d[1]===right
    );

    if(idx===-1){
      if(stock.length){
        computerHand.push(stock.pop());
        computerTurn();
      }
      return;
    }

    const dom=computerHand.splice(idx,1)[0];
    boardChain.push(dom);

    const d=createDomino(dom);
    placeDomino(d,dom);

    currentTurn="player";
    statusEl.textContent="Your Turn";
    renderHands();
    updateValidDomino();
  },800);
}

/* ========= PLAYER PLACE ========= */
playerHandEl.onclick=()=>{
  if(!selectedDomino||!selectedDomino.classList.contains("valid")) return;
  const a=+selectedDomino.dataset.a;
  const b=+selectedDomino.dataset.b;
  boardChain.push([a,b]);
  placeDomino(selectedDomino,[a,b]);
  playerHand=playerHand.filter(d=>!(d[0]==a&&d[1]==b));
  selectedDomino=null;
  currentTurn="computer";
  computerTurn();
};
