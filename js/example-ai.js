/**
 * Super smart AI.
 */
tronament.aiModule("example-ai", function() {
    var secretValue = 3; // private
    this.publicValue = secretValue; // public

    this.move = function() {
        if (this.queryRelative(0, -1) != tronament.Space.EMPTY) {
            return tronament.Direction.LEFT;
        } else {
            return tronament.Direction.UP;
        }
    }
});
