const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive canvas size
canvas.width = window.innerWidth > 500 ? 500 : window.innerWidth - 20;
canvas.height = window.innerHeight > 250 ? 250 : window.innerHeight - 40;

// Fill page background black
document.body.style.backgroundColor = "black";

// ================= Images =================
const playerImg = new Image();
playerImg.src = "images/player.png";

const obstacleImgs = ["images/syntax.png", "images/semicolon.png"].map(src => {
  let img = new Image();
  img.src = src;
  return img;
});

// ================= Player =================
let player = {
  x: 50,
  y: 0,
  width: canvas.width * 0.08,
  height: canvas.height * 0.35,
  dy: 0,
  gravity: 0.6,
  jumpPower: -10,
  grounded: true
};
player.y = canvas.height - player.height;

// ================= Obstacles =================
let obstacles = [];
let obstacleTimer = 0;
let obstacleInterval = 100;

// ================= Game State =================
let score = 0;
let gameOver = false;
let gameStarted = false;

// ================= Functions =================
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObstacle(obs) {
  ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);
}

function spawnObstacle() {
  const img = obstacleImgs[Math.floor(Math.random() * obstacleImgs.length)];
  const obs = {
    x: canvas.width,
    y: canvas.height - canvas.height * 0.15,
    width: canvas.width * 0.1,
    height: canvas.height * 0.15,
    img: img
  };
  obstacles.push(obs);
}

function detectCollision(p, obs) {
  return (
    p.x < obs.x + obs.width &&
    p.x + p.width > obs.x &&
    p.y < obs.y + obs.height &&
    p.y + p.height > obs.y
  );
}

function resetGame() {
  score = 0;
  obstacles = [];
  obstacleTimer = 0;
  gameOver = false;
  player.y = canvas.height - player.height;
  player.dy = 0;
  gameStarted = false;
}

function startGame() {
  gameStarted = true;
  gameOver = false;
  score = 0;
  obstacles = [];
  obstacleTimer = 0;
  requestAnimationFrame(update);
}

// ================= Game Loop =================
function update() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tap/Click to Play", canvas.width / 2, canvas.height / 2);
    return;
  }

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over! Score: " + score, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Tap/Click to Play Again", canvas.width / 2, canvas.height / 2 + 20);
    return;
  }

  // Player physics
  player.y += player.dy;
  player.dy += player.gravity;
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Draw player
  drawPlayer();

  // Obstacles
  obstacleTimer++;
  if (obstacleTimer >= obstacleInterval) {
    spawnObstacle();
    obstacleTimer = 0;
  }

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= canvas.width * 0.01; // speed
    drawObstacle(obs);

    if (detectCollision(player, obs)) {
      gameOver = true;
    }
  }

  // Remove passed obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Score
  if (!gameOver) score++;
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 20);

  requestAnimationFrame(update);
}

// ================= Controls =================
canvas.addEventListener("click", () => {
  if (!gameStarted) {
    startGame();
  } else if (gameOver) {
    resetGame();
    startGame();
  } else if (player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

// Mobile support (touch)
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (!gameStarted) {
    startGame();
  } else if (gameOver) {
    resetGame();
    startGame();
  } else if (player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
}, { passive: false });

