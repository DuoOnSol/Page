// Initial settings for the game
const rocket = document.getElementById('rocket');
const gameArea = document.getElementById('gameArea');

// Define the blue area (top 150px)
const BLUE_ZONE_HEIGHT = 150;

// Rocket movement settings
const rocketSpeed = 8;
let rocketY = 20;

// Restrict rocket movement to the blue zone
function moveRocket(up) {
    rocketY += up ? -rocketSpeed : rocketSpeed;
    // Constrain within the blue zone
    if (rocketY < 0) rocketY = 0;
    if (rocketY > BLUE_ZONE_HEIGHT - rocket.offsetHeight) rocketY = BLUE_ZONE_HEIGHT - rocket.offsetHeight;
    rocket.style.top = rocketY + 'px';
}

// Add keyboard controls for rocket
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') moveRocket(true);
    if (event.key === 'ArrowDown') moveRocket(false);
});

// Ensure the rocket starts within the blue zone
rocket.style.top = '20px';
rocket.style.left = 'calc(50% - 30px)';
