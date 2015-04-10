window.tronament.ui = new function() {
    var optionsMenuVisible = false;
    var dialogBoxVisible = false;

    // a file picker control
    var filePicker;

    /**
     * Displays the options menu.
     */
    this.showOptions = function() {
        document.getElementById("options-menu").style.display = "block";
        document.querySelector("#options-menu .focus").focus();
        optionsMenuVisible = true;
    }

    /**
     * Hides the options menu.
     */
    this.hideOptions = function() {
        document.getElementById("options-menu").style.display = "none";
        optionsMenuVisible = false;
    }

    /**
     * Toggles the options menu.
     */
    this.toggleOptions = function() {
        if (!optionsMenuVisible) {
            this.showOptions();
        } else {
            this.hideOptions();
        }
    }

    /**
     * Shows a fancy dialog box, similar to alert().
     *
     * @param String title   The title of the dialog box.
     * @param String message The dialog box message.
     */
    this.showDialog = function(title, message, bigText) {
        var dialogBox = document.getElementById("dialog-box");

        document.getElementById("dialog-box-title").textContent = title;
        document.getElementById("dialog-box-message").textContent = message;
        dialogBox.style.display = "block";
        if (bigText) {
            dialogBox.classList.add("big-text");
        } else {
            dialogBox.classList.remove("big-text");
        }

        document.querySelector("#dialog-box button").focus();
        dialogBoxVisible = true;
    }

    /**
     * Hides a currently displayed dialog box, if any.
     */
    this.hideDialog = function() {
        document.getElementById("dialog-box").style.display = "none";
        dialogBoxVisible = false;
    }

    /**
     * Opens a file picker and calls a callback with the files selected, if any.
     *
     * @param Function callback The callback to pass the selected files to.
     */
    this.openFilePicker = function(callback) {
        // register the callback to be invoked if any files are changed
        filePicker.onchange = function() {
            this.onchange = null; // erase this callback
            callback(this.files);
        }
        // open the file picker
        filePicker.click();
    }

    /**
     * Updates the player widgets UI in the control panel.
     */
    this.updatePlayerWidgets = function() {
        var widgetContainer = document.getElementById("player-widgets");
        widgetContainer.innerHTML = "";

        for (var i = 0; i < tronament.options.playerCount; i++) {
            widgetContainer.appendChild(createPlayerWidget(i + 1));
        }
    }

    /**
     * Plays a named audio clip.
     *
     * @param String name The name of the clip to play.
     */
    this.playAudio = function(name) {
        var audio = new Audio("assets/" + name + ".mp3");
        audio.play();
    }

    /**
     * Toggles full-screen display.
     */
    this.toggleFullscreen = function() {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            var element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    /**
     * Creates a player widget for the control panel sidebar.
     *
     * @param  Number  playerNumber The player number the widget belongs to.
     * @return Element              The widget element.
     */
    var createPlayerWidget = function(playerNumber) {
        var widget = document.createElement("div");
        widget.className = "player-widget";
        widget.id = "player-" + playerNumber + "-widget";

        // header
        widget.appendChild(function() {
            var e = document.createElement("h2");
            e.textContent = "Player " + playerNumber;
            return e;
        }());

        // ai module select
        var selectWrapper = document.createElement("span");
        selectWrapper.className = "select";
        var select = document.createElement("select");
        select.id = "player-ai-" + playerNumber;
        select.dataset.playerNumber = playerNumber;

        // fill select with all AI modules
        for (var name in tronament.aiModules) {
            var option = document.createElement("option");
            option.value = option.textContent = name;
            select.appendChild(option);
        }

        var colors = ["red", "orange", "yellow", "green", "blue", "purple"];

        // color select
        var colorWrapper = document.createElement("span");
        colorWrapper.className = "select";
        var colorSelect = document.createElement("select");
        colorSelect.id = "player-color-" + playerNumber;
        colorSelect.dataset.playerNumber = playerNumber;

        // fill color select with colors
        for (var i = 0; i < colors.length; i++) {
            var option = document.createElement("option");
            option.value = option.textContent = colors[i];
            colorSelect.appendChild(option);
        }

        // ai message box
        var messageBox = document.createElement("p");
        messageBox.innerHTML = "<label>Status:</label><textarea readonly id='player-" + playerNumber + "-message'></textarea>";
        widget.appendChild(messageBox);

        // append and return
        selectWrapper.appendChild(select);
        widget.appendChild(selectWrapper);
        colorWrapper.appendChild(colorSelect);
        widget.appendChild(colorWrapper);
        return widget;
    }.bind(this);

    window.addEventListener("load", function() {
        // initialize file chooser
        filePicker = document.createElement("input");
        filePicker.type = "file";
        filePicker.style.display = "none";
        document.body.appendChild(filePicker);

        this.updatePlayerWidgets();

        var buttons = document.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("mouseover", function(e) {
                this.playAudio("sound35");
            }.bind(this), false);

            buttons[i].addEventListener("mousedown", function(e) {
                this.playAudio("sound30");
            }.bind(this), false);
        }

        document.getElementById("player-count-dropdown").addEventListener("change", function(e) {
            tronament.options.playerCount = this.value;
            window.tronament.ui.updatePlayerWidgets();
        }, false);

        document.getElementById("fast-movement-checkbox").addEventListener("change", function(e) {
            tronament.options.fastMovement = this.checked;
        }, false);

        document.getElementById("fps-toggle").addEventListener("change", function(e) {
            tronament.debug.showFps = this.checked;
        }, false);

        document.getElementById("start-button").addEventListener("click", function(e) {
            tronament.start();
        }, false);

        document.getElementById("load-module-button").addEventListener("click", function(e) {
            tronament.loadModule();
        }, false);

        // handle the fullscreen button
        document.getElementById("fullscreen-button").addEventListener("click", function(e) {
            tronament.ui.toggleFullscreen();
        }, false);

        // handle the board size options
        document.getElementById("option-board-width").addEventListener("change", function(e) {
            tronament.setBoardSize(parseInt(this.value), tronament.getBoardSize().height);
        }, false);
        document.getElementById("option-board-height").addEventListener("change", function(e) {
            tronament.setBoardSize(tronament.getBoardSize().width, parseInt(this.value));
        }, false);
    }.bind(this), false);
}
