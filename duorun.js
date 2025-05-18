const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const DUO_HEIGHT = 32;
const DUO_WIDTH = 32;
const CYBERTRUCK_WIDTH = 64 * 1.45;
const CYBERTRUCK_HEIGHT = 32 * 1.45;
const ROCKET_WIDTH = 60;
const ROCKET_HEIGHT = 120;
const BLUE_ZONE_HEIGHT = 150;
const JUMP_HEIGHT = CYBERTRUCK_HEIGHT * 7;
const MIN_GAP = CYBERTRUCK_WIDTH + 50;
const INITIAL_JUMP_VELOCITY = -10;
const SECOND_JUMP_VELOCITY = -5;
const GLIDE_REDUCE = -2;
const ROCKET_SPEED = 1;
const ROCKET_RESPAWN_DELAY = 10000;

let duoX = 100;
let duoY = canvas.height - DUO_HEIGHT;
let isJumping = false;
let jumpVelocity = 0;
let canDoubleJump = true;
let firstJumpDone = false;
let isGliding = false;
let score = 0;
let isGameOver = false;
let gameStarted = false;
let trucks = [];
let rocket = null;
let rocketCooldown = false;

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
    trucks = [];
    for (let i = 0; i < 3; i++) {
        const isSnake = i === 0; // 只有第一台車會蛇行
        trucks.push({
            x: canvas.width + i * 300,
            y: canvas.height - CYBERTRUCK_HEIGHT,
            speed: 4 + Math.random() * 4,
            direction: Math.random() < 0.5 ? -1 : 1,
            maxOffset: isSnake ? 100 + Math.random() * 150 : 0,
            baseY: canvas.height - CYBERTRUCK_HEIGHT,
            isSnake: isSnake,
            snakeAmplitude: isSnake ? 80 + Math.random() * 40 : 0,
            snakeAngle: Math.random() * Math.PI * 2
        });
    }
}

// 初始化火箭
function resetRocket() {
    if (!rocketCooldown) {
        rocket = {
            x: canvas.width + 500,
            y: Math.random() * (BLUE_ZONE_HEIGHT - ROCKET_HEIGHT),
            speed: ROCKET_SPEED,
            direction: Math.random() < 0.5 ? -1 : 1
        };
        rocketCooldown = true;
        setTimeout(() => {
            rocketCooldown = false;
        }, ROCKET_RESPAWN_DELAY);
    }
}

// 重置遊戲
function resetGame() {
    duoY = canvas.height - DUO_HEIGHT;
    jumpVelocity = 0;
    isJumping = false;
    isGliding = false;
    canDoubleJump = true;
    firstJumpDone = false;
    score = 0;
    isGameOver = false;
    gameStarted = false;
    resetTrucks();
    resetRocket();
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
        trucks.forEach(truck => {
            truck.x -= truck.speed;
            
            // 蛇行效果
            if (truck.isSnake) {
                truck.snakeAngle += 0.05;
                truck.y = truck.baseY - truck.snakeAmplitude * Math.sin(truck.snakeAngle);
                truck.y = Math.max(truck.baseY - 100, Math.min(truck.y, truck.baseY)); // 限制蛇行範圍
            }

            ctx.drawImage(truckImg, truck.x, truck.y, CYBERTRUCK_WIDTH, CYBERTRUCK_HEIGHT);

            // 計算分數
            if (truck.x < -CYBERTRUCK_WIDTH) {
                truck.x = canvas.width + Math.random() * 300;
                truck.speed = 4 + Math.random() * 4;
                score += 100;
            }

            // 卡車碰撞
            if (
                duoX < truck.x + CYBERTRUCK_WIDTH &&
                duoX + DUO_WIDTH > truck.x &&
                duoY < truck.y + CYBERTRUCK_HEIGHT &&
                duoY + DUO_HEIGHT > truck.y
            ) {
                gameOver();
            }
        });
    }
}

// 畫火箭
function drawRocket() {
    if (gameStarted && rocket) {
        rocket.x -= rocket.speed;
        rocket.y += rocket.direction * 2;
        
        if (rocket.y <= 0 || rocket.y >= BLUE_ZONE_HEIGHT - ROCKET_HEIGHT) {
            rocket.direction *= -1;
        }

        if (rocket.x < -ROCKET_WIDTH) {
            rocket = null;
            setTimeout(resetRocket, ROCKET_RESPAWN_DELAY);
        }

        ctx.drawImage(rocketImg, rocket.x, rocket.y, ROCKET_WIDTH, ROCKET_HEIGHT);

        // 火箭碰撞
        if (
            duoX < rocket.x + ROCKET_WIDTH &&
            duoX + DUO_WIDTH > rocket.x &&
            duoY < rocket.y + ROCKET_HEIGHT &&
            duoY + DUO_HEIGHT > rocket.y
        ) {
            gameOver();
        }
    }
}

// 畫火花
function drawSpark(x, y) {
    ctx.drawImage(sparkImg, x, y, 200, 200);
}

// 遊戲結束
function gameOver() {
    isGameOver = true;
    deathSound.play();
    drawSpark(duoX - 80, duoY - 100);
    document.getElementById("gameOver").style.display = "block";
    console.log("🛑 Game Over - Collision Detected");
}

// 遊戲更新邏輯
function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawDuo();
    drawTrucks();
    drawRocket();
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
            resetGame();  // 🚀 加入重置遊戲功能
        } else if (isJumping && canDoubleJump) {
            jumpVelocity = SECOND_JUMP_VELOCITY;
            canDoubleJump = false;
        }
    }
});

// 初始化
resetGame();
