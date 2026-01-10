const playerHandEl = document.getElementById("player-hand");
const computerHandEl = document.getElementById("computer-hand");
const boardEl = document.getElementById("domino-line");
const statusEl = document.getElementById("status");

let deck=[], player=[], computer=[], board=[];
let turn="player";

init();

function init(){
  deck=[];
  for(let i=0;i<=6;i++)for(let j=i;j<=6;j++)deck.push({a:i,b:j});
  shuffle(deck);
  player=deck.splice(0,7);
  computer=deck.splice(0,7);
  render();
  updatePlayable();
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

function createPips(n){
  const p=document.createElement("div");
  p.className="pips";
  for(let i=0;i<n;i++){
    const dot=document.createElement("div");
    dot.className="pip";
    p.appendChild(dot);
  }
  return p;
}

function createDomino(t){
  const d=document.createElement("div");
  d.className="domino dark";
  const h1=document.createElement("div");
  const h2=document.createElement("div");
  h1.className=h2.className="half";
  h1.appendChild(createPips(t.a));
  h2.appendChild(createPips(t.b));
  d.append(h1,h2);
  return d;
}

function render(){
  playerHandEl.innerHTML="";
  computerHandEl.innerHTML="";
  player.forEach((t,i)=>{
    const d=createDomino(t);
    d.onclick=()=>play(i);
    playerHandEl.appendChild(d);
  });
  computer.forEach(()=>computerHandEl.appendChild(
    Object.assign(document.createElement("div"),{className:"back"})
  ));
}

function ends(){
  if(!board.length)return null;
  return {l:board[0].a,r:board[board.length-1].b};
}

function updatePlayable(){
  const e=ends();
  document.querySelectorAll("#player-hand .domino").forEach((d,i)=>{
    d.classList.remove("playable","dark");
    const t=player[i];
    let ok=!e||t.a===e.l||t.b===e.l||t.a===e.r||t.b===e.r;
    if(ok)d.classList.add("playable");
    else d.classList.add("dark");
  });
}

function play(i){
  if(turn!=="player")return;
  const t=player[i];
  const e=ends();
  if(e && !(t.a===e.l||t.b===e.l||t.a===e.r||t.b===e.r))return;
  place(t);
  player.splice(i,1);
  render();
  checkWin();
  turn="computer";
  setTimeout(aiTurn,800);
}

function place(t){
  const d=createDomino(t);
  d.classList.add("placing");
  boardEl.appendChild(d);
  board.push(t);
}

function aiTurn(){
  statusEl.textContent="Computer’s turn";
  const e=ends();
  let idx=computer.findIndex(t=>!e||t.a===e.l||t.b===e.l||t.a===e.r||t.b===e.r);
  if(idx===-1 && deck.length){
    computer.push(deck.pop());
    aiTurn();
    return;
  }
  if(idx>-1){
    place(computer[idx]);
    computer.splice(idx,1);
  }
  render();
  checkWin();
  turn="player";
  statusEl.textContent="Your turn";
  updatePlayable();
}

function checkWin(){
  if(player.length===0)statusEl.textContent="You Win!";
  if(computer.length===0)statusEl.textContent="Computer Wins!";
}
