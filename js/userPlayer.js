/**
 * Player that is controlled with the keyboard.
 */
tronament.aiModule("user", function() {
    var direction = 1;

    this.move = function() {
        return direction;
    }

    /**
     * Handles keyboard presses.
     */
    this.checkKeyPressed = function(e) {
        //up
        if (e.keyCode == 38 && direction != tronament.SOUTH) {
            direction = tronament.NORTH;
        }
        //down
        else if (e.keyCode == 40 && direction != tronament.NORTH) {
            direction = tronament.SOUTH;
        }
        //left
        else if (e.keyCode == 37 && direction != tronament.EAST) {
            direction = tronament.WEST;
        }
        //right
        else if (e.keyCode == 39 && direction != tronament.WEST) {
            direction = tronament.EAST;
        }
    }

    window.addEventListener("keydown", function(e) {
        this.checkKeyPressed(e);
    }.bind(this), false);
});
