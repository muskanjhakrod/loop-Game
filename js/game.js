const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const jumpBtn = document.getElementById("jumpBtn");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const playBtn = document.getElementById("playBtn");

// Resize canvas to fit container
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.8; // 80% of screen
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game variables
let player, obstacles, score, gameOver, gameStarted, obstacleImages;

function init() {
  player = {
  x: 50,
  y: canvas.height - playerHeight,
  width: playerWidth,
  height: playerHeight,
  color: "blue",
  dy: 0,
  gravity: 0.6,
  jumpPower: -14,
  grounded: true
};

  obstacles = [];
  score = 0;
  gameOver = false;
  gameStarted = false;
}

// Player setup with fixed aspect ratio
let playerHeight = canvas.height * 0.20;
let playerWidth = playerHeight * 0.8; // maintain ratio (not stretched)

function startGame() {
  init();
  overlay.style.display = "none";
  gameStarted = true;
  loop();
}

function resetGame() {
  init();
  overlay.style.display = "none";
  gameStarted = true;
  loop();
}

// Load images
const playerImg = new Image();
playerImg.src = "images/player.png";

const syntaxImg = new Image();
syntaxImg.src = "images/syntax.png";

const semicolonImg = new Image();
semicolonImg.src = "images/semicolon.png";

obstacleImages = [syntaxImg, semicolonImg];

function drawBackground() {
  // Fill background color first
  ctx.fillStyle = "#111"; // canvas background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add background text
  ctx.font = `${canvas.width * 0.08}px Arial`;  // font size relative to screen
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";   // light transparent text
  ctx.textAlign = "center";
  ctx.fillText("My Coding Game", canvas.width / 2, canvas.height / 2);
}

function drawPlayer() {
  if (playerImg.complete) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

function drawObstacles() {
  obstacles.forEach(obs => {
    if (obs.img.complete) {
      ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  });
}

function spawnObstacle() {
  let size = canvas.height * 0.09;
  let obs = {
    x: canvas.width,
    y: canvas.height - size,
    width: canvas.width * 0.04,
    height: size,
    img: obstacleImages[Math.floor(Math.random() * obstacleImages.length)],
  };
  obstacles.push(obs);
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function spawnObstacle() {
  const size = 40 + Math.random() * 30;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size,
    width: size,
    height: size,
    img: Math.random() > 0.5 ? syntaxImg : semicolonImg,
    passed: false   // new property
  });
}



let lastSpawn = Date.now();
let spawnInterval = 2000; // ms
let gameSpeed = 5;

function update() {
  if (!gameStarted || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === Draw Background (color + text) ===
  ctx.fillStyle = "black"; // canvas bg
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add faint background text
  ctx.font = `${canvas.width * 0.08}px Arial`;
  ctx.fillStyle = "white"; // transparent text
  ctx.textAlign = "center";
  ctx.fillText("Abhudaya coding club", canvas.width / 2, canvas.height / 2);

  // Player physics
  player.y += player.dy;
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  } else {
    player.dy += player.gravity;
  }

  // Draw player
  drawPlayer();

  // Spawn obstacles
  if (Date.now() - lastSpawn > spawnInterval) {
    spawnObstacle();
    lastSpawn = Date.now();
  }

  // Move obstacles
  obstacles.forEach(obs => {
    obs.x -= gameSpeed;
    
     // Score +10 if player is above obstacle when passing
  if (!obs.passed && obs.x + obs.width < player.x) {
    if (player.y + player.height <= obs.y) {  
      // player was above obstacle
      score += 10;
    }
    obs.passed = true; // mark as counted
  }

  });

  // Remove off-screen
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Draw obstacles
  drawObstacles();

  // Collision
  for (let obs of obstacles) {
    if (checkCollision(player, obs)) {
      gameOver = true;
      overlay.style.display = "flex";
      overlayText.innerHTML = `Game Over<br>Score: ${score}`;
      playBtn.innerText = "Play Again";
    }
  }

  // Score


  scoreBoard.innerText = `Score: ${score}`;

  requestAnimationFrame(update);
}

function loop() {
  requestAnimationFrame(update);
}

// Controls
window.addEventListener("keydown", e => {
  if (e.code === "Space" && player.grounded && !gameOver && gameStarted) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

jumpBtn.addEventListener("click", () => {
  if (player.grounded && !gameOver && gameStarted) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

playBtn.addEventListener("click", () => {
  if (!gameStarted || gameOver) {
    resetGame();
  }
});

// Start overlay visible at beginning
overlay.style.display = "flex";
overlayText.innerText = "Run from the Infinite Loop";
playBtn.innerText = "Play";
