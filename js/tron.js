var canvas = new Canvas(document.getElementById("myCanvas"));

var player1 = new UserPlayer();
var player2 = new DemoAiPlayer();

//canvas.context.miterLimit=10;
//canvas.context.lineTo(20, 100);
//canvas.context.lineTo(90, 100);
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
              canvas.context.fillStyle = "black";
              canvas.context.font = "bold 24px Arial";
              canvas.context.fillText("Game Over", 150, 210);
            clearInterval(timer);
            return false;
        }
    }
}

function targ() {
    mov = player2.move();
    movp = player1.move();
}

function move() {
    canvas.context.beginPath();
    canvas.context.strokeStyle = "red";
    canvas.context.moveTo(x, y);
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
    canvas.context.lineTo(x, y);
    canvas.context.stroke();
    canvas.context.closePath();
    //alert(mov);
    test(x, y);
    load(x, y);


    targ();
    canvas.context.beginPath();
    canvas.context.strokeStyle = "blue";
    canvas.context.moveTo(a, b);
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
    canvas.context.lineTo(a, b);
    canvas.context.stroke();
    canvas.context.closePath();
    //alert(mov);
    test(a, b);
    load(a, b);
}

var timer = setInterval(function() {
    move()
}, 5);
