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
const GLIDE_REDUCE = -5; // 滑翔時減緩下降速度

let duoX = 100;
let duoY = canvas.height - DUO_HEIGHT;
let isJumping = false;
let jumpVelocity = 0;
let maxJumpHeight = canvas.height - DUO_HEIGHT - JUMP_HEIGHT;
let canDoubleJump = true;
let firstJumpDone = false;
let isGliding = false;

let trucks = [
    { x: canvas.width, y: canvas.height - CYBERTRUCK_HEIGHT, speed: 6 },
    { x: canvas.width + 300, y: canvas.height - CYBERTRUCK_HEIGHT, speed: 4 }
];

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

const backgroundImg = new Image();
backgroundImg.src = "./img/road.png";

const deathSound = new Audio("./audio/death.mp3");
const bgMusic = new Audio("./audio/music.mid");
bgMusic.loop = true;
bgMusic.volume = 0.5;

function drawBackground() {
    ctx.globalAlpha = 0.3;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
}

function drawDuo() {
    if (gameStarted) {
        ctx.drawImage(duoImg, duoX, duoY, DUO_WIDTH, DUO_HEIGHT);
    }
}

function drawTrucks() {
    if (gameStarted) {
        trucks.forEach(truck => {
            ctx.drawImage(truckImg, truck.x, truck.y, CYBERTRUCK_WIDTH, CYBERTRUCK_HEIGHT);
        });
    }
}

function drawSpark(x, y) {
    ctx.drawImage(sparkImg, x, y, 200, 200);
}

function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // 處理跳躍和滑翔邏輯
    if (isJumping) {
        duoY += jumpVelocity;
        jumpVelocity += 0.5;  // 重力

        // 如果在滑翔，減緩下降速度
        if (isGliding && jumpVelocity > 0) {
            jumpVelocity += GLIDE_REDUCE;
        }

        // 落地檢查
        if (duoY >= canvas.height - DUO_HEIGHT) {
            duoY = canvas.height - DUO_HEIGHT;
            isJumping = false;
            canDoubleJump = true;
            firstJumpDone = false;
            isGliding = false;
        }
    }

    // 移動卡車並檢查碰撞
    for (let i = 0; i < trucks.length; i++) {
        const truck = trucks[i];
        const nextTruck = trucks[i + 1];

        // 卡車排隊邏輯
        if (nextTruck) {
            const distanceToNext = nextTruck.x - (truck.x + CYBERTRUCK_WIDTH);
            if (distanceToNext < MIN_GAP) {
                truck.speed = Math.min(truck.speed, nextTruck.speed - 0.5);
            } else {
                truck.speed = 4 + Math.random() * 4;
            }
        }

        truck.x -= truck.speed;
        
        // 如果卡車超出畫布，重置位置並增加分數
        if (truck.x < -CYBERTRUCK_WIDTH) {
            truck.x = canvas.width + Math.random() * 300;
            truck.speed = 4 + Math.random() * 4;
            score += 100;
        }

        // 碰撞檢測
        if (
            duoX < truck.x + CYBERTRUCK_WIDTH &&
            duoX + DUO_WIDTH > truck.x &&
            duoY < truck.y + CYBERTRUCK_HEIGHT &&
            duoY + DUO_HEIGHT > truck.y
        ) {
            isGameOver = true;
            deathSound.play();
            bgMusic.pause(); // 停止背景音樂
            drawSpark(duoX - 80, duoY - 100);
            document.getElementById("gameOver").style.display = "block";
            console.log("🛑 Game Over - Collision Detected");
            return;
        }
    }

    drawDuo();
    drawTrucks();
    document.getElementById("score").innerText = "Score: " + score;
    requestAnimationFrame(update);
}

// 處理 Space 按鍵啟動遊戲和跳躍
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
            isJumping = true;
            jumpVelocity = INITIAL_JUMP_VELOCITY;
            canDoubleJump = true;
            firstJumpDone = false;
            bgMusic.play();  // 播放背景音樂
            document.getElementById("startHint").style.display = "none";
            document.getElementById("intro-image").style.display = "none";
            update();
        } else if (!isJumping && !isGameOver) {
            isJumping = true;
            jumpVelocity = INITIAL_JUMP_VELOCITY;
            firstJumpDone = true;
        } else if (isJumping && canDoubleJump && !isGameOver && firstJumpDone) {
            jumpVelocity = SECOND_JUMP_VELOCITY;
            canDoubleJump = false;
        }

        // 啟動滑翔
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
