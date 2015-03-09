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
        if (e.keyCode == 38 && direction != tronament.DIRECTION_DOWN) {
            direction = tronament.DIRECTION_UP;
        }
        //down
        else if (e.keyCode == 40 && direction != tronament.DIRECTION_UP) {
            direction = tronament.DIRECTION_DOWN;
        }
        //left
        else if (e.keyCode == 37 && direction != tronament.DIRECTION_RIGHT) {
            direction = tronament.DIRECTION_LEFT;
        }
        //right
        else if (e.keyCode == 39 && direction != tronament.DIRECTION_LEFT) {
            direction = tronament.DIRECTION_RIGHT;
        }
    }

    window.addEventListener("keydown", function(e) {
        this.checkKeyPressed(e);
    }.bind(this), false);
});
