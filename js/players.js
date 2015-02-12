/**
 * Base class for players.
 */
function Player() {
    this.direction = Player.DIRECTION_RIGHT;
    this.name = "";
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
function UserPlayer(name) {
    window.addEventListener("keydown", this.checkKeyPressed.bind(this), false);
    this.name = name;
}

// extend player
UserPlayer.prototype = new Player();

/**
 * Handles keyboard presses.
 */
UserPlayer.prototype.checkKeyPressed = function(e) {
    //up
    if (e.keyCode == 38) {
        this.direction = Player.DIRECTION_UP;
    }
    //down
    else if (e.keyCode == 40) {
        this.direction = Player.DIRECTION_DOWN;
    }
    //left
    else if (e.keyCode == 37) {
        this.direction = Player.DIRECTION_LEFT;
    }
    //right
    else if (e.keyCode == 39) {
        this.direction = Player.DIRECTION_RIGHT;
    }
}


/**
 * Original AI player.
 */
function DemoAiPlayer(name) {
    this.direction = 1;
    this.name = name;
}

// extend player
DemoAiPlayer.prototype = new Player();

/**
 * Moves based on some randomness and some checks.
 */
DemoAiPlayer.prototype.move = function(game) {
    var move = Math.floor((Math.random() * 100) + 1);

    if (move == Player.DIRECTION_RIGHT && this.directionIsSafe(move)) {
        this.direction = Player.DIRECTION_RIGHT;
    } else if (move == Player.DIRECTION_DOWN && this.directionIsSafe(move)) {
        this.direction = Player.DIRECTION_DOWN;
    } else if (move == Player.DIRECTION_LEFT && this.directionIsSafe(move)) {
        this.direction = Player.DIRECTION_LEFT;
    } else if (move == Player.DIRECTION_UP && this.directionIsSafe(move)) {
        this.direction = Player.DIRECTION_UP;
    }

    if (!this.directionIsSafe(this.direction)) {
        if (this.directionIsSafe(Player.DIRECTION_RIGHT)) {
            this.direction = Player.DIRECTION_RIGHT;
        } if (this.directionIsSafe(Player.DIRECTION_DOWN)) {
            this.direction = Player.DIRECTION_DOWN;
        } if (this.directionIsSafe(Player.DIRECTION_LEFT)) {
            this.direction = Player.DIRECTION_LEFT;
        } if (this.directionIsSafe(Player.DIRECTION_UP)) {
            this.direction = Player.DIRECTION_UP;
        }
    }

    return this.direction;
}

DemoAiPlayer.prototype.directionIsSafe = function(direction) {
    if (direction == Player.DIRECTION_RIGHT && game.query(this.x + 1, this.y)) {
        return false;
    } else if (direction == Player.DIRECTION_DOWN && game.query(this.x, this.y + 1)) {
        return false;
    } else if (direction == Player.DIRECTION_LEFT && game.query(this.x - 1, this.y)) {
        return false;
    } else if (direction == Player.DIRECTION_UP && game.query(this.x, this.y - 1)) {
        return false;
    }
    return true;
}
