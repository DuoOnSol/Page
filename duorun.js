const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const DUO_HEIGHT = 32;
const DUO_WIDTH = 32;
const CYBERTRUCK_WIDTH = 64 * 1.45;
const CYBERTRUCK_HEIGHT = 32 * 1.45;
const JUMP_HEIGHT = CYBERTRUCK_HEIGHT * 5;
const MIN_GAP = CYBERTRUCK_WIDTH + 50;
const INITIAL_JUMP_VELOCITY = -18;
const SECOND_JUMP_VELOCITY = -9;
const GLIDE_REDUCE = -5;

let duoX = 100;
let duoY = canvas.height - DUO_HEIGHT;
let isJumping = false;
let jumpVelocity = 0;
let maxJumpHeight = canvas.height - DUO_HEIGHT - JUMP_HEIGHT;
let canDoubleJump = true;
let firstJumpDone = false;
let isGliding = false;

let trucks = [];
let rockets = [];
let score = 0;
let isGameOver = false;
let gameStarted = false;

// 初始化圖片
const duoImg = new Image();
duoImg.src = "./img/duo.png";

const truckImg = new Image();
truckImg.src = "./img/cybertruck.png";

const sparkImg = new Image();
sparkImg.src = "./img/spark.png";

const rocketImg = new Image();
rocketImg.src = "./img/rocket.png";

const backgroundImg = new Image();
backgroundImg.src = "./img/road.png";

const deathSound = new Audio("./audio/death.mp3");
const bgMusic = new Audio("./audio/music.mid");
bgMusic.loop = true;
bgMusic.volume = 0.5;

// 初始化卡車
function resetTrucks() {
    trucks = [
        { 
            x: canvas.width, 
            y: canvas.height - CYBERTRUCK_HEIGHT, 
            speed: 6, 
            verticalSpeed: 2, 
            originalY: canvas.height - CYBERTRUCK_HEIGHT,
            direction: 1 
        },
        { 
            x: canvas.width + 300, 
            y: canvas.height - CYBERTRUCK_HEIGHT, 
            speed: 4 
        }
    ];
}

// 初始化火箭
function resetRockets() {
    rockets = [
        {
            x: canvas.width + 500,
            y: Math.random() * (canvas.height - 200),
            speed: 8,
            verticalSpeed: 2,
            direction: Math.random() < 0.5 ? 1 : -1
        }
    ];
}

// 重置遊戲狀態
function resetGame() {
    duoY = canvas.height - DUO_HEIGHT;
    jumpVelocity = 0;
    isJumping = false;
    isGliding = false;
    score = 0;
    isGameOver = false;
    gameStarted = false;
    resetTrucks();
    resetRockets();
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("startHint").style.display = "block";
    document.getElementById("intro-image").style.display = "block";
    bgMusic.currentTime = 0;
    bgMusic.pause();
}

// 畫背景
function drawBackground() {
    ctx.globalAlpha = 0.3;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
}

// 畫 Duo
function drawDuo() {
    if (gameStarted) {
        ctx.drawImage(duoImg, duoX, duoY, DUO_WIDTH, DUO_HEIGHT);
    }
}

// 畫卡車
function drawTrucks() {
    if (gameStarted) {
        trucks.forEach((truck, index) => {
            if (index === 0) {
                const laneHeight = CYBERTRUCK_HEIGHT * 3;
                truck.y += truck.verticalSpeed * truck.direction;

                if (truck.y > truck.originalY || truck.y < truck.originalY - laneHeight) {
                    truck.direction *= -1;
                }
            }

            ctx.drawImage(truckImg, truck.x, truck.y, CYBERTRUCK_WIDTH, CYBERTRUCK_HEIGHT);
        });
    }
}

// 畫火箭
function drawRockets() {
    if (gameStarted) {
        rockets.forEach(rocket => {
            ctx.drawImage(rocketImg, rocket.x, rocket.y, 80, 40);
        });
    }
}

// 畫火花
function drawSpark(x, y) {
    ctx.drawImage(sparkImg, x, y, 200, 200);
}

// 遊戲更新邏輯
function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (isJumping) {
        duoY += jumpVelocity;
        jumpVelocity += 0.5;

        if (isGliding && jumpVelocity > 0) {
            jumpVelocity += GLIDE_REDUCE;
        }

        if (duoY >= canvas.height - DUO_HEIGHT) {
            duoY = canvas.height - DUO_HEIGHT;
            isJumping = false;
            canDoubleJump = true;
            firstJumpDone = false;
            isGliding = false;
        }
    }

    // 移動卡車
    trucks.forEach(truck => {
        truck.x -= truck.speed;
        
        if (truck.x < -CYBERTRUCK_WIDTH) {
            truck.x = canvas.width + Math.random() * 300;
            truck.speed = 4 + Math.random() * 4;
            score += 100;
        }

        if (
            duoX < truck.x + CYBERTRUCK_WIDTH &&
            duoX + DUO_WIDTH > truck.x &&
            duoY < truck.y + CYBERTRUCK_HEIGHT &&
            duoY + DUO_HEIGHT > truck.y
        ) {
            isGameOver = true;
            deathSound.play();
            bgMusic.pause();
            drawSpark(duoX - 80, duoY - 100);
            document.getElementById("gameOver").style.display = "block";
            return;
        }
    });

    // 移動火箭
    rockets.forEach(rocket => {
        rocket.x -= rocket.speed;
        rocket.y += rocket.verticalSpeed * rocket.direction;

        if (rocket.y <= 0 || rocket.y >= canvas.height - 40) {
            rocket.direction *= -1;
        }

        if (rocket.x < -80) {
            rocket.x = canvas.width + Math.random() * 300;
            rocket.y = Math.random() * (canvas.height - 200);
        }

        if (
            duoX < rocket.x + 80 &&
            duoX + DUO_WIDTH > rocket.x &&
            duoY < rocket.y + 40 &&
            duoY + DUO_HEIGHT > rocket.y
        ) {
            isGameOver = true;
            deathSound.play();
            bgMusic.pause();
            drawSpark(duoX - 80, duoY - 100);
            document.getElementById("gameOver").style.display = "block";
            return;
        }
    });

    drawDuo();
    drawTrucks();
    drawRockets();
    document.getElementById("score").innerText = "Score: " + score;
    requestAnimationFrame(update);
}

// 監聽 Space 按鍵
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
            isJumping = true;
            jumpVelocity = INITIAL_JUMP_VELOCITY;
            canDoubleJump = true;
            firstJumpDone = false;
            bgMusic.play();
            document.getElementById("startHint").style.display = "none";
            document.getElementById("intro-image").style.display = "none";
            update();
        } else if (isGameOver) {
            resetGame();
        } else if (!isJumping && !isGameOver) {
            isJumping = true;
            jumpVelocity = INITIAL_JUMP_VELOCITY;
            firstJumpDone = true;
        } else if (isJumping && canDoubleJump && !isGameOver && firstJumpDone) {
            jumpVelocity = SECOND_JUMP_VELOCITY;
            canDoubleJump = false;
        }

        if (jumpVelocity > 0 && !isGameOver) {
            isGliding = true;
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        isGliding = false;
    }
});

// 初始化
resetGame();
