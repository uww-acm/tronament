/**
 * Base class for players.
 */
function Player() {
    this.direction = 1;
}

// some constants
Player.DIRECTION_RIGHT = 1;
Player.DIRECTION_DOWN = 2;
Player.DIRECTION_LEFT = 3;
Player.DIRECTION_UP = 4;

/**
 * Triggers the player to move and returns the direction the player wishes to move in.
 * @return int
 */
Player.prototype.move = function(game) {
    return this.direction;
}


/**
 * Player that is controlled with the keyboard.
 */
function UserPlayer() {
    window.addEventListener("keydown", this.checkKeyPressed.bind(this), false);
}

// extend player
UserPlayer.prototype = new Player();

/**
 * Handles keyboard presses.
 */
UserPlayer.prototype.checkKeyPressed = function(e) {
    //up
    if (e.keyCode == "38") {
        this.direction = 4;
    }
    //down
    else if (e.keyCode == "40") {
        this.direction = 2;
    }
    //left
    else if (e.keyCode == "37") {
        this.direction = 3;
    }
    //right
    else if (e.keyCode == "39") {
        this.direction = 1;
    }
}


/**
 * Original AI player.
 */
function DemoAiPlayer() {
}

// extend player
DemoAiPlayer.prototype = new Player();

/**
 * Moves based on some randomness and some checks.
 */
DemoAiPlayer.prototype.move = function(game) {
    var chng = Math.floor((Math.random() * 50) + 1);
    if (chng == 1 && this.direction != 3) {
        this.direction = 1;
    } else if (chng == 2 && this.direction != 4) {
        this.direction = 2;
    } else if (chng == 3 && this.direction != 1) {
        this.direction = 3;
    } else if (chng == 4 && this.direction != 2) {
        this.direction = 4;
    }

    this.direction = this.rng(game, this.direction, this.x, this.y);
    this.direction = this.rng(game, this.direction, this.x, this.y);

    if (this.x <= 3) {
        this.y = this.y + 1;
        this.x = this.x + 1;
        //return 2;
    } else if (this.y <= 3) {
        this.x = this.x + 1;
        this.y = this.y + 1;
        //return 1;
    } else if (this.x >= 447) {
        this.y = this.y + 1;
        this.x = this.x - 1;
        //return 4;

    } else if (this.y >= 447) {
        this.y = this.y - 1;
        this.x = this.x + 1;
        //return 1;
    }

    return this.direction;
}

// helper for DemoAiPlayer.move()
DemoAiPlayer.prototype.rng = function(game, mov, c, d) {
    if (mov == 1) {
        $(".dir").text("direction: right");
        //moving right
        for (var i = 0; i < game.count; i++) {
            var f = c + 3;
            if (f - game.snake1x[i] <= 0 && game.snake1y[i] == d) {
                $(".bump").text("bump right " + game.snake1x[i] + " " + f);
                return 4;
            }
        }
    } else if (mov == 2) {
        //moving down
        $(".dir").text("direction: down");
        for (var i = 0; i < game.count; i++) {
            if ((d + 3) - game.snake1y[i] <= 0 && game.snake1x[i] == c) {
                //direction change
                $(".bump").text("bump down");
                return 1;
            }
        }
    } else if (mov == 3) {
        //moving left
        $(".dir").text("direction: left");
        for (var i = 0; i < game.count; i++) {
            if ((c - 3) - game.snake1x[i] >= 0 && game.snake1y[i] == d) {
                //direction change
                $(".bump").text("bump left");
                return 2;
            }
        }
    } else if (mov == 4) {
        //moving up
        $(".dir").text("direction: up");
        for (var i = 0; i < game.count; i++) {
            if ((d - 3) - game.snake1y[i] >= 0 && game.snake1x[i] == c) {
                //direction change
                $(".bump").text("bump up");
                if (c == 3) {
                    return 1;
                } else {
                    return 3;
                }
            }
        }
    }
    return mov;
}
