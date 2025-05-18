const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const DUO_HEIGHT = 32;
const DUO_WIDTH = 32;
const CYBERTRUCK_WIDTH = 64;
const CYBERTRUCK_HEIGHT = 32;
const JUMP_HEIGHT = CYBERTRUCK_HEIGHT * 2;

let duoX = 100;
let duoY = canvas.height - DUO_HEIGHT;
let isJumping = false;
let jumpVelocity = 0;

let trucks = [
    { x: canvas.width, y: canvas.height - CYBERTRUCK_HEIGHT, speed: 6 },
    { x: canvas.width + 300, y: canvas.height - CYBERTRUCK_HEIGHT, speed: 4 }
];

let score = 0;
let isGameOver = false;
let gameStarted = false;

const duoImg = new Image();
duoImg.src = "img/duo.png";

const truckImg = new Image();
truckImg.src = "img/cybertruck.png";

function drawDuo() {
    ctx.drawImage(duoImg, duoX, duoY, DUO_WIDTH, DUO_HEIGHT);
}

function drawTrucks() {
    trucks.forEach(truck => {
        ctx.drawImage(truckImg, truck.x, truck.y, CYBERTRUCK_WIDTH, CYBERTRUCK_HEIGHT);
    });
}

function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isJumping) {
        duoY += jumpVelocity;
        jumpVelocity += 2;
        if (duoY >= canvas.height - DUO_HEIGHT) {
            duoY = canvas.height - DUO_HEIGHT;
            isJumping = false;
        }
    }

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
            document.getElementById("game-over").style.display = "block";
        }
    });

    drawDuo();
    drawTrucks();
    document.getElementById("score").innerText = "Score: " + score;
    requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isJumping && !isGameOver) {
        isJumping = true;
        jumpVelocity = -12;
    }
    if (e.code === "Space" && isGameOver) {
        location.reload();
    }
});

duoImg.onload = () => {
    truckImg.onload = () => {
        update();
    };
};
