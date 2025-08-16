const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fit screen but slightly smaller
canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth - 30;
canvas.height = window.innerHeight > 300 ? 300 : window.innerHeight - 60;

// Load images
const playerImg = new Image();
playerImg.src = "images/player.png";

const obsImg1 = new Image();
obsImg1.src = "images/syntax.png";

const obsImg2 = new Image();
obsImg2.src = "images/semicolon.png";

// Player setup
let player = {
  x: 40,
  y: canvas.height - 110,
  width: 70,
  height: 90,
  dy: 0,
  gravity: 0.6,
  jumpPower: -12,
  grounded: true
};

// Obstacles
let obstacles = [];
let obstacleSpeed = 6;

// Score
let score = 0;
let gameOver = false;
let gameStarted = false;

// Input
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.grounded && gameStarted) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

// canvas.addEventListener("click", () => {
//   if (!gameStarted) {
//     startGame();
//   } else if (gameOver) {
//     resetGame();
//   } else if (player.grounded) {
//     player.dy = player.jumpPower;
//     player.grounded = false;
//   }
// });

function handleInput() {
  if (!gameStarted) {
    startGame();
  } else if (gameOver) {
    resetGame();
  } else if (player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
}

// ✅ Desktop: Mouse
canvas.addEventListener("click", handleInput);

// ✅ Desktop: Keyboard
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    handleInput();
  }
});

// ✅ Mobile: Touch
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // prevent screen scroll/zoom
  handleInput();
}, { passive: false });






// Draw player
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Draw obstacles
function drawObstacles() {
  obstacles.forEach((obs) => {
    let img = obs.type === 1 ? obsImg1 : obsImg2;
    ctx.drawImage(img, obs.x, obs.y, obs.width, obs.height);
  });
}

// Spawn obstacle
function spawnObstacle() {
  let size = 40;
  let type = Math.random() > 0.5 ? 1 : 2;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size - 30,
    width: size,
    height: size,
    type: type
  });
}

// Collision check
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Update game
function update() {
  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  if (gameOver) {
    drawGameOver();
    return;
  }

  // Clear canvas with white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gravity
  player.y += player.dy;
  if (player.y + player.height < canvas.height - 30) {
    player.dy += player.gravity;
    player.grounded = false;
  } else {
    player.y = canvas.height - player.height - 30;
    player.dy = 0;
    player.grounded = true;
  }

  // Move obstacles
  obstacles.forEach((obs) => {
    obs.x -= obstacleSpeed;

    if (checkCollision(player, obs)) {
      gameOver = true;
    }
  });

  obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);

  // Score
  score++;

  // Draw everything
  drawPlayer();
  drawObstacles();

  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 15, 25);

  requestAnimationFrame(update);
}

// Start screen
function drawStartScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "26px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Tap to Play", canvas.width / 2, canvas.height / 2);
}

// Game over
function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 30);

  ctx.fillStyle = "black";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);
  ctx.fillText("Tap to Play Again", canvas.width / 2, canvas.height / 2 + 50);
}

// Start game
function startGame() {
  gameStarted = true;
  gameOver = false;
  score = 0;
  obstacles = [];
  player.y = canvas.height - player.height - 30;

  setInterval(spawnObstacle, 2000);
  update();
}

// Reset game
function resetGame() {
  gameOver = false;
  score = 0;
  obstacles = [];
  player.y = canvas.height - player.height - 30;
  update();
}

// Show start screen initially
drawStartScreen();
