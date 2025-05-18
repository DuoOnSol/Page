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
        trucks.push({
            x: canvas.width + i * 300,
            y: canvas.height - CYBERTRUCK_HEIGHT,
            speed: 4 + Math.random() * 4,
            direction: Math.random() < 0.5 ? -1 : 1,
            maxOffset: 50 + Math.random() * 100,
            baseX: canvas.width + i * 300,
            isSnake: i === 0 // 只有第一台車會蛇行
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
    score = 0;
    isGameOver = false;
    gameStarted = false;
    resetTrucks();
    rocket = null;
    rocketCooldown = false;
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
                truck.y += truck.direction * 2;
                if (truck.y < canvas.height - CYBERTRUCK_HEIGHT - 40 || truck.y > canvas.height - CYBERTRUCK_HEIGHT) {
                    truck.direction *= -1;
                }
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

// 初始化
resetGame();
