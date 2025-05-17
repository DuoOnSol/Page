document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const moveCounter = document.getElementById("move-counter");
    const timeCounter = document.getElementById("time-counter");
    const victoryScreen = document.getElementById("victory-screen");
    const victoryMusic = document.getElementById("victory-music");

    let tiles = [];
    let emptyIndex = 8;
    let moveCount = 0;
    let timeElapsed = 0;
    let timer;
    let isCompleted = false;
    let backgroundImage = "";

    const loadRandomImage = async () => {
        try {
            const response = await fetch('/image');
            const files = await response.json();
            const randomImage = files[Math.floor(Math.random() * files.length)];
            backgroundImage = `/image/${randomImage}`;
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    const initTiles = async () => {
        await loadRandomImage();
        const initialTiles = Array.from({ length: 9 }, (_, i) => i);
        for (let i = initialTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialTiles[i], initialTiles[j]] = [initialTiles[j], initialTiles[i]];
        }
        tiles = initialTiles;
        emptyIndex = 8;
        moveCount = 0;
        timeElapsed = 0;
        isCompleted = false;
        updateUI();
        startTimer();
    };

    const startTimer = () => {
        clearInterval(timer);
        timer = setInterval(() => {
            if (!isCompleted) {
                timeElapsed++;
                updateUI();
            }
        }, 1000);
    };

    const updateUI = () => {
        gameContainer.innerHTML = "";
        tiles.forEach((tile, index) => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile", "border", "cursor-pointer");
            tileElement.style.width = "150px";
            tileElement.style.height = "150px";
            tileElement.style.display = tile === 8 ? "none" : "block";
            tileElement.style.backgroundImage = `url(${backgroundImage})`;
            tileElement.style.backgroundSize = "300% 300%";
            tileElement.style.backgroundPosition = `${(tile % 3) * 50}% ${(Math.floor(tile / 3)) * 50}%`;
            tileElement.addEventListener("click", () => moveTile(index));
            gameContainer.appendChild(tileElement);
        });
        moveCounter.textContent = `Moves: ${moveCount}`;
        timeCounter.textContent = `Time: ${timeElapsed} seconds`;
    };

    const moveTile = (index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const emptyRow = Math.floor(emptyIndex / 3);
        const emptyCol = emptyIndex % 3;

        if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
            [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
            emptyIndex = index;
            moveCount++;
            updateUI();

            if (checkCompletion()) {
                isCompleted = true;
                clearInterval(timer);
                showVictoryScreen();
            }
        }
    };

    const checkCompletion = () => {
        for (let i = 0; i < 8; i++) {
            if (tiles[i] !== i) return false;
        }
        return true;
    };

    const showVictoryScreen = () => {
        victoryScreen.classList.remove("hidden");
        victoryMusic.volume = 0;
        victoryMusic.play();
        fadeInMusic(victoryMusic);
    };

    const fadeInMusic = (audio) => {
        let volume = 0;
        const interval = setInterval(() => {
            if (volume < 1) {
                volume += 0.05;
                audio.volume = Math.min(volume, 1);
            } else {
                clearInterval(interval);
            }
        }, 100);
    };

    initTiles();
});
