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
    jumpPower: -12,
    gravity: 0.6,
    image: new Image(),
};

duo.image.src = "img/duo.png";

// 車子改成三倍大的 duo.jpg
let truck = {
    x: canvas.width,
    y: 240,
    width: 96,
    height: 96,
    speed: 6,
    image: new Image(),
};

truck.image.src = "img/cybertruck.jpg";

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
        truck.x = canvas.width;
        duo.y = 320;
        duo.dy = 0;
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
    ctx.drawImage(truck.image, truck.x, truck.y, truck.width, truck.height);

    truck.x -= truck.speed;
    if (truck.x + truck.width < 0) {
        truck.x = canvas.width + Math.random() * 300;
        score++;
    }

    if (isJumping) {
        duo.dy += duo.gravity;
        duo.y += duo.dy;
        if (duo.y >= 320) {
            duo.y = 320;
            duo.dy = 0;
            isJumping = false;
        }
    }

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

    document.getElementById("score").textContent = "Score: " + score;

    requestAnimationFrame(draw);
}
