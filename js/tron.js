/**
 * Class that encapsulates a game's state.
 */
function Game() {
    this.canvas = new Canvas(document.getElementById("myCanvas"));
    this.players = [];
    this.count = 0;
    this.playDir = 38;
    this.snake1x = [];
    this.snake1y = [];
}

Game.prototype.addPlayer = function(player) {
    this.players.push(player);
}

Game.prototype.load = function(c, d) {
    this.snake1x[this.count] = c;
    this.snake1y[this.count] = d;
    $(".counter").text("length = " + this.count + " x= " + this.snake1x[this.count] + " y= " + this.snake1y[this.count]);
    this.count++;
}

Game.prototype.test = function(x, y) {
    // check if the position is out of bounds
    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
        this.end();
        return false;
    }

    // check if the position intersects with a trail
    for (var i = 0; i < this.count; i++) {
        if (x == this.snake1x[i] && y == this.snake1y[i]) {
            this.end();
            return false;
        }
    }
}

/**
 * Ends the game.
 */
Game.prototype.end = function() {
    this.canvas.context.fillStyle = "black";
    this.canvas.context.font = "bold 24px Arial";
    this.canvas.context.fillText("Game Over", 150, 210);
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
        if (move == 1) {
            this.players[i].x++;
        } else if (move == 2) {
            this.players[i].y++;
        } else if (move == 3) {
            this.players[i].x--;
        } else if (move == 4) {
            this.players[i].y--;
        }

        // draw the trail
        this.canvas.context.lineTo(this.players[i].x, this.players[i].y);
        this.canvas.context.stroke();
        this.canvas.context.closePath();

        this.test(this.players[i].x, this.players[i].y);
        this.load(this.players[i].x, this.players[i].y);
    }
}

/**
 * Starts the game loop.
 */
Game.prototype.start = function() {
    this.timer = setInterval(function() {
        this.tick();
    }.bind(this), 10);
}

// run the game
var game = new Game();

// add some players
var player1 = new UserPlayer();
player1.x = 200;
player1.y = 200;
player1.color = "blue";

var player2 = new DemoAiPlayer();
player2.x = 20;
player2.y = 20;
player2.color = "red";

game.addPlayer(player1);
game.addPlayer(player2);

// start the game
game.start();
