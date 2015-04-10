/**
 * Example of randomly moving AI (it sucks, you probably shouldn't use it).
 */
tronament.aiModule("demo-ai", function() {
    var direction = 1;

    this.onReady = function() {
        this.message("It's go-time!");
    }

    this.onDeath = function() {
        this.message("Curse you, Lightyear!");
    }

    /**
     * Moves based on some randomness and some checks.
     */
    this.move = function() {
        var move = Math.floor((Math.random() * 50) + 1);

        if (move == tronament.Direction.RIGHT && this.directionIsSafe(move)) {
            direction = tronament.Direction.RIGHT;
        } else if (move == tronament.Direction.DOWN && this.directionIsSafe(move)) {
            direction = tronament.Direction.DOWN;
        } else if (move == tronament.Direction.LEFT && this.directionIsSafe(move)) {
            direction = tronament.Direction.LEFT;
        } else if (move == tronament.Direction.UP && this.directionIsSafe(move)) {
            direction = tronament.Direction.UP;
        }

        if (!this.directionIsSafe(direction)) {
            this.message("Whoa! Not that way!");
            if (this.directionIsSafe(tronament.Direction.RIGHT)) {
                direction = tronament.Direction.RIGHT;
            } if (this.directionIsSafe(tronament.Direction.DOWN)) {
                direction = tronament.Direction.DOWN;
            } if (this.directionIsSafe(tronament.Direction.LEFT)) {
                direction = tronament.Direction.LEFT;
            } if (this.directionIsSafe(tronament.Direction.UP)) {
                direction = tronament.Direction.UP;
            }
        }

        return direction;
    }

    /**
     * Makes sure a given direction is a safe move.
     */
    this.directionIsSafe = function(direction) {
        if (direction == tronament.Direction.RIGHT && this.queryRelative(1, 0)) {
            return false;
        } else if (direction == tronament.Direction.DOWN && this.queryRelative(0, 1)) {
            return false;
        } else if (direction == tronament.Direction.LEFT && this.queryRelative(-1, 0)) {
            return false;
        } else if (direction == tronament.Direction.UP && this.queryRelative(0, -1)) {
            return false;
        }
        return true;
    }
});
