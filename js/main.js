console.log("linked!");

// SET CANVAS SIZE AND APPEND TO BODY
var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 500;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

// DRAW
function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ball.draw();
  player1.draw();
  // player2.draw();
}

// UPDATE
function update() {
  player1.xMid += (player1.vel * Math.sin(player1.rot*Math.PI/180));
  player1.yMid += -(player1.vel * Math.cos(player1.rot*Math.PI/180));
  ball.x += ball.velX;
  ball.y += ball.velY;
  carWallCollisionDetect();
  carFrontBallCollision();
}

// INITIALIZERS
var initialPositionX = 100;
var initialPositionY = CANVAS_HEIGHT/2-25;
var initialRotation = 90;
var thetaF = 0;

var player1 = {
  color: "dodgerblue",
  x: initialPositionX,
  y: initialPositionY,
  rot: initialRotation,
  vel: 0,
  width: 25,
  height: 50,
  init: function() {
    this.xMid = this.x + this.width/2;
    this.yMid = this.y + this.height/2;
    return this;
  },
  draw: function() {
    var drawing = new Image();
    drawing.src = "assets/Car.png";

    canvas.save();
    canvas.translate(this.xMid, this.yMid);
    canvas.rotate(this.rot*Math.PI/180);
    canvas.drawImage(drawing, -this.width/2, -this.height/2,this.width,this.height);
    canvas.restore();
  }
}.init();

// Car 2

// var player2 = {
//   color: "orange",
//   x: initialPositionX,
//   y: initialPositionY,
//   width: 32,
//   height: 32,
//   draw: function() {
//     canvas.fillStyle = this.color;
//     canvas.fillRect(this.x, this.y, this.width, this.height);
//   }
// }

var ball = {
  color: "black",
  x: CANVAS_WIDTH/2,
  y: CANVAS_HEIGHT/2,
  radius: 20,
  velX: -1,
  velY: 0,
  draw: function() {
    canvas.beginPath();
    canvas.arc(this.x, this.y, ball.radius, 0, 2*Math.PI);
    canvas.fillStyle = this.color;
    canvas.fill();
    canvas.stroke();
  }
}


function KeyboardController(keys, repeat) {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers= {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    };
};

KeyboardController({
  // left
    37: function() { player1.rot -= 5; },
  // up
    38: function() { player1.vel += .1; },
  // right
    39: function() { player1.rot += 5; },
  // down
    40: function() { player1.vel -= .1; }
}, 50);

// Define CORNERS
  var northEastCorner, northWestCorner, southEastCorner, southWestCorner;
  var arrayX, arrayY;

function carWallCollisionDetect() {

  var sinTheta = Math.sin(player1.rot*Math.PI/180);
  var cosTheta = Math.cos(player1.rot*Math.PI/180);


  //Actually SouthEast corner on canvas
  northEastCorner = [player1.xMid + ((player1.width/2)*cosTheta) - ((player1.height/2)*sinTheta),
                     player1.yMid + ((player1.width/2)*sinTheta) + ((player1.height/2)*cosTheta)
                     ];

  //Actually SouthWest corner on canvas
  northWestCorner = [player1.xMid + ((-player1.width/2)*cosTheta) - ((player1.height/2)*sinTheta),
                     player1.yMid + ((-player1.width/2)*sinTheta) + ((player1.height/2)*cosTheta)
                     ];

  //Actually NorthEast corner on canvas
  southEastCorner = [player1.xMid + ((player1.width/2)*cosTheta) - ((-player1.height/2)*sinTheta),
                     player1.yMid + ((player1.width/2)*sinTheta) + ((-player1.height/2)*cosTheta)
                     ];


  //Actually NorthWest corner on canvas
  southWestCorner = [player1.xMid + ((-player1.width/2)*cosTheta) - ((-player1.height/2)*sinTheta),
                     player1.yMid + ((- player1.width/2)*sinTheta) + ((-player1.height/2)*cosTheta)
                     ];

  arrayX = [northEastCorner[0], northWestCorner[0], southEastCorner[0], southWestCorner[0]];
  arrayY = [northEastCorner[1], northWestCorner[1], southEastCorner[1], southWestCorner[1]];

  // Check X values
  for (var i=0; i < arrayX.length; i++) {
    if (arrayX[i] >= CANVAS_WIDTH) {
      while (arrayX[i] >= CANVAS_WIDTH) {
        player1.xMid -= 2;
        carWallCollisionDetect();
      }
    }
    if (arrayX[i] <= 0) {
      while (arrayX[i] <= 0) {
        player1.xMid += 2;
        carWallCollisionDetect();
      }
    }
  }
  // Check Y values
  for (var i=0; i < arrayY.length; i++) {
    if (arrayY[i] >= CANVAS_HEIGHT) {
      while (arrayY[i] >= CANVAS_HEIGHT) {
        player1.yMid -= 2;
        carWallCollisionDetect();
      }
    }
    if (arrayY[i] <= 0) {
      while (arrayY[i] <= 0) {
        player1.yMid += 2;
        carWallCollisionDetect();
      }
    }
  }
}


function frontFaceToBallCalc() {
  // Front face collision
    var frontFaceVector = [arrayX[2] - arrayX[3], arrayY[2] - arrayY[3]];
    var frontFaceMag = player1.width;
    var frontFacePtv = [ball.x - arrayX[3], ball.y - arrayY[3]];
    var unitFrontFaceVector=[];
    var projFrontVect=[];
    var closest=[];

    for (var i=0; i<2; i++) {
      unitFrontFaceVector[i] = frontFaceVector[i]/frontFaceMag;
    }

    var projFrontMag = math.dot(frontFacePtv, unitFrontFaceVector);

    if (projFrontMag < 0) {
      closest = [arrayX[2], arrayY[2]];
    } else if (projFrontMag > frontFaceMag) {
      closest = [arrayX[3], arrayY[3]];
    } else {
      for (var i=0; i<2; i++) {
        projFrontVect[i] = projFrontMag*unitFrontFaceVector[i];
      }
      closest = [arrayX[3] + projFrontVect[0] , arrayY[3] + projFrontVect[1]];
    }

    var distVect = [ball.x - closest[0], ball.y - closest[1]];
    var distMag = math.hypot(distVect[0], distVect[1]);

    return [distMag, projFrontMag];
}

function carFrontBallCollision() {
  var frontFaceResult = frontFaceToBallCalc();
  // if Contact

  if (frontFaceResult[0] < ball.radius) {
    var velMag;
    var turnAngle = player1.rot*Math.PI/180;
    var bounceAngle = Math.atan(ball.velY / (ball.velX + player1.vel));

    console.log("ball.velY = " + ball.velY);
    console.log("ball.velX = " +ball.velX);
    console.log("player1.vel = " +player1.vel);
    console.log("______________________________");

    if (ball.velY >= 0) {
      velMag = math.hypot(ball.velY, (ball.velX + player1.vel));
    } else {
      velMag = ball.velX + player1.vel;
    }

    var resultAngle = turnAngle + bounceAngle + Math.PI/2;

    ball.velX = (-velMag * Math.cos(Math.abs(resultAngle)));
    ball.velY = (-velMag * Math.sin(Math.abs(resultAngle)));

    ball.x += -velMag * Math.cos(resultAngle);
    ball.y += -velMag * Math.sin(resultAngle);

    /* CHANGE PLAYER SPEED REDUCTION AFTER HIT */

    player1.vel = player1.vel * .50;
  }
}


// FPS SETTING
var FPS = 60;
setInterval(function() {
  update();
  draw();
}, 1000/FPS);
