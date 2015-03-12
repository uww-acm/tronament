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
    // the dimensions of the board grid
    var boardWidth = 48;
    var boardHeight = 48;
    // a 2d array that stores a collision map for each position on the grid
    var collisionMap = [[]];
    var timer;
    var running = false;
    // a file chooser control
    var fileChooser;

    /**
     * Initializes the Tronament game engine.
     *
     * @param Element canvasElement The canvas element to be used for drawing.
     */
    this.init = function() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        // initialize file chooser
        fileChooser = document.createElement("input");
        fileChooser.type = "file";
        fileChooser.style.display = "none";
        fileChooser.addEventListener("change", function() {
            handleFiles(this.files);
        }, false);
        document.body.appendChild(fileChooser);
    }

    this.setResolution = function(width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    /**
     * Creates an AI module.
     *
     * @param  String   name        The module name.
     * @param  Function constructor An object constructor.
     */
    this.aiModule = function(name, constructor) {
        constructor.name = name;
        this.aiModules[name] = constructor;
    }

    /**
     * Loads a module from file.
     */
    this.loadModule = function() {
        // open the file chooser
        fileChooser.click();
    }

    /**
     * Adds a new player to the game
     *
     * @param Player player A player instance to add.
     */
    this.addPlayer = function(name, x, y, color) {
        var instance = new this.aiModules[name]();
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
        if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) {
            return true;
        }
        if (collisionMap[x] != undefined && collisionMap[x][y] != undefined) {
            return true;
        }
        return false;
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
     * Resets the game to an initial state.
     */
    this.reset = function() {
        collisionMap = [[]];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.players = [];

        this.addPlayer("demo-ai", 10, 10, "blue");
        this.addPlayer("demo-ai", boardWidth - 10, boardHeight - 10, "#2daebf");
    }

    /**
     * Starts the game loop.
     */
    this.start = function() {
        running = true;
        mainLoop();
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
        for (var i = 0; i < this.players.length; i++) {
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

            if (this.query(this.players[i].x, this.players[i].y)) {
                playerDeath(i);
            } else {
                fill(this.players[i], this.players[i].x, this.players[i].y);
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
        this.players.splice(i, 1);
        if (this.players.length == 1)
            this.end(this.players[0]);
    }.bind(this);

    /**
     * Handles files that are chosen with the file chooser dialog.
     *
     * @param Array files An array of files chosen by the user.
     */
    var handleFiles = function(files) {
        // get the chosen file
        var file = fileChooser.files[0];
        var objectURL = window.URL.createObjectURL(file);

        // load the script
        var script = document.createElement("script");
        script.src = objectURL;
        document.body.appendChild(script);
    }.bind(this);
};
