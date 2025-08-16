const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.9, 1000);
  canvas.height = Math.min(window.innerHeight * 0.7, 500);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Load images
const playerImg = new Image();
playerImg.src = "images/player.png";

const syntaxImg = new Image();
syntaxImg.src = "images/syntax.png";

const semicolonImg = new Image();
semicolonImg.src = "images/semicolon.png";

// Player setup
let player = {
  x: 50,
  y: 0,
  width: canvas.width * 0.06,
  height: canvas.height * 0.2,
  dy: 0,
  gravity: 0.6,
  jumpPower: -12,
  grounded: false
};

// Game variables
let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;
let speed = canvas.width * 0.006;

// Keyboard + mobile controls
document.addEventListener("keydown", e => {
  if (e.code === "Space" && player.grounded && !gameOver) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
  if (e.code === "Space" && gameOver) resetGame();
});

canvas.addEventListener("touchstart", () => {
  if (player.grounded && !gameOver) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
  if (gameOver) resetGame();
});

// Draw player
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Spawn obstacles
function spawnObstacle() {
  const imgs = [syntaxImg, semicolonImg];
  const img = imgs[Math.floor(Math.random() * imgs.length)];
  obstacles.push({
    x: canvas.width,
    y: canvas.height - canvas.height * 0.1,
    width: canvas.width * 0.05,
    height: canvas.height * 0.1,
    img: img
  });
}

// Reset game
function resetGame() {
  obstacles = [];
  frame = 0;
  score = 0;
  gameOver = false;
  player.y = canvas.height - player.height;
  player.dy = 0;
  update();
}

// Main update loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    // Physics
    player.y += player.dy;
    player.dy += player.gravity;

    if (player.y + player.height >= canvas.height) {
      player.y = canvas.height - player.height;
      player.dy = 0;
      player.grounded = true;
    }

    drawPlayer();

    // Spawn obstacle every 120 frames
    if (frame % 120 === 0) {
      spawnObstacle();
    }

    // Move + draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obs = obstacles[i];
      obs.x -= speed;
      ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);

      // Collision
      if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      ) {
        gameOver = true;
      }

      // Remove + score
      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
        score++;
      }
    }

    // Increase speed gradually
    speed = canvas.width * 0.006 + Math.floor(score / 5) * 0.002;

    // Show score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    frame++;
    requestAnimationFrame(update);
  } else {
    // Game over screen
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("Tap / Press Space to Play Again", canvas.width / 2, canvas.height / 2 + 60);
  }
}

// Preload images first
let loaded = 0;
[playerImg, syntaxImg, semicolonImg].forEach(img => {
  img.onload = () => {
    loaded++;
    if (loaded === 3) {
      player.y = canvas.height - player.height;
      update();
    }
  };
});
