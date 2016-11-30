window.onload = init;

var map;
var ctxMap;

var pl,
    ctxPl;

var en,
    ctxEn;

var stats,
    ctxStats;

var gameWidth = 800,
    gameHeight = 500;

var background = new Image();
background.src = '../img/bg.png';

var background1 = new Image();
background1.src = '../img/bg.png';

var tiles = new Image();
tiles.src = '../img/tiles.png';

var player;
var enemys = [];

var isPlaying;
var health;

var mapX = 0,
    map1X = gameWidth;

//for creating enemies
var spawnInterval;
var spawnTime = 6000;
var spawnAmount = 3;

var mouseX,
    mouseY;

var requestAnimFrame = window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame;

function init()
{
    map = document.getElementById("map");
    ctxMap = map.getContext("2d");
    pl = document.getElementById("player");
    ctxPl = pl.getContext("2d");
    en = document.getElementById("enemy");
    ctxEn = en.getContext("2d");
    stats = document.getElementById("stats");
    ctxStats = stats.getContext("2d");

    map.width = gameWidth;
    map.height = gameHeight;
    pl.width = gameWidth;
    pl.height   = gameHeight;
    en.width = gameWidth;
    en.height   = gameHeight;
    stats.width = gameWidth;
    stats.height   = gameHeight;

    ctxStats.fillStyle = "#3d3d3d";
    ctxStats.font = "bold 15px Arial";

    player = new Player();

    resetHealth();

    startLoop();

    document.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("click", mouseClick, false);
    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);

}

function mouseMove(e) {
    mouseX = e.pageX - map.offsetLeft;
    mouseY = e.pageY - map.offsetTop;
    player.drawX = mouseX - player.width/2;
    player.drawY = mouseY - player.height/2;
    document.getElementById("gameName").innerHTML = "X: " + mouseX + "Y: " + mouseY;
}

function mouseClick(e) {

    document.getElementById("gameName").innerHTML = "Clicked";
}
function resetHealth() {
    health = 100;
}

function spawnEnemy(count) {
    for(var i = 0; i < count; i++)
    {
        enemys[i] = new Enemy();
    }
}

function startCreatingEnemies() {
    stopCreatingEnemies();
    spawnInterval = setInterval(function () {
        spawnEnemy(spawnAmount)
    },spawnTime);
}

function stopCreatingEnemies() {
    clearInterval(spawnInterval);
}

function loop() {
    if(isPlaying)
    {
        draw();
        update();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
    startCreatingEnemies();
}

function stopLoop() {
    isPlaying = false;
}

function draw() {
    player.draw();

    clearCtxEnemy();
    for(var i = 0; i<enemys.length; i++)
    {
        enemys[i].draw();
    }
}
function update() {
    moveBg();
    drawBG();
    updateStats();
    player.update();
    for(var i = 0; i<enemys.length; i++)
    {
        enemys[i].update();
    }
}

function moveBg() {
    var vel = 4;
    mapX -= vel;
    map1X -= vel;
    if (mapX + gameWidth < 0) mapX = gameWidth-4;
    if (map1X + gameWidth < 0) map1X = gameWidth-4;
}

//Objects
function Player() {
    this.srcX = 0;
    this.srcY = 0;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 120;
    this.height = 70;
    this.speed = 5;

    //for keys
    this.isUp = false;
    this.isDown = false;
    this.isRight = false;
    this.isLeft = false;
}

Player.prototype.draw = function () {
    clearCtxPlayer();
    ctxPl.drawImage(tiles, this.srcX, this.srcY, this.width, this.height, /*размеры самой картинки*/
        this.drawX, this.drawY, this.width, this.height)/*размеры на canvas*/;
};

Player.prototype.update = function () {
    if(health<0)
    {
        resetHealth();
    }

    if(this.drawX < 0) this.drawX = 0;
    if(this.drawX > gameWidth-this.width-300) this.drawX = gameWidth-this.width - 300;
    if(this.drawY < 0) this.drawY = 0;
    if(this.drawY > gameHeight-this.height) this.drawY = gameHeight-this.height;

    for(var i = 0; i<enemys.length; i++)
    {
        if(this.drawX >= enemys[i].drawX &&
            this.drawY >= enemys[i].drawY &&
            this.drawX <= enemys[i].drawX + enemys[i].width &&
            this.drawY <= enemys[i].drawY + enemys[i].height)
        {
            health--;
        }
    }

    this.chooseDir();
};

Player.prototype.chooseDir = function () {
    if(this.isUp)
        this.drawY -= this.speed;
    if(this.isDown)
        this.drawY += this.speed;
    if(this.isRight)
        this.drawX += this.speed;
    if(this.isLeft)
        this.drawX -= this.speed;
};

function Enemy() {
    this.srcX = 0;
    this.srcY = 71;
    this.drawX = Math.floor(Math.random()*gameWidth)+gameWidth;
    this.drawY = Math.floor(Math.random()*gameHeight);
    this.width = 62;
    this.height = 92;

    this.speed = 8;
}

Enemy.prototype.draw = function () {
    //clearCtxEnemy();
    ctxEn.drawImage(tiles, this.srcX, this.srcY, this.width, this.height, /*размеры самой картинки*/
        this.drawX, this.drawY, this.width, this.height)/*размеры на canvas*/;
};

Enemy.prototype.update = function () {
    this.drawX -=this.speed;
    if(this.drawX + this.width < 0)
    {
        this.destroy();
    }
};

Enemy.prototype.destroy = function () {
    enemys.splice(enemys.indexOf(this), 1);
};

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if(keyChar == "W")
    {
        player.isUp = true;
        e.preventDefault();
    }
    if(keyChar == "S")
    {
        player.isDown = true;
        e.preventDefault();
    }
    if(keyChar == "D")
    {
        player.isRight = true;
        e.preventDefault();
    }
    if(keyChar == "A")
    {
        player.isLeft = true;
        e.preventDefault();
    }
    if(keyID =="27")
    {
        isPlaying = false;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if(keyChar == "W")
    {
        player.isUp = false;
        e.preventDefault();
    }
    if(keyChar == "S")
    {
        player.isDown = false;
        e.preventDefault();
    }
    if(keyChar == "D")
    {
        player.isRight = false;
        e.preventDefault();
    }
    if(keyChar == "A")
    {
        player.isLeft = false;
        e.preventDefault();
    }
}

function drawRect() {
    ctxMap.fillStyle = "#3D3D3D";
    ctxMap.fillRect(10, 10, 100, 100);
}

function clearRect() {
    ctxMap.clearRect(0, 0, 800, 500);
}

function drawBG() {
    ctxMap.clearRect(0, 0, gameWidth, gameHeight);
    ctxMap.drawImage(background, 0, 0, gameWidth, gameHeight, /*размеры самой картинки*/
        mapX, 0, gameWidth, gameHeight)/*размеры на canvas*/;
    ctxMap.drawImage(background1, 0, 0, gameWidth, gameHeight, /*размеры самой картинки*/
        map1X, 0, gameWidth, gameHeight)/*размеры на canvas*/;
}

function clearCtxPlayer() {
    ctxPl.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxEnemy() {
    ctxEn.clearRect(0, 0, gameWidth, gameHeight);
}

function updateStats() {
    ctxStats.clearRect(0, 0, gameWidth, gameHeight);
    ctxStats.fillText("Health: " + health, 380, 20);
}