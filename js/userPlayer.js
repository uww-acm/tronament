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
        if (e.keyCode == 38 && direction != tronament.Direction.DOWN) {
            direction = tronament.Direction.UP;
        }
        //down
        else if (e.keyCode == 40 && direction != tronament.Direction.UP) {
            direction = tronament.Direction.DOWN;
        }
        //left
        else if (e.keyCode == 37 && direction != tronament.Direction.RIGHT) {
            direction = tronament.Direction.LEFT;
        }
        //right
        else if (e.keyCode == 39 && direction != tronament.Direction.LEFT) {
            direction = tronament.Direction.RIGHT;
        }
    }

    window.addEventListener("keydown", function(e) {
        this.checkKeyPressed(e);
    }.bind(this), false);
});
