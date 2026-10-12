const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const gridSize = 15; // Ukuran tiap kotak (300 / 15 = 20x20 petak)
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval = null;

// Gambar Game Loop
function drawGame() {
    moveSnake();

    if (checkGameOver()) {
        if (gameInterval) clearInterval(gameInterval);
        alert(`Game Over! Skor kamu: ${score}`);
        resetGame();
        return;
    }

    // Bersihkan layar canvas
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar Makanan (Apel Merah)
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc((food.x * gridSize) + gridSize / 2, (food.y * gridSize) + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Gambar Ular (Hijau Neon)
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#34d399" : "#10b981";
        ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    // Jika belum mulai jalan, jangan gerak
    if (dx === 0 && dy === 0) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Cek jika makan apel
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
    // Pastikan apel tidak muncul di tubuh ular
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) spawnFood();
    });
}

function checkGameOver() {
    if (dx === 0 && dy === 0) return false;

    const head = snake[0];

    // Tabrak dinding
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Tabrak tubuh sendiri
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
    spawnFood();
    startGame();
}

/**
 * Mengubah arah gerakan ular
 * @param {number} nextX
 * @param {number} nextY
 */
function changeDirection(nextX, nextY) {
    // Cegah putar balik 180 derajat langsung
    if (dx === -nextX && dx !== 0) return;
    if (dy === -nextY && dy !== 0) return;
    dx = nextX;
    dy = nextY;
}

// Event Tombol Virtual (HP Touch)
document.getElementById("btnUp")?.addEventListener("click", () => changeDirection(0, -1));
document.getElementById("btnDown")?.addEventListener("click", () => changeDirection(0, 1));
document.getElementById("btnLeft")?.addEventListener("click", () => changeDirection(-1, 0));
document.getElementById("btnRight")?.addEventListener("click", () => changeDirection(1, 0));

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, 120);
}

// Inisialisasi awal
spawnFood();
startGame();
