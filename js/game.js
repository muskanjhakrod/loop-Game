const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ----- Player Setup -----
let player = {
  x: 50,
  y: 300,
  width: 120,
  height: 150,
  dy: 0,
  gravity: 0.6,
  jumpPower: -15,
  grounded: true
};

// Responsive canvas
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.95; // 95% of screen width
  canvas.height = window.innerHeight * 0.6; // 60% of screen height

  // Scale player and obstacles according to new canvas size
  player.width = canvas.width * 0.06;
  player.height = canvas.height * 0.2;

  obsWidth = canvas.width * 0.05;   // default obstacle width
  obsHeight = canvas.height * 0.1;  // default obstacle height

  speed = canvas.width * 0.006;     // obstacle movement speed
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();



// Load player image
const playerImg = new Image();
playerImg.src = "images/player.png"; // Replace with your player image path

// ----- Obstacles Setup -----
let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Load obstacle images
const obstacleImages = [
  "images/syntax.png",
  "images/semicolon.png"
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

// ----- Controls -----
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (!gameOver && player.grounded) {
      // Jump
      player.dy = player.jumpPower;
      player.grounded = false;
    } else if (gameOver) {
      // Restart game
      restartGame();
    }
  }
});

// Mobile touch
document.addEventListener("touchstart", function (e) {
  e.preventDefault(); // prevent scrolling
  if (!gameOver && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  } else if (gameOver) {
    restartGame();
  }
}, { passive: false });

// ----- Collision Detection -----
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ----- Restart Game -----
function restartGame() {
  player.y = 300;
  player.dy = 0;
  player.grounded = true;
  obstacles = [];
  frame = 0;
  score = 0;
  gameOver = false;
  update();
}

// ----- Game Update Loop -----
function update() {
  if (gameOver) {
    // Game Over Screen
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);

    ctx.font = "20px Arial";
    ctx.fillText("Press Space to Play Again", canvas.width / 2, canvas.height / 2 + 50);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player physics
  player.y += player.dy;
  player.dy += player.gravity;

  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Spawn obstacles every 120 frames
  if (frame % 120 === 0) {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - 40,
      width: 40,
      height: 40
    });
  }

  // Move and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];

    // Assign random image once
    if (!obs.img) {
      obs.img = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    }

    obs.x -= 5;
    ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);

    // Collision check
    if (checkCollision(player, obs)) {
      gameOver = true;
    }
  }

  // Remove off-screen obstacles and update score
  obstacles = obstacles.filter(obs => {
    if (obs.x + obs.width > 0) {
      return true;
    } else {
      score++;
      return false;
    }
  });

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 70, 30);

  frame++;
  requestAnimationFrame(update);
}

update();
