const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let duo = {
    x: 50,
    y: 320,
    width: 32,
    height: 32,
    dy: 0,
    jumpPower: -60,  // 調整跳躍高度 (5倍)
    gravity: 2,
    image: new Image(),
};

duo.image.src = "img/duo.png";

// 車子設定
class Truck {
    constructor(x, speed) {
        this.x = x;
        this.y = 320;
        this.width = 96;
        this.height = 64;
        this.speed = speed;
        this.image = new Image();
        this.image.src = "img/cybertruck.png";
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = canvas.width + Math.random() * 300;
        }
    }
}

let trucks = [
    new Truck(canvas.width, 6),
    new Truck(canvas.width + 400, 9)
];

let score = 0;
let isJumping = false;
let isGameStarted = false;
let isGameOver = false;

// 加入音效
const deadSound = new Audio("audio/dead.mp3");

// 讓 Space 開始遊戲
document.addEventListener("keydown", (e) => {
    if (!isGameStarted && (e.key === " " || e.key === "ArrowUp")) {
        isGameStarted = true;
        isGameOver = false;
        score = 0;
        duo.y = 320;
        duo.dy = 0;
        trucks.forEach(truck => truck.x = canvas.width + Math.random() * 300);
        document.getElementById("game-over").style.display = "none";
        draw();
    }

    // 跳躍邏輯
    if (isGameStarted && !isGameOver && (e.key === " " || e.key === "ArrowUp")) {
        if (!isJumping) {
            isJumping = true;
            duo.dy = duo.jumpPower;
        }
    }
});

function draw() {
    if (!isGameStarted || isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(duo.image, duo.x, duo.y, duo.width, duo.height);

    trucks.forEach(truck => {
        truck.update();
        truck.draw();

        // 碰撞檢測
        if (
            duo.x < truck.x + truck.width &&
            duo.x + duo.width > truck.x &&
            duo.y < truck.y + truck.height &&
            duo.y + duo.height > truck.y
        ) {
            deadSound.play();
            isGameOver = true;
            isGameStarted = false;
            document.getElementById("game-over").style.display = "block";
        }
    });

    if (isJumping) {
        duo.dy += duo.gravity;
        duo.y += duo.dy;
        if (duo.y >= 320) {
            duo.y = 320;
            duo.dy = 0;
            isJumping = false;
        }
    }

    score++;
    document.getElementById("score").textContent = "Score: " + score;

    requestAnimationFrame(draw);
}
