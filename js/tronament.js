window.tronament = new function() {
    // some constants
    this.NORTH = 1;
    this.SOUTH = 2;
    this.WEST = 3;
    this.EAST = 4;

    this.EMPTY = 0;
    this.TRAIL = 1;
    this.OPPONENT = 2;
    this.WALL = 4;
    this.OUT_OF_BOUNDS = 8;

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
    var boardWidth, boardHeight;
    // a 2d array that stores a collision map for each position on the grid
    var collisionMap = [[]];
    var squareWidth, squareHeight;
    var timer;
    var running = false;
    var lastLoadedModule;
    var alivePlayerCount = 0;

    /**
     * Initializes the Tronament game engine.
     *
     * @param Element canvasElement The canvas element to be used for drawing.
     */
    this.init = function() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        this.setBoardSize(48, 48);
    }

    /**
     * Gets the dimensions of the board.
     *
     * @return Object An object whose "width" property is the width of the board
     *                and "height" property is the height of the board.
     */
    this.getBoardSize = function() {
        return {
            width: boardWidth,
            height: boardHeight
        };
    }

    /**
     * Sets the dimensions of the board.
     *
     * @param Number width  The new board width.
     * @param Number height The new board height.
     */
    this.setBoardSize = function(width, height) {
        boardWidth = width;
        boardHeight = height;

        // do some calculations ahead of time for rendering performance
        squareWidth = Math.round(canvas.width / boardWidth);
        squareHeight = Math.round(canvas.height / boardHeight);
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
         * @return Number    A Space value indicating what is in the space.
         */
        constructor.prototype.queryAbsolute = function(x, y) {
            var playerIndex = players.indexOf(this);
            var result = tronament.query(x, y);

            // do an additional check for opponent trail
            if (result == tronament.TRAIL && collisionMap[x][y] != playerIndex) {
                result = result | tronament.OPPONENT;
            }

            return result;
        }

        /**
         * Queries the game for what is at a location relative to the player's current position.
         *
         * @param  Number  x The x-coordinate offset of the position.
         * @param  Number  y The y-coordinate offset of the position.
         * @return Number    A Space value indicating what is in the space.
         */
        constructor.prototype.queryRelative = function(x, y) {
            var playerIndex = players.indexOf(this);
            return this.queryAbsolute(playerCoordinates[playerIndex].x + x, playerCoordinates[playerIndex].y + y);
        }

        /**
         * Displays a fun message in the Tronament UI.
         *
         * @param String message The message to display.
         */
        constructor.prototype.message = function(message) {
            var playerIndex = players.indexOf(this);
            var messageBox = document.getElementById("player-" + (playerIndex + 1) + "-message");
            messageBox.value = message;
        }

        this.aiModules[name] = constructor;
        lastLoadedModule = name;
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
     * @return Number    A Space value indicating what is in the space.
     */
    this.query = function(x, y) {
        if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) {
            return this.OUT_OF_BOUNDS;
        }
        if (collisionMap[x] != undefined && collisionMap[x][y] != undefined) {
            return this.TRAIL;
        }
        return this.EMPTY;
    }

    /**
     * Resets all the game variables and starts a new game running.
     */
    this.start = function() {
        players = [];
        collisionMap = [[]];
        playerCoordinates = [
            { x: Math.floor(boardWidth * 0.1), y: Math.floor(boardHeight * 0.1) },
            { x: Math.floor(boardWidth * 0.9), y: Math.floor(boardHeight * 0.9) },
            { x: Math.floor(boardWidth * 0.1), y: Math.floor(boardHeight * 0.9) },
            { x: Math.floor(boardWidth * 0.9), y: Math.floor(boardHeight * 0.1) }
        ];

        // create player objects
        for (var i = 0; i < this.options.playerCount; i++) {
            // get the desired a.i. module for this player
            var name = document.getElementById("player-ai-" + (i + 1)).value;

            // initialize an a.i. module instance
            try {
                var instance = new this.aiModules[name]();
            } catch(e) {
                tronament.ui.showDialog("Error", "The A.I. \"" + name + "\" created the following exception: " + e.message);
                return;
            }

            // set player's color as requested
            instance.color = document.getElementById("player-color-" + (i + 1)).value;

            // let the a.i. know we are ready
            players[i] = instance;
            if (typeof instance.onReady === "function") {
                instance.onReady();
            }
        }

        alivePlayerCount = players.length;
        running = true;
        mainLoop();
    }

    /**
     * Ends the game.
     */
    this.end = function(player) {
        terminateLoop();
        tronament.ui.showDialog("Game Over", "Player " + (players.indexOf(player) + 1) + " (" + player.name + ") Wins!", true);
        tronament.ui.playAudio("sound2");
    }

    var terminateLoop = function() {
        running = false;
        cancelAnimationFrame(timer);
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
            // ignore dead players :(
            if (players[i].__dead)
                continue;

            // tell the player to move
            try {
                var move = players[i].move(this);
            } catch(e) {
                tronament.ui.showDialog("Error", "The A.I. \"" + players[i].name + "\" created the following exception: " + e.message);
                terminateLoop();
                return;
            }

            // adjust the player position based on the direction
            if (move == this.EAST) {
                playerCoordinates[i].x++;
            } else if (move == this.SOUTH) {
                playerCoordinates[i].y++;
            } else if (move == this.WEST) {
                playerCoordinates[i].x--;
            } else if (move == this.NORTH) {
                playerCoordinates[i].y--;
            }

            if (this.query(playerCoordinates[i].x, playerCoordinates[i].y)) {
                playerDeath(i);
            } else {
                fill(i, playerCoordinates[i].x, playerCoordinates[i].y);
            }
        }
    }.bind(this);

    /**
     * Fills a player's position into the collision map.
     *
     * @param Number x The x-coordinate of the position.
     * @param Number y The y-coordinate of the position.
     */
    var fill = function(playerIndex, x, y) {
        if (collisionMap[x] == undefined) {
            collisionMap[x] = [];
        }
        collisionMap[x][y] = playerIndex;
    }.bind(this);

    /**
     * Removes a player from the game.
     */
    var playerDeath = function(i) {
        // tell the a.i. that it died
        if (typeof players[i].onDeath === "function") {
            players[i].onDeath();
        }

        // remove player from game
        alivePlayerCount--;
        players[i].__dead = true;

        if (alivePlayerCount <= 1) {
            for (var i = 0; i < players.length; i++) {
                if (!players[i].__dead) {
                    this.end(players[i]);
                }
            }
        }
    }.bind(this);

    /**
     * Renders the game screen to the canvas.
     */
    var draw = function() {
        // wipe the canvas clean
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // calculate the size of the trails

        // render all trails
        for (var x = 0; x < collisionMap.length; x++) {
            if (collisionMap[x] != undefined) {
                for (var y = 0; y < collisionMap[x].length; y++) {
                    if (collisionMap[x][y] != undefined) {
                        var player = players[collisionMap[x][y]];
                        ctx.fillStyle = player.color;
                        ctx.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    }
                }
            }
        }

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
