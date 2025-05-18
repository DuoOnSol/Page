// Initial settings for the game
const rocket = document.getElementById('rocket');
const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

// Define the blue area (top 150px)
const BLUE_ZONE_HEIGHT = 150;

// Rocket movement settings
const rocketSpeed = 8;
let rocketY = 20;
let score = 0;
let gameRunning = true;

// Restrict rocket movement to the blue zone
function moveRocket(up) {
    if (!gameRunning) return;
    rocketY += up ? -rocketSpeed : rocketSpeed;
    // Constrain within the blue zone
    if (rocketY < 0) rocketY = 0;
    if (rocketY > BLUE_ZONE_HEIGHT - rocket.offsetHeight) rocketY = BLUE_ZONE_HEIGHT - rocket.offsetHeight;
    rocket.style.top = rocketY + 'px';
}

// Add keyboard controls for rocket and restart
function handleKeyPress(event) {
    if (event.key === 'ArrowUp') moveRocket(true);
    if (event.key === 'ArrowDown') moveRocket(false);
    if (event.key === ' ') resetGame();
}

document.addEventListener('keydown', handleKeyPress);

// Ensure the rocket starts within the blue zone
rocket.style.top = '20px';
rocket.style.left = 'calc(50% - 20px)';
rocket.style.width = '60px';
rocket.style.height = '120px';

// Generate cars at random intervals
function spawnCar() {
    if (!gameRunning) return;
    const car = document.createElement('div');
    car.classList.add('car');
    car.style.left = '100%';
    car.style.top = (BLUE_ZONE_HEIGHT + 50 + Math.random() * (gameArea.offsetHeight - BLUE_ZONE_HEIGHT - 100)) + 'px';
    gameArea.appendChild(car);

    let direction = Math.random() < 0.5 ? -1 : 1;
    let horizontalOffset = 0;

    const carInterval = setInterval(() => {
        const carPosition = car.offsetLeft;
        if (carPosition < -100) {
            car.remove();
            clearInterval(carInterval);
            score += 100;
            scoreElement.textContent = 'Score: ' + score;
        } else {
            // Apply horizontal snake-like movement
            horizontalOffset += direction * 5;
            if (Math.random() < 0.05) direction *= -1; // Randomly change direction
            car.style.left = carPosition - 10 + 'px';
            car.style.transform = `translateX(${horizontalOffset}px)`;
        }

        // Check collision
        const rocketRect = rocket.getBoundingClientRect();
        const carRect = car.getBoundingClientRect();
        if (
            rocketRect.left < carRect.right &&
            rocketRect.right > carRect.left &&
            rocketRect.top < carRect.bottom &&
            rocketRect.bottom > carRect.top
        ) {
            gameOver();
            clearInterval(carInterval);
        }
    }, 50);

    // Spawn the next car
    setTimeout(spawnCar, 1000 + Math.random() * 2000);
}

// Start spawning cars
spawnCar();

// Handle game over
function gameOver() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
    gameOverElement.textContent = 'Game Over - Press Space to Restart';
}

// Reset game
function resetGame() {
    if (gameRunning) return;  // Only reset if the game is over
    gameRunning = true;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';
    rocketY = 20;
    rocket.style.top = '20px';
    rocket.style.left = 'calc(50% - 30px)';
    document.querySelectorAll('.car').forEach(car => car.remove());
    spawnCar();
}

document.getElementById('restartButton').addEventListener('click', resetGame);
