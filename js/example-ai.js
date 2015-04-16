/**
 * Super smart AI.
 */
tronament.aiModule("example-ai", function() {
    this.move = function() {
        if (this.queryRelative(0, -1) == tronament.EMPTY) {
            return tronament.NORTH;
        } else if (this.queryRelative(0, 1) == tronament.EMPTY) {
            return tronament.SOUTH;
        } else if (this.queryRelative(1, 0) == tronament.EMPTY) {
            return tronament.EAST;
        } else {
            return tronament.WEST;
        }
    }
});
