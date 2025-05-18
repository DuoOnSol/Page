const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const DUO_HEIGHT = 32;
const DUO_WIDTH = 32;
const CYBERTRUCK_WIDTH = 64 * 1.2;  // 3倍大
const CYBERTRUCK_HEIGHT = 32 * 1.2;
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
const bgMusic = new Audio("./audio/music.midi");
bgMusic.loop = true;

function drawBackground() {
    ctx.globalAlpha = 0.3;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
}

function drawDuo() {
    ctx.drawImage(duoImg, duoX, duoY, DUO_WIDTH, DUO_HEIGHT);
}

function drawTrucks() {
    trucks.forEach(truck => {
        ctx.drawImage(truckImg, truck.x, truck.y, CYBERTRUCK_WIDTH, CYBERTRUCK_HEIGHT);
    });
}

function drawSpark(x, y) {
    ctx.drawImage(sparkImg, x, y, 200, 200);
}

function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawDuo();
    drawTrucks();
    document.getElementById("score").innerText = "Score: " + score;
    requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gameStarted) {
        gameStarted = true;
        isJumping = true;
        jumpVelocity = -18;
        document.getElementById("startHint").style.display = "none";
        bgMusic.play();
        update();
    } else if (e.code === "Space" && !isJumping && !isGameOver) {
        isJumping = true;
        jumpVelocity = -18;
    }
    if (e.code === "Space" && isGameOver) {
        location.reload();
    }
});
