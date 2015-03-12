window.tronament.ui = new function() {
    var optionsMenuVisible = false;
    var dialogBoxVisible = false;

    this.showOptions = function() {
        document.getElementById("optionsMenu").style.display = "block";
        document.querySelector("#optionsMenu .focus").focus();
        optionsMenuVisible = true;
    }

    this.hideOptions = function() {
        document.getElementById("optionsMenu").style.display = "none";
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
     * @param String title   The title of the dialog box.
     * @param String message The dialog box message.
     */
    this.showDialog = function(title, message) {
        document.getElementById("dialogBoxTitle").textContent = title;
        document.getElementById("dialogBoxMessage").textContent = message;
        document.getElementById("dialogBox").style.display = "block";
        document.querySelector("#dialogBox button").focus();
        dialogBoxVisible = true;
    }

    /**
     * Hides a currently displayed dialog box, if any.
     */
    this.hideDialog = function() {
        document.getElementById("dialogBox").style.display = "none";
        dialogBoxVisible = false;
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

    this.updatePlayerWidgets = function() {
        var widgetContainer = document.getElementById("playerWidgets");
        widgetContainer.innerHTML = "";

        for (var i = 0; i < tronament.options.playerCount; i++) {
            widgetContainer.appendChild(createPlayerWidget(i + 1));
        }
    }

    /**
     * Creates a player widget for the control panel sidebar.
     * @param  Number  playerNumber The player number the widget belongs to.
     * @return Element              The widget element.
     */
    var createPlayerWidget = function(playerNumber) {
        var widget = document.createElement("div");
        widget.className = "player-widget";

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

        // fill select with all AI modules
        var aiModuleNames = Object.keys(tronament.aiModules);
        for (var name in tronament.aiModules) {
            var option = document.createElement("option", name);
            option.textContent = name;
            select.appendChild(option);
        }

        // append and return
        selectWrapper.appendChild(select);
        widget.appendChild(selectWrapper);
        return widget;
    }.bind(this);

    window.addEventListener("load", function() {
        this.updatePlayerWidgets();
    }.bind(this), false);

    document.addEventListener("keyup", function(e) {
        if (e.keyCode == 27) {
            this.hideOptions();
            this.playAudio("sound30");
        }
    }.bind(this), false);

    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("mouseover", function(e) {
            this.playAudio("sound35");
        }.bind(this), false);

        buttons[i].addEventListener("mousedown", function(e) {
            this.playAudio("sound30");
        }.bind(this), false);
    }

    document.getElementById("fastMovementCheckbox").addEventListener("change", function(e) {
        tronament.options.fastMovement = this.checked;
    }, false);

    document.getElementById("fpsToggle").addEventListener("change", function(e) {
        tronament.debug.showFps = this.checked;
    }, false);

    document.getElementById("startButton").addEventListener("click", function(e) {
        tronament.reset();
        tronament.start();
    }, false);


    document.getElementById("loadModuleButton").addEventListener("click", function(e) {
        tronament.loadModule();
    }, false);

    // handle the fullscreen button
    document.getElementById("fullscreenButton").addEventListener("click", function(e) {
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
    }, false);

    // handle the reset button
    document.getElementById("resetButton").addEventListener("click", function(e) {
        tronament.running = false;
        window.cancelAnimationFrame(tronament.timer);
        tronament.reset();
    }, false);
}
