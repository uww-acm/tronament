var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
//ctx.miterLimit=10;
//ctx.lineTo(20, 100);
//ctx.lineTo(90, 100);
var x = 20;
var y = 20;

var a = 200;
var b = 200;

var ct = 0;
var count = 0;
var mov = 1;
var movp = 1;

var playDir = 38;
var snake1x = [];
//var snakeAIx = [];
var snake1y = [];
//var snakeAIy = [];

function load(c, d) {
    snake1x[count] = c;
    snake1y[count] = d;
    $(".counter").text("length = " + count + " x= " + snake1x[count] + " y= " + snake1y[count]);
    count++;
}

function test(c, d) {
    for (var i = 0; i < count; i++) {
        if (c == snake1x[i] && d == snake1y[i]) {
            alert("game over");
            clearInterval(timer);
            return false;
        }
    }
}

function rng(c, d) {
    if (mov == 1) {
        $(".dir").text("direction: right");
        //moving right
        for (var i = 0; i < count; i++) {
            var f = c + 3;
            if (f - snake1x[i] <= 0 && snake1y[i] == d) {
                $(".bump").text("bump right " + snake1x[i] + " " + f);
                mov = 4;
            }
        }
    } else if (mov == 2) {
        //moving down
        $(".dir").text("direction: down");
        for (var i = 0; i < count; i++) {
            if ((d + 3) - snake1y[i] <= 0 && snake1x[i] == c) {
                //direction change
                $(".bump").text("bump down");
                mov = 1;
            }
        }
    } else if (mov == 3) {
        //moving left
        $(".dir").text("direction: left");
        for (var i = 0; i < count; i++) {
            if ((c - 3) - snake1x[i] >= 0 && snake1y[i] == d) {
                //direction change
                $(".bump").text("bump left");
                mov = 2;
            }
        }
    } else if (mov == 4) {
        //moving up
        $(".dir").text("direction: up");
        for (var i = 0; i < count; i++) {
            if ((d - 3) - snake1y[i] >= 0 && snake1x[i] == c) {
                //direction change
                $(".bump").text("bump up");
                if (c == 3) {
                    mov = 1;
                } else {
                    mov = 3;
                }
            }
        }
    }
}

function targ() {
    var chng = Math.floor((Math.random() * 50) + 1);
    if (chng == 1 && mov != 3) {
        mov = 1;
    } else if (chng == 2 && mov != 4) {
        mov = 2;
    } else if (chng == 3 && mov != 1) {
        mov = 3;
    } else if (chng == 4 && mov != 2) {
        mov = 4;
    }
    rng(x, y);

    if (playDir == 39) {
        movp = 1;
    } else if (playDir == 40) {
        movp = 2;
    } else if (playDir == 37) {
        movp = 3;
    } else if (playDir == 38) {
        movp = 4;
    }
}

function move() {
    //targ();
    rng(x, y);
    rng(x, y);
    rng(x, y);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(x, y);
    if (x == 3) {
        //alert("wall");
        y = y + 1;
        x = x + 1;
        mov == 2;
    } else if (y == 3) {
        //alert("wall");
        x = x + 1;
        y = y + 1;
        mov == 1;
    } else if (x == 447) {
        //alert("wall");
        y = y + 1;
        x = x - 1;
        mov == 4;

    } else if (y == 447) {
        //alert("wall");
        y = y - 1;
        x = x + 1;
        mov == 1;
    }
    /*if(x<0){
    x++;
    }else if(y<0){
    y++;
    }else if(x>300){
    x--;
    }else if(y>150){
    y--;
    }*/
    else {
        //var mov = Math.floor((Math.random() * 4)+1);
        if (mov == 1) {
            //move right
            x = x + 1;
        } else if (mov == 2) {
            //move down
            y = y + 1;
        } else if (mov == 3) {
            //move left
            x = x - 1;
        } else if (mov == 4) {
            //move up
            y = y - 1;
        }
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    //alert(mov);
    test(x, y);
    load(x, y);


    targ();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(a, b);
    if (a < 0) {
        a++;
    } else if (b < 0) {
        b++;
    } else if (a > 450) {
        a--;
    } else if (b > 450) {
        b--;
    } else {
        //var mov = Math.floor((Math.random() * 4)+1);
        if (movp == 1) {
            a = a + 1;
        } else if (movp == 2) {
            b = b + 1;
        } else if (movp == 3) {
            a = a - 1;
        } else if (movp == 4) {
            b = b - 1;
        }
    }
    ctx.lineTo(a, b);
    ctx.stroke();
    ctx.closePath();
    //alert(mov);
    test(a, b);
    load(a, b);
}

var timer = setInterval(function() {
    move()
}, 5);

window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(e) {
    if (e.keyCode == "38") {
        //up
        //playMoveU();
        playDir = 38;
        ct++;
        $(".count").text("length = " + ct);
    }

    if (e.keyCode == "40") {
        //down
        playDir = 40;
        //playMoveD();
        ct++;
        $(".count").text("length = " + ct);
    }

    if (e.keyCode == "37") {
        //left
        playDir = 37;
        //playMoveL();
        ct++;
        $(".count").text("length = " + ct);
    }

    if (e.keyCode == "39") {
        //right
        playDir = 39;
        //playMoveR();
        ct++;
        $(".count").text("length = " + ct);
    }
}
