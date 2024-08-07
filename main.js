const gameOptions = {
  width: 1000,
  height: 600,
  backgroundColor: "#141719",
  fps: 60,
  contextType: "2d",
};

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#pong");
const ctx = canvas.getContext(gameOptions.contextType);

const playerOne = {
    x: gameOptions.width * 0.05,
    y: gameOptions.height * 0.5 - 50,
    width: 10,
    height: 100,
    color: "#ffffff",
    velocity: 5,
    score: 0,
  },
  playerTwo = {
    x: gameOptions.width * 0.95 - 10,
    y: gameOptions.height * 0.5 - 50,
    width: 10,
    height: 100,
    color: "#ffffff",
    velocity: 5,
    score: 0,
  },
  ball = {
    x: 0,
    y: 0,
    xOrientation: 0,
    yOrientation: 0,
    width: 10,
    height: 10,
    color: "#ffffff",
    velocity: 5,
  };

const input = Object.freeze({
  up: "up",
  down: "down",
  none: "none",
});

const speedDifficultyFactor = 3;
let round = 1;
let keyPressed = input.none;

function setup() {
  canvas.width = gameOptions.width;
  canvas.height = gameOptions.height;

  setupInput();
  resetBall();

  setInterval(loop, 1000 / gameOptions.fps);
}

function setupInput() {
  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) return;
    const code = event.code;

    if (code === "KeyW" || code === "ArrowUp") {
      return (keyPressed = input.up);
    } else if (code === "KeyS" || code === "ArrowDown") {
      return (keyPressed = input.down);
    }
  });

  window.addEventListener("keyup", (_) => {
    return (keyPressed = input.none);
  });
}

function drawRect({ x, y, w, h, color = "#ffffff" }) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#000000";
}

function drawText({
  text,
  x,
  y,
  color = "#ffffff",
  fontSize = 48,
  font = "Open Sans",
}) {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${font}`;
  // center width origin point on texts
  const metrics = ctx.measureText(text);
  const width = metrics.width;
  ctx.fillText(text, x - width * 0.5, y);
  ctx.fillStyle = "#000000";
}

function resetBall() {
  ball.x = gameOptions.width * 0.5;
  ball.y = gameOptions.height * 0.5;

  ball.xOrientation = Math.pow(2, Math.floor(Math.random() * 2) + 1) - 3;
  ball.yOrientation = Math.pow(2, Math.floor(Math.random() * 2) + 1) - 3;
}

function lerp(start, end, time) {
  return start * (1 - time) + end * time;
}

function botAI() {
  playerTwo.y = lerp(playerTwo.y - playerTwo.height * 0.5, ball.y, 0.5);

  if (playerTwo.y + playerTwo.height >= gameOptions.height) {
    playerTwo.y = gameOptions.height - playerTwo.height;
  } else if (playerTwo.y <= 0) {
    playerTwo.y = 0;
  }
}

function playerMovement() {
  if (keyPressed === input.up && playerOne.y >= 0) {
    playerOne.y -= playerOne.velocity;
  } else if (
    keyPressed === input.down &&
    playerOne.y + playerOne.height <= gameOptions.height
  ) {
    playerOne.y += playerOne.velocity;
  }

  if (ball.y + 10 >= gameOptions.height || ball.y <= 0) {
    ball.yOrientation *= -1;
  }
}

function ballPlayerCollision() {
  if (
    ball.x >= playerOne.x &&
    ball.x <= playerOne.x + 10 &&
    ball.y >= playerOne.y &&
    ball.y <= playerOne.y + playerOne.height
  ) {
    ball.xOrientation = 1;
  } else if (
    ball.x + 10 >= playerTwo.x &&
    ball.x <= playerTwo.x &&
    ball.y >= playerTwo.y &&
    ball.y <= playerTwo.y + playerTwo.height
  ) {
    ball.xOrientation = -1;
  }
}

function ballScoreCollision() {
  if (ball.x <= 0) {
    playerTwo.score += 1;
    resetBall();
    return;
  }

  if (ball.x >= gameOptions.width) {
    playerOne.score += 1;
    if (playerOne.score % 5 === 0) ball.velocity += speedDifficultyFactor;
    resetBall();
    return;
  }
}

function ballMovement() {
  ball.x += (speedDifficultyFactor + ball.velocity) * ball.xOrientation;
  ball.y += (speedDifficultyFactor + ball.velocity) * ball.yOrientation;
}

function update() {
  playerMovement();
  ballPlayerCollision();
  ballScoreCollision();
  ballMovement();
  botAI();
}

function draw() {
  // Clear screen
  drawRect({
    x: 0,
    y: 0,
    w: gameOptions.width,
    h: gameOptions.height,
    color: gameOptions.backgroundColor,
  });

  // Ball
  drawRect({
    x: ball.x,
    y: ball.y,
    w: ball.width,
    h: ball.height,
  });

  // Player 1
  drawRect({
    x: playerOne.x,
    y: playerOne.y,
    w: playerOne.width,
    h: playerOne.height,
    color: playerOne.color,
  });

  // Player 2
  drawRect({
    x: playerTwo.x,
    y: playerTwo.y,
    w: playerTwo.width,
    h: playerTwo.height,
    color: playerTwo.color,
  });

  // Player 1 score
  drawText({
    text: playerOne.score,
    x: Math.floor(gameOptions.width * 0.25),
    y: 100,
  });

  // Player 2 score
  drawText({
    text: playerTwo.score,
    x: Math.floor(gameOptions.width * 0.75),
    y: 100,
  });

  // Current round
  drawText({
    text: `Round ${round}`,
    x: gameOptions.width * 0.5 + 10,
    y: 30,
    fontSize: 24,
  });

  // segmented dots centered on screen
  const centeredSegmentSize = 25;
  for (let i = 0; i < centeredSegmentSize; i++) {
    drawRect({
      x: gameOptions.width * 0.5,
      y: gameOptions.height * 0.12 + i * 20,
      w: 10,
      h: 10,
    });
  }
}

function loop() {
  update();
  draw();
}

setup();
