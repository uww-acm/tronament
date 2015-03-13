/**
 * Super smart AI.
 */
tronament.aiModule("example-ai", function() {
    var secretValue = 3; // private
    this.publicValue = secretValue; // public

    this.move = function() {
        if (this.queryRelative(0, -1) == true) {
            return tronament.DIRECTION_LEFT;
        } else {
            return tronament.DIRECTION_UP;
        }
    }
});
