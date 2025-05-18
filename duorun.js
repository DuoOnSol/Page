const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const DUO_HEIGHT = 32;
const DUO_WIDTH = 32;
const CYBERTRUCK_WIDTH = 64;
const CYBERTRUCK_HEIGHT = 32;
const JUMP_HEIGHT = CYBERTRUCK_HEIGHT * 5;

let duoX = 100;
let duoY = canvas.height - DUO_HEIGHT;
let isJumping = false;
let jumpVelocity = 0;
let maxJumpHeight = canvas.height - DUO_HEIGHT - JUMP_HEIGHT;

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

// 圖片載入測試
duoImg.onload = () => console.log("✅ Duo image loaded");
truckImg.onload = () => console.log("✅ Truck image loaded");
sparkImg.onload = () => console.log("✅ Spark image loaded");
backgroundImg.onload = () => console.log("✅ Background image loaded");
deathSound.onloadeddata = () => console.log("✅ Death sound loaded");

// 圖片載入錯誤測試
duoImg.onerror = () => console.error("❌ Failed to load duo.png");
truckImg.onerror = () => console.error("❌ Failed to load cybertruck.png");
sparkImg.onerror = () => console.error("❌ Failed to load spark.png");
backgroundImg.onerror = () => console.error("❌ Failed to load road.png");

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

    // 處理跳躍邏輯
    if (isJumping) {
        duoY += jumpVelocity;
        jumpVelocity += 0.8;  // 減少重力加速度
        if (duoY >= canvas.height - DUO_HEIGHT) {
            duoY = canvas.height - DUO_HEIGHT;
            isJumping = false;
        }
    }

    // 移動卡車並檢查碰撞
    trucks.forEach(truck => {
        truck.x -= truck.speed;
        if (truck.x < -CYBERTRUCK_WIDTH) {
            truck.x = canvas.width + Math.random() * 300;
            truck.speed = 4 + Math.random() * 4;
            score++;
        }

        if (
            duoX < truck.x + CYBERTRUCK_WIDTH &&
            duoX + DUO_WIDTH > truck.x &&
            duoY < truck.y + CYBERTRUCK_HEIGHT &&
            duoY + DUO_HEIGHT > truck.y
        ) {
            isGameOver = true;
            deathSound.play();
            drawSpark(duoX - 80, duoY - 100);
            document.getElementById("gameOver").style.display = "block";
            console.log("🛑 Game Over - Collision Detected");
            return;
        }
    });

    drawDuo();
    drawTrucks();
    document.getElementById("score").innerText = "Score: " + score;
    requestAnimationFrame(update);
}

// 處理 Space 按鍵啟動遊戲
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gameStarted) {
        gameStarted = true;
        isJumping = true;
        jumpVelocity = -18;
        document.getElementById("startHint").style.display = "none";
        update();
    } else if (e.code === "Space" && !isJumping && !isGameOver) {
        isJumping = true;
        jumpVelocity = -18;
    }
    if (e.code === "Space" && isGameOver) {
        location.reload();
    }
});
