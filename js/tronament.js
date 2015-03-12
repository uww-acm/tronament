window.tronament = new function() {
    // some constants
    this.DIRECTION_UP = 1;
    this.DIRECTION_DOWN = 2;
    this.DIRECTION_LEFT = 3;
    this.DIRECTION_RIGHT = 4;

    // game options
    this.options = {
        playerCount: 2,
        fastMovement: false
    }

    // some debug options
    this.debug = {
        // indicates if the framerate should be displayed on the canvas
        showFps: false,
        // the current frame rate
        fps: 0,
        maxFps: 60
    };

    // times used for scheduling, keeping track of frame rate, etc...
    var lastDrawTime, lastSecondTime, lastTickTime;

    // variables used for drawing to the canvas
    var canvas, ctx;

    // a map of all loaded AI classes
    this.aiModules = [];
    // an array of currently active players
    var players = [];
    // an array containing the coordinates of each player
    var playerCoordinates = [];
    // the dimensions of the board grid
    var boardWidth = 48;
    var boardHeight = 48;
    // a 2d array that stores a collision map for each position on the grid
    var collisionMap = [[]];
    var timer;
    var running = false;

    /**
     * Initializes the Tronament game engine.
     *
     * @param Element canvasElement The canvas element to be used for drawing.
     */
    this.init = function() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
    }

    /**
     * Bootstraps an AI module prototype.
     *
     * Here there be dragons. This method uses some meta-programming
     * techniques, so be sure to remember who's who and what's what.
     *
     * @param String   name        The module name.
     * @param Function constructor An object constructor.
     */
    this.aiModule = function(name, constructor) {
        constructor.prototype.name = name;

        // next, define some useful methods for the module to use...

        /**
         * Queries the game for what is at an absolute location.
         *
         * @param  Number  x The x-coordinate of the position.
         * @param  Number  y The y-coordinate of the position.
         * @return Boolean   True if there is an object at the position, otherwise false.
         */
        constructor.prototype.queryAbsolute = function(x, y) {
            return tronament.query(x, y);
        }

        /**
         * Queries the game for what is at a location relative to the player's current position.
         *
         * @param  Number  x The x-coordinate offset of the position.
         * @param  Number  y The y-coordinate offset of the position.
         * @return Boolean   True if there is an object at the position, otherwise false.
         */
        constructor.prototype.queryRelative = function(x, y) {
            var playerIndex = players.indexOf(this);
            return tronament.query(playerCoordinates[playerIndex].x + x, playerCoordinates[playerIndex].y + y);
        }

        this.aiModules[name] = constructor;
    }

    /**
     * Loads a module from file.
     */
    this.loadModule = function() {
        // open the file chooser
        this.ui.openFilePicker(function(files) {
            // get the chosen file
            var file = files[0];
            var objectURL = window.URL.createObjectURL(file);

            // load the script
            var script = document.createElement("script");
            script.src = objectURL;
            document.body.appendChild(script);

            // update the player widgets after the module is loaded
            script.onload = function() {
                this.ui.updatePlayerWidgets();
            }.bind(this);
        }.bind(this));
    }

    /**
     * Sets the resolution of the canvas.
     *
     * @param Number width  The new canvas width.
     * @param Number height The new canvas height.
     */
    this.setResolution = function(width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    /**
     * Queries the game for what is at a given location.
     *
     * @param  Number  x The x-coordinate of the position.
     * @param  Number  y The y-coordinate of the position.
     * @return Boolean   True if there is an object at the position, otherwise false.
     */
    this.query = function(x, y) {
        if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) {
            return true;
        }
        if (collisionMap[x] != undefined && collisionMap[x][y] != undefined) {
            return true;
        }
        return false;
    }

    /**
     * Resets all the game variables and starts a new game running.
     */
    this.start = function() {
        players = [];
        collisionMap = [[]];
        playerCoordinates = [
            { x: 10, y: 10 },
            { x: boardWidth - 10, y: boardHeight - 10 },
            { x: 10, y: boardHeight - 10 },
            { x: boardWidth - 10, y: 10 }
        ];

        for (var i = 0; i < this.options.playerCount; i++) {
            var name = document.getElementById("player-ai-" + (i + 1)).value;
            var instance = new this.aiModules[name]();
            instance.color = "blue";
            players[i] = instance;
        }

        running = true;
        mainLoop();
    }

    /**
     * Ends the game.
     */
    this.end = function(player) {
        tronament.ui.showDialog("Game Over", player.name + " Wins!");
        running = false;
        cancelAnimationFrame(timer);
        tronament.ui.playAudio("sound2");
    }

    /**
     * The main game loop that gets called repeatedly.
     */
    var mainLoop = function() {
        if (!running) {
            return;
        }

        // schedule the main loop to be called again
        timer = requestAnimationFrame(mainLoop);

        // initialize timers
        if (!lastDrawTime || !lastSecondTime || !lastTickTime) {
            lastDrawTime = lastSecondTime = lastTickTime = timestamp();
        }

        var now = timestamp();
        // update fps every second
        if (now - lastSecondTime > 1000) {
            var delta = (now - lastDrawTime) / 1000;
            this.debug.fps = 1 / delta;
            lastSecondTime = now;
        }

        // check if it is time to run the next game tick based on speed setting
        if (this.options.fastMovement || now - lastTickTime > 100) {
            tick();
            lastTickTime = now; // update tick time since we just called it
        }

        // render the display canvas
        draw();
        lastDrawTime = now;
    }.bind(this);

    var timestamp = function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    /**
     * Executes a single tick of the game loop.
     */
    var tick = function() {
        // ask each player to respond with their move
        for (var i = 0; i < players.length; i++) {
            // tell the player to move
            var move = players[i].move(this);

            // adjust the player position based on the direction
            if (move == this.DIRECTION_RIGHT) {
                playerCoordinates[i].x++;
            } else if (move == this.DIRECTION_DOWN) {
                playerCoordinates[i].y++;
            } else if (move == this.DIRECTION_LEFT) {
                playerCoordinates[i].x--;
            } else if (move == this.DIRECTION_UP) {
                playerCoordinates[i].y--;
            }

            if (this.query(playerCoordinates[i].x, playerCoordinates[i].y)) {
                playerDeath(i);
            } else {
                fill(players[i], playerCoordinates[i].x, playerCoordinates[i].y);
            }
        }
    }.bind(this);

    /**
     * Fills a player's position into the collision map.
     *
     * @param Number x The x-coordinate of the position.
     * @param Number y The y-coordinate of the position.
     */
    var fill = function(player, x, y) {
        if (collisionMap[x] == undefined) {
            collisionMap[x] = [];
        }
        collisionMap[x][y] = player;
    }.bind(this);

    /**
     * Removes a player from the game.
     */
    var playerDeath = function(i) {
        players.splice(i, 1);
        if (players.length == 1)
            this.end(players[0]);
    }.bind(this);

    /**
     * Renders the game screen to the canvas.
     */
    var draw = function() {
        // wipe the canvas clean
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // calculate the size of the trails
        var squareWidth = canvas.width / boardWidth;
        var squareHeight = canvas.height / boardHeight;

        // draw the grid
        ctx.strokeStyle = "#334";
        ctx.beginPath();
        for (var i = 0; i < boardWidth; i++) {
            ctx.moveTo(i * squareWidth, 0);
            ctx.lineTo(i * squareWidth, canvas.height);
        }
        for (var i = 0; i < boardHeight; i++) {
            ctx.moveTo(0, i * squareHeight);
            ctx.lineTo(canvas.width, i * squareHeight);
        }
        ctx.stroke();

        // render all trails
        for (var x = 0; x < collisionMap.length; x++) {
            if (collisionMap[x] != undefined) {
                for (var y = 0; y < collisionMap[x].length; y++) {
                    if (collisionMap[x][y] != undefined) {
                        var player = collisionMap[x][y];
                        ctx.fillStyle = player.color;
                        ctx.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    }
                }
            }
        }

        // render debug info
        if (this.debug.showFps) {
            ctx.fillStyle = "white";
            ctx.font = "24px Silkscreen";
            ctx.textAlign = "end";
            ctx.textBaseline = "bottom";
            ctx.fillText("FPS: " + this.debug.fps.toFixed(2), canvas.width - 10, canvas.height - 10);
        }
    }.bind(this);
};
