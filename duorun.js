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

duo.image.src = "img/food.png";

let truck = {
    x: 800,
    y: 320,
    width: 64,
    height: 32,
    speed: 6,
    image: new Image(),
};

truck.image.src = "img/food.png";

let score = 0;
let isJumping = false;

function draw() {
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
        alert("Game Over! Your score: " + score);
        document.location.reload();
    }

    document.getElementById("score").textContent = "Score: " + score;

    requestAnimationFrame(draw);
}

document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowUp") {
        if (!isJumping) {
            isJumping = true;
            duo.dy = duo.jumpPower;
        }
    }
});

draw();
