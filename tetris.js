// @ts-nocheck
const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20; // 200 / 10 = 20px

// Bentuk balok Tetris
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
];

const COLORS = [
    "#06b6d4", // Cyan
    "#eab308", // Yellow
    "#a855f7", // Purple
    "#f97316", // Orange
    "#3b82f6", // Blue
    "#22c55e", // Green
    "#ef4444"  // Red
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let currentPiece = null;
let dropCounter = 0;
let lastTime = 0;
let gameOver = false;

function createPiece() {
    const index = Math.floor(Math.random() * SHAPES.length);
    return {
        matrix: SHAPES[index],
        color: COLORS[index],
        x: Math.floor(COLS / 2) - Math.ceil(SHAPES[index][0].length / 2),
        y: 0
    };
}

function collide(arena, piece) {
    const m = piece.matrix;
    const o = { x: piece.x, y: piece.y };
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(arena, piece) {
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + piece.y][x + piece.x] = piece.color;
            }
        });
    });
}

function rotate(matrix) {
    return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
}

function playerRotate() {
    if (gameOver) return;
    const posX = currentPiece.x;
    let offset = 1;
    const originalMatrix = currentPiece.matrix;
    currentPiece.matrix = rotate(currentPiece.matrix);

    while (collide(board, currentPiece)) {
        currentPiece.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > currentPiece.matrix[0].length) {
            currentPiece.matrix = originalMatrix;
            currentPiece.x = posX;
            return;
        }
    }
}

function playerMove(dir) {
    if (gameOver) return;
    currentPiece.x += dir;
    if (collide(board, currentPiece)) {
        currentPiece.x -= dir;
    }
}

function playerDrop() {
    if (gameOver) return;
    currentPiece.y++;
    if (collide(board, currentPiece)) {
        currentPiece.y--;
        merge(board, currentPiece);
        clearLines();
        resetPiece();
    }
    dropCounter = 0;
}

function hardDrop() {
    if (gameOver) return;
    while (!collide(board, currentPiece)) {
        currentPiece.y++;
    }
    currentPiece.y--;
    merge(board, currentPiece);
    clearLines();
    resetPiece();
    dropCounter = 0;
}

function clearLines() {
    let rowsCleared = 0;
    outer: for (let y = board.length - 1; y >= 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) continue outer;
        }
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;
        rowsCleared++;
    }
    if (rowsCleared > 0) {
        score += rowsCleared * 100;
        scoreDisplay.textContent = score.toString();
    }
}

function resetPiece() {
    currentPiece = createPiece();
    if (collide(board, currentPiece)) {
        gameOver = true;
        alert(`Game Over! Skor kamu: ${score}`);
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        score = 0;
        scoreDisplay.textContent = "0";
        gameOver = false;
    }
}

function drawMatrix(matrix, offset, color = null) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = color || value;
                ctx.fillRect((x + offset.x) * BLOCK_SIZE + 1, (y + offset.y) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
                ctx.strokeRect((x + offset.x) * BLOCK_SIZE + 1, (y + offset.y) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
        });
    });
}

function draw() {
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(board, { x: 0, y: 0 });

    if (currentPiece) {
        drawMatrix(currentPiece.matrix, { x: currentPiece.x, y: currentPiece.y }, currentPiece.color);
    }
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > 800) {
        playerDrop();
    }

    draw();
    if (!gameOver) requestAnimationFrame(update);
}

// Tombol Virtual HP
document.getElementById("btnLeft")?.addEventListener("click", () => playerMove(-1));
document.getElementById("btnRight")?.addEventListener("click", () => playerMove(1));
document.getElementById("btnDown")?.addEventListener("click", () => playerDrop());
document.getElementById("btnRotate")?.addEventListener("click", () => playerRotate());
document.getElementById("btnDrop")?.addEventListener("click", () => hardDrop());

// Inisialisasi awal
resetPiece();
update();
