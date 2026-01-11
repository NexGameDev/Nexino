<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Domino Final</title>

<style>
*{box-sizing:border-box}
body{
  margin:0;
  background:#0b0b0b;
  color:#fff;
  font-family:Arial,Helvetica,sans-serif;
  display:flex;
  flex-direction:column;
  height:100vh;
}

#status{
  text-align:center;
  padding:12px;
  font-size:18px;
}

#board{
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;
}

#chain{
  display:flex;
  gap:6px;
  transition:0.3s;
}

.hand{
  display:flex;
  gap:8px;
  padding:10px;
  overflow-x:auto;
}

#computer-hand{
  justify-content:center;
}

#player-hand{
  justify-content:flex-start;
}

.domino{
  width:48px;
  height:96px;
  background:#e6e6e6;
  border-radius:10px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  padding:6px;
  transition:0.25s;
}

.domino.horizontal{
  flex-direction:row;
  width:96px;
  height:48px;
}

.face{
  flex:1;
  display:grid;
  grid-template-columns:repeat(2,1fr);
  grid-template-rows:repeat(3,1fr);
  gap:3px;
}

.pip{
  width:6px;
  height:6px;
  background:#000;
  border-radius:50%;
  align-self:center;
  justify-self:center;
}

.back{
  background:#fff;
  border-radius:10px;
  width:48px;
  height:96px;
}

.playable{
  box-shadow:0 0 12px #00ff88;
}

.selected{
  transform:translateY(-10px);
}

#controls{
  display:flex;
  justify-content:center;
  gap:12px;
  padding:10px;
}

button{
  padding:10px 18px;
  font-size:16px;
  border:none;
  border-radius:8px;
  background:#1e88ff;
  color:#fff;
}
button:disabled{
  opacity:0.4;
}
</style>
</head>

<body>

<div id="status">Your turn</div>

<div id="computer-hand" class="hand"></div>

<div id="board">
  <div id="chain"></div>
</div>

<div id="controls">
  <button id="rotateBtn">Rotate</button>
  <button id="drawBtn">Draw Tile</button>
</div>

<div id="player-hand" class="hand"></div>

<script src="game.js"></script>
</body>
</html>
