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
        if (e.keyCode == 38) {
            direction = Player.DIRECTION_UP;
        }
        //down
        else if (e.keyCode == 40) {
            direction = Player.DIRECTION_DOWN;
        }
        //left
        else if (e.keyCode == 37) {
            direction = Player.DIRECTION_LEFT;
        }
        //right
        else if (e.keyCode == 39) {
            direction = Player.DIRECTION_RIGHT;
        }
    }

    window.addEventListener("keydown", this.checkKeyPressed.bind(this), false);
});
