    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const player = {
      x: canvas.width / 2 - 20,
      y: canvas.height - 30,
      width: 40,
      height: 20,
      speed: 6,
      color: "#7df9ff"
    };

    const bullet = {
      x: 0,
      y: 0,
      width: 4,
      height: 10,
      speed: 7,
      active: false
    };

    const alienPixel = [
      [0,1,0,0,0,0,1,0],
      [0,0,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,1],
      [1,0,1,1,1,1,0,1],
      [1,1,1,1,1,1,1,1],
      [0,1,0,1,1,0,1,0],
      [1,0,0,0,0,0,0,1],
      [0,1,1,0,0,1,1,0]
    ];

    function drawAlien(x, y, size, color) {
      for (let row = 0; row < alienPixel.length; row++) {
        for (let col = 0; col < alienPixel[row].length; col++) {
          if (alienPixel[row][col]) {
            ctx.fillStyle = color;
            ctx.fillRect(x + col * size, y + row * size, size, size);
          }
        }
      }
    }

    let enemies = [];
    let enemyRows = 3;
    let enemyCols = 6;
    let enemySize = 6;
    let enemySpacing = 50;
    let enemySpeed = 0.6;
    let enemyDirection = 1;
    let level = 1;

    function createEnemies() {
      enemies = [];
      for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
          enemies.push({
            x: 30 + col * enemySpacing,
            y: 30 + row * enemySpacing,
            alive: true
          });
        }
      }
    }

    createEnemies();

    const keys = {};
    document.addEventListener("keydown", e => {
      keys[e.key] = true;
      if (e.code === "Space") e.preventDefault();
    });
    document.addEventListener("keyup", e => keys[e.key] = false);

    function movePlayer() {
      if (keys["ArrowLeft"]) player.x -= player.speed;
      if (keys["ArrowRight"]) player.x += player.speed;
      player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    }

    function shootBullet() {
      if (keys[" "] && !bullet.active) {
        bullet.x = player.x + player.width / 2 - bullet.width / 2;
        bullet.y = player.y;
        bullet.active = true;
      }
    }

    function moveBullet() {
      if (bullet.active) {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullet.active = false;
      }
    }

    function moveEnemies() {
      let shiftDown = false;
      for (let e of enemies) {
        if (!e.alive) continue;
        e.x += enemySpeed * enemyDirection;
        if (e.x <= 0 || e.x + 40 >= canvas.width) shiftDown = true;
      }
      if (shiftDown) {
        enemyDirection *= -1;
        for (let e of enemies) {
          e.y += 15;
          if (e.y + 40 >= player.y) {
            gameOver();
            break;
          }
        }
      }
    }

    function detectCollisions() {
      for (let e of enemies) {
        if (!e.alive) continue;
        if (
          bullet.x < e.x + 40 &&
          bullet.x + bullet.width > e.x &&
          bullet.y < e.y + 40 &&
          bullet.y + bullet.height > e.y
        ) {
          e.alive = false;
          bullet.active = false;
        }
      }
    }

    function gameOver() {
      document.getElementById("retryBtn").style.display = "inline-block";
      cancelAnimationFrame(animationId);
    }

    function restartGame() {
      createEnemies();
      document.getElementById("retryBtn").style.display = "none";
      level = 1;
      enemySpeed = 0.6;
      animate();
    }

    function checkWin() {
      if (enemies.every(e => !e.alive)) {
        level++;
        enemySpeed += 0.3;
        createEnemies();
      }
    }

    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      movePlayer();
      shootBullet();
      moveBullet();
      moveEnemies();
      detectCollisions();
      checkWin();

      // draw player
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y + player.height);
      ctx.lineTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      // draw bullet
      if (bullet.active) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }

      // draw enemies
      for (let e of enemies) {
        if (e.alive) drawAlien(e.x, e.y, enemySize, "#00f0ff");
      }
    }

    animate();