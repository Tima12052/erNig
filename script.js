const gameContainer = document.getElementById("gameContainer");
const player = document.getElementById("player");
const bulletsContainer = document.getElementById("bullets");
const enemiesContainer = document.getElementById("enemies");

let playerX = 400;
let playerY = 300;
let playerSpeed = 5;
let enemies = [];

// Управление персонажем при помощи клавиш "WASD"
let keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
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

// Создание врагов
function createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemiesContainer.appendChild(enemy);

    // Случайная позиция появления по краям игрового поля
    let side = Math.floor(Math.random() * 4);
    let startX, startY;

    if (side === 0) { // сверху
        startX = Math.random() * gameContainer.clientWidth;
        startY = 0;
    } else if (side === 1) { // снизу
        startX = Math.random() * gameContainer.clientWidth;
        startY = gameContainer.clientHeight;
    } else if (side === 2) { // слева
        startX = 0;
        startY = Math.random() * gameContainer.clientHeight;
    } else { // справа
        startX = gameContainer.clientWidth;
        startY = Math.random() * gameContainer.clientHeight;
    }

    enemy.style.left = startX + "px";
    enemy.style.top = startY + "px";

    enemies.push({ element: enemy, x: startX, y: startY });

    // Враг движется к игроку
    const moveEnemy = setInterval(() => {
        const angle = Math.atan2(playerY - startY, playerX - startX);
        startX += Math.cos(angle) * 2;
        startY += Math.sin(angle) * 2;

        enemy.style.left = startX + "px";
        enemy.style.top = startY + "px";

        // Если враг попадает на игрока, можно добавить логику столкновения (игрок теряет здоровье и т.д.)
        if (Math.abs(startX - playerX) < 20 && Math.abs(startY - playerY) < 20) {
            alert("Game Over!");
            clearInterval(moveEnemy);
            enemy.remove();
        }

        // Удаление врага, если он за пределами игрового поля
        if (startX < 0 || startX > gameContainer.clientWidth || startY < 0 || startY > gameContainer.clientHeight) {
            clearInterval(moveEnemy);
            enemy.remove();
        }

    }, 16);
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

        // Проверка столкновения с врагом
        enemies.forEach((enemy, index) => {
            const enemyX = enemy.x;
            const enemyY = enemy.y;

            if (Math.abs(startX - enemyX) < 20 && Math.abs(startY - enemyY) < 20) {
                // Уничтожаем врага и пулю при столкновении
                enemy.element.remove();
                enemies.splice(index, 1);
                clearInterval(bulletInterval);
                bullet.remove();
            }
        });

        // Убираем пулю, если она выходит за пределы игрового поля
        if (startX < 0 || startX > gameContainer.clientWidth || startY < 0 || startY > gameContainer.clientHeight) {
            clearInterval(bulletInterval);
            bullet.remove();
        }
    }, 16);
}

// Появление врагов через определенные интервалы
setInterval(createEnemy, 2000);

// Основной игровой цикл
function gameLoop() {
    movePlayer();
    requestAnimationFrame(gameLoop);
}

gameLoop();
