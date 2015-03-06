window.tronament = new function() {
    // some constants
    this.DIRECTION_RIGHT = 1;
    this.DIRECTION_DOWN = 2;
    this.DIRECTION_LEFT = 3;
    this.DIRECTION_UP = 4;

    var canvas, context;

    var aiModules = [];
    var players = [];
    var playerCount;
    var fileChooser;

    this.init = function(canvasElement) {
        canvas = canvasElement;
        context = canvas.getContext("2d");

        // initialize file chooser
        fileChooser = document.createElement("input");
        fileChooser.type = "file";
        fileChooser.style.display = "none";
        fileChooser.addEventListener("change", function() {
            handleFiles(this.files);
        }, false);
        document.body.appendChild(fileChooser);
    }

    /**
     * Creates an AI module.
     *
     * @param  String   name        The module name.
     * @param  Function constructor An object constructor.
     */
    this.aiModule = function(name, constructor) {
        constructor.name = name;
        aiModules[name] = constructor;
    }

    /**
     * Loads a module from file.
     */
    this.loadModule = function() {
        // open the file chooser
        fileChooser.click();
    }

    var handleFiles = function(files) {
        // get the chosen file
        var file = fileChooser.files[0];
        var objectURL = window.URL.createObjectURL(file);

        // load the script
        var script = document.createElement("script");
        script.src = objectURL;
        document.body.appendChild(script);
    }.bind(this);

    /**
     * Adds a new player to the game
     *
     * @param Player player A player instance to add.
     */
    this.addPlayer = function(name, x, y, color) {
        var instance = new aiModules[name]();
        instance.name = name;
        instance.x = x;
        instance.y = y;
        instance.color = color;
        this.players.push(instance);
    }

    /**
     * Queries the game for what is at a location.
     *
     * @param Number x The x-coordinate of the position.
     * @param Number y The y-coordinate of the position.
     */
    this.query = function(x, y) {
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
            return true;
        }
        if (this.collisionMap[x] != undefined && this.collisionMap[x][y] == 1) {
            return true;
        }
        return false;
    }

    /**
     * Ends the game.
     */
    this.end = function(player) {
        context.fillStyle = "black";
        context.font = "bold 24px Arial";
        context.fillText("Game Over", canvas.width / 2 - 60, 210);
        context.fillText(player.name + " Wins", canvas.width / 2 - 70, 300); // not exactly centered
        clearInterval(this.timer);
    }

    /**
     * Resets the game to an initial state.
     */
    this.reset = function() {
        this.collisionMap = [[]];
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.players = [];

        this.addPlayer("demo-ai", 200, 200, "blue");
        this.addPlayer("demo-ai", 600, 200, "red");
        this.addPlayer("demo-ai", 200, 600, "green");
        this.addPlayer("demo-ai", 600, 600, "orange");
    }

    /**
     * Starts the game loop.
     */
    this.start = function() {
        this.timer = setInterval(function() {
            tick();
        }, 10);
    }

    /**
     * Executes a single tick of the game loop.
     */
    var tick = function() {
        // ask each player to respond with their move
        for (var i = 0; i < this.players.length; i++) {
            context.beginPath();
            context.strokeStyle = this.players[i].color;
            context.moveTo(this.players[i].x, this.players[i].y);

            // tell the player to move
            var move = this.players[i].move(this);

            // adjust the player position based on the direction
            if (move == this.DIRECTION_RIGHT) {
                this.players[i].x++;
            } else if (move == this.DIRECTION_DOWN) {
                this.players[i].y++;
            } else if (move == this.DIRECTION_LEFT) {
                this.players[i].x--;
            } else if (move == this.DIRECTION_UP) {
                this.players[i].y--;
            }

            // draw the trail
            context.lineTo(this.players[i].x, this.players[i].y);
            context.stroke();
            context.closePath();

            if (this.query(this.players[i].x, this.players[i].y)) {
                playerDeath(i);
            }
            else
                fill(this.players[i].x, this.players[i].y);
        }
    }.bind(this);

    /**
     * Fills a player's position into the collision map.
     *
     * @param Number x The x-coordinate of the position.
     * @param Number y The y-coordinate of the position.
     */
    var fill = function(x, y) {
        if (this.collisionMap[x] == undefined) {
            this.collisionMap[x] = [];
        }
        this.collisionMap[x][y] = 1;
    }.bind(this);

    /**
     * Removes a player from the game.
     */
    var playerDeath = function(i) {
        this.players.splice(i, 1);
        if (this.players.length == 1)
            this.end(this.players[0]);
    }.bind(this);
};
