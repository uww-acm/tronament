/**
 * Class that encapsulates a game's state.
 */
function Game() {
    this.canvas = new Canvas(document.getElementById("myCanvas"));
}

Game.prototype.addPlayer = function(player) {
    if (!(player instanceof Player)) {
        throw new Exception("Object is not a player instance.");
    }

    this.players.push(player);
}

Game.prototype.fill = function(x, y) {
    if (this.collisionMap[x] == undefined) {
        this.collisionMap[x] = [];
    }
    this.collisionMap[x][y] = 1;
}

/**
 * Queries the game for what is at a location.
 */
Game.prototype.query = function(x, y) {
    if (x < 0 || x >= this.canvas.getWidth() || y < 0 || y >= this.canvas.getHeight()) {
        return true;
    }
    if (this.collisionMap[x] != undefined && this.collisionMap[x][y] == 1) {
        return true;
    }
    return false;
}

/**
 * Removes player from the game.
 */
Game.prototype.playerDeath = function(i) {
    this.players.splice(i, 1);
    if (this.players.length == 1)
        this.end(this.players[0]);
}

/**
 * Ends the game.
 */
Game.prototype.end = function(player) {
    this.canvas.context.fillStyle = "white";
    this.canvas.context.font = "bold 24px Arial";
    this.canvas.context.fillText("Game Over", this.canvas.getWidth() / 2 - 60, 210);
    this.canvas.context.fillText(player.name + " Wins", this.canvas.getWidth() / 2 - 70, 300); // not exactly centered
    clearInterval(this.timer);
}

/**
 * Executes a single tick of the game loop.
 */
Game.prototype.tick = function() {
    // ask each player to respond with their move
    for (var i = 0; i < this.players.length; i++) {
        this.canvas.context.beginPath();
        this.canvas.context.strokeStyle = this.players[i].color;
        this.canvas.context.moveTo(this.players[i].x, this.players[i].y);

        // tell the player to move
        var move = this.players[i].move(this);

        // adjust the player position based on the direction
        if (move == Player.DIRECTION_RIGHT) {
            this.players[i].x++;
        } else if (move == Player.DIRECTION_DOWN) {
            this.players[i].y++;
        } else if (move == Player.DIRECTION_LEFT) {
            this.players[i].x--;
        } else if (move == Player.DIRECTION_UP) {
            this.players[i].y--;
        }

        // draw the trail
        this.canvas.context.lineTo(this.players[i].x, this.players[i].y);
        this.canvas.context.stroke();
        this.canvas.context.closePath();

        if (this.query(this.players[i].x, this.players[i].y)) {
            this.playerDeath(i);
        }
        else
            this.fill(this.players[i].x, this.players[i].y);
    }
}

Game.prototype.reset = function() {
    this.collisionMap = [[]];
    this.canvas.context.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    this.players = [];



    // add some players
    var player1 = new DemoAiPlayer("Blue");
    player1.direction = Math.floor(Math.random() * 4) + 1;
    player1.x = 200;
    player1.y = 200;
    player1.color = "blue";

    var player2 = new DemoAiPlayer("Red");
    player2.direction = Math.floor(Math.random() * 4) + 1;
    player2.x = 600;
    player2.y = 200;
    player2.color = "red";

    var player3 = new DemoAiPlayer("Green");
    player3.direction = Math.floor(Math.random() * 4) + 1;
    player3.x = 200;
    player3.y = 400;
    player3.color = "green";

    var player4 = new DemoAiPlayer("Orange");
    player4.direction = Math.floor(Math.random() * 4) + 1;
    player4.x = 600;
    player4.y = 400;
    player4.color = "orange";

    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);
}

/**
 * Starts the game loop.
 */
Game.prototype.start = function() {
    this.timer = setInterval(function() {
        this.tick();
    }.bind(this), 4);
}

// create the game
var game = new Game();
game.reset();

// start the game
game.start();



document.getElementById("fullscreen-button").addEventListener("click", function(e) {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        var element = document.getElementById("game-screen");
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});


document.getElementById("reset-button").addEventListener("click", function(e) {
    clearInterval(game.timer);
    game.reset();
    game.start();
});
