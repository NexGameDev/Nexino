const statusEl = document.getElementById("status");
const boardEl = document.getElementById("board");
const playerEl = document.getElementById("player");
const computerEl = document.getElementById("computer");
const rotateBtn = document.getElementById("rotateBtn");
const drawBtn = document.getElementById("drawBtn");

let stock = [];
let player = [];
let computer = [];
let board = [];
let selected = null;
let vertical = false;

/* ===== CREATE SET ===== */
function createSet(){
  let s=[];
  for(let i=0;i<=6;i++){
    for(let j=i;j<=6;j++){
      s.push({a:i,b:j});
    }
  }
  return s.sort(()=>Math.random()-0.5);
}

/* ===== DOT RENDER ===== */
function dots(n){
  let f=document.createDocumentFragment();
  for(let i=0;i<n;i++){
    let d=document.createElement("div");
    d.className="dot";
    f.appendChild(d);
  }
  return f;
}

/* ===== TILE ===== */
function tileDom(t){
  let el=document.createElement("div");
  el.className="tile";
  let h1=document.createElement("div");
  h1.className="half";
  h1.appendChild(dots(t.a));
  let h2=document.createElement("div");
  h2.className="half";
  h2.appendChild(dots(t.b));
  let d=document.createElement("div");
  d.className="divider";
  el.append(h1,d,h2);
  return el;
}

/* ===== VALID CHECK ===== */
function valid(t){
  if(board.length===0) return true;
  let L=board[0].a;
  let R=board.at(-1).b;
  return t.a===L||t.b===L||t.a===R||t.b===R;
}

/* ===== RENDER ===== */
function render(){
  playerEl.innerHTML="";
  boardEl.innerHTML="";
  computerEl.innerHTML="";

  player.forEach((t,i)=>{
    let el=tileDom(t);
    if(valid(t)) el.classList.add("valid");
    if(selected===i) el.classList.add("selected");
    el.onclick=()=>selected=i;
    playerEl.appendChild(el);
  });

  board.forEach(t=>{
    let el=tileDom(t);
    boardEl.appendChild(el);
  });

  for(let i=0;i<computer.length;i++){
    let b=document.createElement("div");
    b.className="comp-tile";
    computerEl.appendChild(b);
  }

  drawBtn.disabled = player.some(valid);
}

/* ===== PLACE ===== */
function place(){
  if(selected===null) return;
  let t=player[selected];
  if(!valid(t)) return;

  if(board.length===0){
    board.push(t);
  }else{
    let L=board[0].a;
    let R=board.at(-1).b;
    if(t.b===L) board.unshift({a:t.a,b:t.b});
    else if(t.a===L) board.unshift({a:t.b,b:t.a});
    else if(t.a===R) board.push({a:t.a,b:t.b});
    else if(t.b===R) board.push({a:t.b,b:t.a});
  }

  player.splice(selected,1);
  selected=null;
  render();
  setTimeout(computerTurn,600);
}

/* ===== COMPUTER ===== */
function computerTurn(){
  statusEl.textContent="Computer's turn";
  let idx=computer.findIndex(valid);
  if(idx===-1 && stock.length){
    computer.push(stock.pop());
    setTimeout(computerTurn,400);
    return;
  }
  if(idx!==-1){
    let t=computer[idx];
    if(board.length===0) board.push(t);
    else{
      let L=board[0].a;
      let R=board.at(-1).b;
      if(t.b===L) board.unshift({a:t.a,b:t.b});
      else if(t.a===L) board.unshift({a:t.b,b:t.a});
      else if(t.a===R) board.push({a:t.a,b:t.b});
      else board.push({a:t.b,b:t.a});
    }
    computer.splice(idx,1);
  }
  statusEl.textContent="Your turn";
  render();
}

/* ===== BUTTONS ===== */
rotateBtn.onclick=()=>{
  if(selected===null) return;
  let t=player[selected];
  [t.a,t.b]=[t.b,t.a];
  render();
};
drawBtn.onclick=()=>{
  if(stock.length){
    player.push(stock.pop());
    render();
  }
};

/* ===== START ===== */
function start(){
  stock=createSet();
  player=stock.splice(0,7);
  computer=stock.splice(0,7);
  board=[];
  statusEl.textContent="Your turn";
  render();
}

start();
boardEl.onclick=place;
