const statusText = document.getElementById("status");
const playerHandEl = document.getElementById("player-hand");
const computerHandEl = document.getElementById("computer-hand");
const chainEl = document.getElementById("chain");
const rotateBtn = document.getElementById("rotateBtn");
const drawBtn = document.getElementById("drawBtn");

let stock = [];
let playerHand = [];
let computerHand = [];
let chain = [];
let selectedTile = null;
let playerTurn = true;

// pip pattern GRID 2x3
const pipMap = {
  0:[],
  1:[4],
  2:[2,6],
  3:[2,4,6],
  4:[1,3,5,7],
  5:[1,3,4,5,7],
  6:[1,3,5,7,2,6]
};

function createDomino(a,b){
  return {a,b,rotated:false};
}

function createSet(){
  let set=[];
  for(let i=0;i<=6;i++){
    for(let j=i;j<=6;j++){
      set.push(createDomino(i,j));
    }
  }
  return set.sort(()=>Math.random()-0.5);
}

function renderFace(value){
  const face=document.createElement("div");
  face.className="face";
  for(let i=1;i<=6;i++){
    const d=document.createElement("div");
    if(pipMap[value].includes(i)){
      d.className="pip";
    }
    face.appendChild(d);
  }
  return face;
}

function renderDomino(domino,clickable=false){
  const d=document.createElement("div");
  d.className="domino";

  let top=domino.rotated?domino.b:domino.a;
  let bottom=domino.rotated?domino.a:domino.b;

  d.appendChild(renderFace(top));
  d.appendChild(renderFace(bottom));

  if(clickable){
    if(canPlay(domino)) d.classList.add("playable");
    d.onclick=()=>{
      if(!playerTurn || !canPlay(domino))return;
      document.querySelectorAll(".selected").forEach(x=>x.classList.remove("selected"));
      d.classList.add("selected");
      selectedTile=domino;
    };
  }
  return d;
}

function render(){
  playerHandEl.innerHTML="";
  computerHandEl.innerHTML="";
  chainEl.innerHTML="";

  computerHand.forEach(()=> {
    const back=document.createElement("div");
    back.className="back";
    computerHandEl.appendChild(back);
  });

  chain.forEach(dom=>{
    const el=renderDomino(dom);
    el.classList.add("horizontal");
    chainEl.appendChild(el);
  });

  playerHand.forEach(dom=>{
    playerHandEl.appendChild(renderDomino(dom,true));
  });

  drawBtn.disabled = hasMove(playerHand);
}

function canPlay(dom){
  if(chain.length===0) return true;
  const left=chain[0].a;
  const right=chain[chain.length-1].b;
  return dom.a===left||dom.b===left||dom.a===right||dom.b===right;
}

function hasMove(hand){
  return hand.some(canPlay);
}

rotateBtn.onclick=()=>{
  if(!selectedTile)return;
  selectedTile.rotated=!selectedTile.rotated;
  render();
};

drawBtn.onclick=()=>{
  if(stock.length===0)return;
  playerHand.push(stock.pop());
  render();
};

function play(dom,fromPlayer=true){
  if(chain.length===0){
    chain.push(dom);
  }else{
    const left=chain[0].a;
    const right=chain[chain.length-1].b;

    let a=dom.rotated?dom.b:dom.a;
    let b=dom.rotated?dom.a:dom.b;

    if(b===left) chain.unshift(createDomino(a,b));
    else if(a===right) chain.push(createDomino(a,b));
  }
  if(fromPlayer){
    playerHand.splice(playerHand.indexOf(dom),1);
    selectedTile=null;
    playerTurn=false;
    statusText.textContent="Computer’s turn";
    setTimeout(computerMove,800);
  }else{
    computerHand.splice(computerHand.indexOf(dom),1);
    playerTurn=true;
    statusText.textContent="Your turn";
  }
  render();
}

function computerMove(){
  let move=computerHand.find(canPlay);
  if(move){
    play(move,false);
  }else if(stock.length){
    computerHand.push(stock.pop());
    setTimeout(computerMove,600);
  }
}

function start(){
  stock=createSet();
  playerHand=stock.splice(0,7);
  computerHand=stock.splice(0,7);
  render();
}

start();

playerHandEl.onclick=()=>{
  if(selectedTile) play(selectedTile,true);
};
