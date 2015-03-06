window.tronament = new function() {
    // some constants
    this.DIRECTION_RIGHT = 1;
    this.DIRECTION_DOWN = 2;
    this.DIRECTION_LEFT = 3;
    this.DIRECTION_UP = 4;

    this.speed = 1;

    var canvas, context;

    var aiModules = [];
    var players = [];
    var playerCount;
    var fileChooser;
    var collisionMap = [[]];
    var boardWidth = 100;
    var boardHeight = 100;
    var running = false;
    var timer;

    /**
     * Initializes the Tronament game engine.
     *
     * @param Element canvasElement The canvas element to be used for drawing.
     */
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
        //alert(player.name + " Wins");
        clearTimeout(timer);
        running = false;
        this.reset();
        this.start();
    }

    /**
     * Resets the game to an initial state.
     */
    this.reset = function() {
        collisionMap = [[]];
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.players = [];
        running = false;

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

    var mainLoop = function() {
        if (running) {
            timer = setTimeout(function() {
                window.requestAnimationFrame(mainLoop);
            }, 5 / window.tronament.speed);
        }

        tick();
    }

    /**
     * Renders the game screen to the canvas.
     */
    var render = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var squareWidth = canvas.width / boardWidth;
        var squareHeight = canvas.height / boardHeight;

        for (var x = 0; x < collisionMap.length; x++) {
            if (collisionMap[x] != undefined) {
                for (var y = 0; y < collisionMap[x].length; y++) {
                    if (collisionMap[x][y] != undefined) {
                        var player = collisionMap[x][y];
                        context.fillStyle = player.color;
                        context.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    }
                }
            }
        }
    }.bind(this);

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

            // draw the trail
            //context.fillStyle = this.players[i].color;
            //context.fillRect(this.players[i].x, this.players[i].y, 1, 1);

            if (this.query(this.players[i].x, this.players[i].y)) {
                playerDeath(i);
            } else {
                fill(this.players[i], this.players[i].x, this.players[i].y);
            }
        }

        render();
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
