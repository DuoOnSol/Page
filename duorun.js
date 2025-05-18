const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const DUO_HEIGHT = 32;
const DUO_WIDTH = 32;
const CYBERTRUCK_WIDTH = 64 * 1.45;
const CYBERTRUCK_HEIGHT = 32 * 1.45;
const JUMP_HEIGHT = CYBERTRUCK_HEIGHT * 5;
const MIN_GAP = CYBERTRUCK_WIDTH + 50;

const JUMP_VELOCITY = -18;
const GRAVITY = 0.5;
const GLIDE_REDUCE = 0.1;

let duoX = 100;
let duoY = canvas.height - DUO_HEIGHT;
let isJumping = false;
let jumpVelocity = 0;
let gameStarted = false;
let isGameOver = false;
let isGliding = false;

let trucks = [
    { x: canvas.width, y: canvas.height - CYBERTRUCK_HEIGHT, speed: 6 },
    { x: canvas.width + 300, y: canvas.height - CYBERTRUCK_HEIGHT, speed: 4 }
];

let score = 0;

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
            truck.y = Math.min(canvas.height - CYBERTRUCK_HEIGHT, truck.y);
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

    if (isJumping) {
        duoY += jumpVelocity;
        if (isGliding) {
            jumpVelocity += GLIDE_REDUCE;
        } else {
            jumpVelocity += GRAVITY;
        }

        if (duoY >= canvas.height - DUO_HEIGHT) {
            duoY = canvas.height - DUO_HEIGHT;
            isJumping = false;
            isGliding = false;
        }
    }

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
            drawSpark(duoX - 80, duoY - 100);
            bgMusic.pause();
            document.getElementById("gameOver").style.display = "block";
            return;
        }
    });

    drawDuo();
    drawTrucks();
    document.getElementById("score").innerText = "Score: " + score;
    requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
            isJumping = true;
            jumpVelocity = JUMP_VELOCITY;
            bgMusic.play();
            document.getElementById("startHint").style.display = "none";
            document.getElementById("intro-image").style.display = "none";
            update();
        } else if (!isJumping && !isGameOver) {
            isJumping = true;
            jumpVelocity = JUMP_VELOCITY;
        }
        isGliding = true;
    }

    if (e.code === "Space" && isGameOver) {
        location.reload();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        isGliding = false;
    }
});
