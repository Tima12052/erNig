const gameContainer = document.getElementById("gameContainer");
const player = document.getElementById("player");
const bulletsContainer = document.getElementById("bullets");

let playerX = 400;
let playerY = 300;
let playerSpeed = 5;

// Управление персонажем при помощи клавиш "WASD"
let keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

function movePlayer() {
    if (keys["w"] && playerY > 0) {
        playerY -= playerSpeed;
    }
    if (keys["s"] && playerY < gameContainer.clientHeight - player.clientHeight) {
        playerY += playerSpeed;
    }
    if (keys["a"] && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keys["d"] && playerX < gameContainer.clientWidth - player.clientWidth) {
        playerX += playerSpeed;
    }
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

// Стрельба при клике левой кнопкой мыши
document.addEventListener("click", (event) => {
    const rect = gameContainer.getBoundingClientRect();
    const bulletX = playerX + player.clientWidth / 2;
    const bulletY = playerY + player.clientHeight / 2;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    shootBullet(bulletX, bulletY, mouseX, mouseY);
});

function shootBullet(startX, startY, targetX, targetY) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bulletsContainer.appendChild(bullet);

    bullet.style.left = startX + "px";
    bullet.style.top = startY + "px";

    const angle = Math.atan2(targetY - startY, targetX - startX);
    const bulletSpeed = 7;

    const bulletInterval = setInterval(() => {
        startX += Math.cos(angle) * bulletSpeed;
        startY += Math.sin(angle) * bulletSpeed;
        bullet.style.left = startX + "px";
        bullet.style.top = startY + "px";

        if (startX < 0 || startX > gameContainer.clientWidth || startY < 0 || startY > gameContainer.clientHeight) {
            clearInterval(bulletInterval);
            bullet.remove();
        }
    }, 16);
}

// Основной игровой цикл
function gameLoop() {
    movePlayer();
    requestAnimationFrame(gameLoop);
}

gameLoop();
