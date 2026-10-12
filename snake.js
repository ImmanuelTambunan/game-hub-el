// @ts-nocheck
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const pauseBtn = document.getElementById("btnPause");

const gridSize = 15; // 300 / 15 = 20x20 petak
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval = null;
let isPaused = false;
let isGameOver = false;

// Render tampilan canvas utama
function drawCanvas() {
    // Bersihkan layar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar Apel Merah
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc((food.x * gridSize) + gridSize / 2, (food.y * gridSize) + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Gambar Ular Hijau Neon
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#34d399" : "#10b981";
        ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });
}

// Game Loop per frame waktu
function gameLoop() {
    if (isPaused || isGameOver) return;

    moveSnake();

    if (checkGameOver()) {
        isGameOver = true;
        if (gameInterval) clearInterval(gameInterval);
        setTimeout(() => {
            alert(`Game Over! Skor kamu: ${score}`);
            resetGame();
        }, 30);
        return;
    }

    drawCanvas();
}

function moveSnake() {
    if (dx === 0 && dy === 0) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score.toString();
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) spawnFood();
    });
}

function checkGameOver() {
    if (dx === 0 && dy === 0) return false;

    const head = snake[0];

    // Cek tabrak dinding
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Cek tabrak ekor/tubuh sendiri
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = "0";
    isGameOver = false;
    isPaused = false;
    if (pauseBtn) {
        pauseBtn.textContent = "⏸ Pause";
        pauseBtn.style.background = "#f59e0b";
    }
    spawnFood();
    drawCanvas();
    startGame();
}

function changeDirection(nextX, nextY) {
    if (isPaused || isGameOver) return;
    if (dx === -nextX && dx !== 0) return;
    if (dy === -nextY && dy !== 0) return;
    dx = nextX;
    dy = nextY;
}

// Fitur Pause & Lanjut
function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;

    if (isPaused) {
        if (pauseBtn) {
            pauseBtn.textContent = "▶ Lanjut";
            pauseBtn.style.background = "#10b981";
        }
        // Gambar overlay teks PAUSED
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    } else {
        if (pauseBtn) {
            pauseBtn.textContent = "⏸ Pause";
            pauseBtn.style.background = "#f59e0b";
        }
        drawCanvas();
    }
}

// Event Tombol Virtual D-Pad
document.getElementById("btnUp")?.addEventListener("click", () => changeDirection(0, -1));
document.getElementById("btnDown")?.addEventListener("click", () => changeDirection(0, 1));
document.getElementById("btnLeft")?.addEventListener("click", () => changeDirection(-1, 0));
document.getElementById("btnRight")?.addEventListener("click", () => changeDirection(1, 0));
pauseBtn?.addEventListener("click", togglePause);

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 120);
}

// Inisialisasi awal
spawnFood();
drawCanvas();
startGame();
