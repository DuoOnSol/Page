// 遊戲設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.createElement("button");
restartButton.id = "restart-btn";
restartButton.textContent = "Restart";
document.body.appendChild(restartButton);

canvas.width = 800;
canvas.height = 600;

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 5;
let ballSpeedY = -5;
let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;

// 鍵盤事件監聽
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
restartButton.addEventListener("click", restartGame);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// 繪製球
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ff00";
    ctx.fill();
    ctx.closePath();
}

// 繪製拍子
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// 繪製磚塊
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 碰撞檢測
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ballX > b.x &&
                    ballX < b.x + brickWidth &&
                    ballY > b.y &&
                    ballY < b.y + brickHeight
                ) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        endGame(true);
                    }
                }
            }
        }
    }
}

// 結束遊戲
function endGame(win) {
    ballSpeedX = 0;
    ballSpeedY = 0;
    restartButton.style.display = "block";
    restartButton.style.position = "absolute";
    restartButton.style.bottom = "20px";
    restartButton.style.right = "20px";
    restartButton.style.zIndex = "1000";
    canvas.style.opacity = 0.6;
}

// 重新開始遊戲
function restartGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 5;
    ballSpeedY = -5;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;

    // 重置所有磚塊
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }

    restartButton.style.display = "none";
    canvas.style.opacity = 1;
    draw();
}

// 繪製遊戲
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // 球的邊界檢查
    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballSpeedY > canvas.height - ballRadius - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            endGame(false);
        }
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 拍子移動
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}

// 開始遊戲
draw();
