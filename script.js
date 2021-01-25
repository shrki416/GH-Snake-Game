"use strict";
const WIDTH = 300;
const HEIGHT = 150;
const GRID_UNIT = 10;

let score = 0;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

let highScore = localStorage.getItem("highScore");

let food = {
  x: Math.floor((Math.random() * WIDTH) / GRID_UNIT) * GRID_UNIT,
  y: Math.floor((Math.random() * HEIGHT) / GRID_UNIT) * GRID_UNIT,
};

let snake = {
  body: [
    { x: 5 * GRID_UNIT, y: 5 * GRID_UNIT },
    { x: 5 * GRID_UNIT, y: 5 * GRID_UNIT },
    { x: 5 * GRID_UNIT, y: 5 * GRID_UNIT },
    { x: 5 * GRID_UNIT, y: 5 * GRID_UNIT },
  ],
  direction: null,
};

setInterval(gamePlay, 1000 / GRID_UNIT);

const playAgainBtn = document.getElementById("playAgainBtn");
playAgainBtn.addEventListener("click", () => document.location.reload());

document.addEventListener("keydown", keyDownHandler);
function keyDownHandler(e) {
  switch (e.key) {
    case "ArrowRight":
      if (snake.direction !== "left") snake.direction = "right";
      break;
    case "ArrowLeft":
      if (snake.direction !== "right") snake.direction = "left";
      break;
    case "ArrowUp":
      if (snake.direction !== "down") snake.direction = "up";
      break;
    case "ArrowDown":
      if (snake.direction !== "up") snake.direction = "down";
      break;
    case "Enter":
      document.location.reload();
      break;
  }
  document.querySelector(".gameInstructionsModal").classList.add("hidden");
}

function gamePlay() {
  drawEverything();
  moveEverything();
  if (boundaryDetection()) gameOver();
  updateScore();
}

function drawEverything() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawSnake();
  drawFood();
}

function moveEverything() {
  if (!boundaryDetection()) {
    switch (snake.direction) {
      case "right":
        snake.body[0].x += GRID_UNIT;
        break;
      case "left":
        snake.body[0].x -= GRID_UNIT;
        break;
      case "up":
        snake.body[0].y -= GRID_UNIT;
        break;
      case "down":
        snake.body[0].y += GRID_UNIT;
        break;
    }
    snake.body.pop();

    addSnakePiece();

    if (snakeEatsFood()) {
      score++;
      addSnakePiece();
      resetFood();
    }
  }
}

function boundaryDetection() {
  return (
    snake.body[0].x > WIDTH - GRID_UNIT ||
    snake.body[0].x < 0 ||
    snake.body[0].y > HEIGHT - GRID_UNIT ||
    snake.body[0].y < 0
  );
}

function gameOver() {
  const newBest = document.querySelector(".newBest");
  document.querySelector(".gameOverModal").classList.remove("hidden");

  document.body.classList.add("noscroll");

  if (highScore) {
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      newBest.textContent = `CONGRATULATIONS! \n NEW HIGH SCORE: \n ${score}`;
      newBest.classList.remove("hidden");
      document.querySelector(".trophy").classList.remove("hidden");
    }
  } else {
    localStorage.setItem("highScore", score);
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score ${score}`;
  highScore ? (highScoreDisplay.textContent = `High Score ${highScore}`) : null;
}

function drawSnake() {
  for (let i = 0; i < snake.body.length; i++) {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(snake.body[i].x, snake.body[i].y, GRID_UNIT, GRID_UNIT);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake.body[i].x, snake.body[i].y, GRID_UNIT, GRID_UNIT);
    if (boundaryDetection()) {
      ctx.fillStyle = "red";
      ctx.fillRect(snake.body[i].x, snake.body[i].y, GRID_UNIT, GRID_UNIT);
    }
  }
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, GRID_UNIT, GRID_UNIT);
}

function addSnakePiece() {
  return snake.body.unshift({ x: snake.body[0].x, y: snake.body[0].y });
}

function snakeEatsFood() {
  return snake.body[0].x === food.x && snake.body[0].y === food.y;
}

function resetFood() {
  food = {
    x: Math.floor((Math.random() * WIDTH) / GRID_UNIT) * GRID_UNIT,
    y: Math.floor((Math.random() * HEIGHT) / GRID_UNIT) * GRID_UNIT,
  };
}
