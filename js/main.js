console.log("linked!");

// SET CANVAS SIZE AND APPEND TO BODY
var CANVAS_WIDTH = 1100;
var CANVAS_HEIGHT = 555;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

// DRAW
function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player1.draw();
  ball.draw();

  // player2.draw();
}

// UPDATE
function update() {
  player1.xMid += (player1.vel * Math.sin(player1.rot*Math.PI/180));
  player1.yMid += -(player1.vel * Math.cos(player1.rot*Math.PI/180));

if (ball.velX < -3) {
  ball.velX = -3;
  ball.x += ball.velX;
} else {
  ball.x += ball.velX;
}
if (ball.velY < -3) {
  ball.velX = -3;
  ball.x += ball.velX;
} else {
  ball.x += ball.velX;
}

if (ball.velX > 3) {
  ball.velX = 3;
  ball.x += ball.velX;
} else {
  ball.x += ball.velX;
}
if (ball.velY > 3) {
  ball.velY = 3;
  ball.y += ball.velY;
} else {
  ball.y += ball.velY;
}

  ballWallCollisionDetect();
  carWallCollisionDetect();
  carFrontBallCollision();
  carRightBallCollision();
  carLeftBallCollision();
  carBottomBallCollision();
  northEastCornerHit();
  northWestCornerHit();
  southEastCornerHit();
  southWestCornerHit();
}

// INITIALIZERS
var initialPositionX = CANVAS_WIDTH/4-12.5;
var initialPositionY = CANVAS_HEIGHT/2-25;
var initialRotation = 90;
var thetaF = 0;

var player1 = {
  color: "dodgerblue",
  x: initialPositionX,
  y: initialPositionY,
  rot: initialRotation,
  vel: 0,
  width: 45,
  height: 75,
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
  radius: 30,
  velX: 0,
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
    37: function() { player1.rot -= 8; },
  // up
    38: function() { player1.vel += .1; },
  // right
    39: function() { player1.rot += 8; },
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

Math.roundTo = function(place, value) {
  return Math.round(value * place) / place;
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
    ball.color = "white";
    var velMag;
    var turnAngle = player1.rot*Math.PI/180;
    var bounceAngle = Math.atan(ball.velY / (ball.velX + player1.vel));


    // if(player1.vel*Math.sin(player1.rot) > )
      velMag = Math.hypot(ball.velY, (ball.velX + player1.vel));
    // } else {
    //   velMag = ball.velX + player1.vel;
    // }
    var resultAngle = turnAngle + bounceAngle  + Math.PI/2;
    // console.log("ballvXINITIAL = " +ball.velX);
    ball.velX = -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    ball.velY = -velMag * Math.roundTo(100000, Math.sin(resultAngle));
    // console.log("turnAngle= " + turnAngle);
    // console.log("bounceAngle" + bounceAngle);
    // console.log("resultAngle" + resultAngle);
    // console.log("velmag = " +velMag);
    // console.log("ballvXFINAL = " +ball.velX);
    // console.log("________________________________");


    ball.x += -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    ball.y += -velMag * Math.roundTo(100000, Math.sin(resultAngle));

    /* CHANGE PLAYER SPEED REDUCTION AFTER HIT */

    player1.vel = player1.vel * .50;
  }
}

function rightFaceToBallCalc() {
  // right face collision
    var rightFaceVector = [arrayX[2] - arrayX[0], arrayY[2] - arrayY[0]];
    var rightFaceMag = player1.height;
    var rightFacePtv = [ball.x - arrayX[0], ball.y - arrayY[0]];
    var unitRightFaceVector=[];
    var projRightVect=[];
    var closest=[];

    for (var i=0; i<2; i++) {
      unitRightFaceVector[i] = rightFaceVector[i]/rightFaceMag;
    }

    var projRightMag = math.dot(rightFacePtv, unitRightFaceVector);

    if (projRightMag < 0) {
      closest = [arrayX[2], arrayY[2]];
    } else if (projRightMag > rightFaceMag) {
      closest = [arrayX[0], arrayY[0]];
    } else {
      for (var i=0; i<2; i++) {
        projRightVect[i] = projRightMag*unitRightFaceVector[i];
      }
      closest = [arrayX[0] + projRightVect[0] , arrayY[0] + projRightVect[1]];
    }

    var distVect = [ball.x - closest[0], ball.y - closest[1]];
    var distMag = Math.hypot(distVect[0], distVect[1]);

    return [distMag, projRightMag];
}

function carRightBallCollision() {
  var rightFaceResult = rightFaceToBallCalc();
  // if Contact on right face

  if (rightFaceResult[0] < ball.radius) {
    ball.color = "red";
    var velMag;
    var turnAngle = player1.rot*Math.PI/180;
    var bounceAngle = Math.atan(ball.velY / (ball.velX));

      velMag = Math.hypot(ball.velY, ball.velX);

    var resultAngle = turnAngle + bounceAngle  + Math.PI/2;

    ball.velX = -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    ball.velY = -velMag * Math.roundTo(100000, Math.sin(resultAngle));


    ball.x += -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    ball.y += -velMag * Math.roundTo(100000, Math.sin(resultAngle));

    /* CHANGE PLAYER SPEED REDUCTION AFTER HIT */

    player1.vel = player1.vel * .75;
  }
}

function leftFaceToBallCalc() {
  // left face collision
    var leftFaceVector = [arrayX[1] - arrayX[3], arrayY[1] - arrayY[3]];
    var leftFaceMag = player1.height;
    var leftFacePtv = [ball.x - arrayX[3], ball.y - arrayY[3]];
    var unitLeftFaceVector=[];
    var projLeftVect=[];
    var closest=[];

    for (var i=0; i<2; i++) {
      unitLeftFaceVector[i] = leftFaceVector[i]/leftFaceMag;
    }

    var projLeftMag = math.dot(leftFacePtv, unitLeftFaceVector);

    if (projLeftMag < 0) {
      closest = [arrayX[1], arrayY[1]];
    } else if (projLeftMag > leftFaceMag) {
      closest = [arrayX[3], arrayY[3]];
    } else {
      for (var i=0; i<2; i++) {
        projLeftVect[i] = projLeftMag*unitLeftFaceVector[i];
      }
      closest = [arrayX[3] + projLeftVect[0] , arrayY[3] + projLeftVect[1]];
    }

    var distVect = [ball.x - closest[0], ball.y - closest[1]];
    var distMag = Math.hypot(distVect[0], distVect[1]);

    return [distMag, projLeftMag];
}

function carLeftBallCollision() {
  var leftFaceResult = leftFaceToBallCalc();
  // if Contact on left face

  if (leftFaceResult[0] <= ball.radius) {
    // COLLISION DATA
    console.log("+++++++++++++++++++++++++++++++++");
    console.log("COLLISION");
    console.log("initial ball.velX = " + ball.velX);
    console.log("initial ball.velY = " + ball.velY);
    ball.color = "green";
    var velMag;
    var turnAngle = player1.rot*Math.PI/180;
    var bounceAngle = Math.atan(ball.velY / ball.velX);
    console.log("turnAngle = " +turnAngle);
    console.log("bounceAngle = " +bounceAngle);

      velMag = Math.hypot(ball.velY, ball.velX);
    console.log("velMag = " + velMag);
    var resultAngle = turnAngle + bounceAngle  - Math.PI/2;
    console.log("resultAngle = " +resultAngle);

    ball.velX = -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    ball.velY = -velMag * Math.roundTo(100000, Math.sin(resultAngle));

    console.log("final ball.velX = " + ball.velX);
    console.log("final ball.velY = " + ball.velY);

    // ball.x += -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    // ball.y += -velMag * Math.roundTo(100000, Math.sin(resultAngle));

    /* CHANGE PLAYER SPEED REDUCTION AFTER HIT */

    player1.vel = player1.vel * .75;
  }
}

function bottomFaceToBallCalc() {
  // bottom face collision
    var bottomFaceVector = [arrayX[0] - arrayX[1], arrayY[0] - arrayY[1]];
    var bottomFaceMag = player1.height;
    var bottomFacePtv = [ball.x - arrayX[1], ball.y - arrayY[1]];
    var unitBottomFaceVector=[];
    var projBottomVect=[];
    var closest=[];

    for (var i=0; i<2; i++) {
      unitBottomFaceVector[i] = bottomFaceVector[i]/bottomFaceMag;
    }

    var projBottomMag = math.dot(bottomFacePtv, unitBottomFaceVector);

    if (projBottomMag < 0) {
      closest = [arrayX[0], arrayY[0]];
    } else if (projBottomMag > bottomFaceMag) {
      closest = [arrayX[1], arrayY[1]];
    } else {
      for (var i=0; i<2; i++) {
        projBottomVect[i] = projBottomMag*unitBottomFaceVector[i];
      }
      closest = [arrayX[1] + projBottomVect[0] , arrayY[1] + projBottomVect[1]];
    }

    var distVect = [ball.x - closest[0], ball.y - closest[1]];
    var distMag = Math.hypot(distVect[0], distVect[1]);

    return [distMag, projBottomMag];
}

function carBottomBallCollision() {
  var bottomFaceResult = bottomFaceToBallCalc();
  // if Contact on bottom face

  if (bottomFaceResult[0] < ball.radius) {

    ball.color = "blue";
    var velMag;
    var turnAngle = player1.rot*Math.PI/180;
    var bounceAngle = Math.atan(ball.velY / ball.velX);

      velMag = Math.hypot(ball.velY, ball.velX);

    var resultAngle = turnAngle + bounceAngle + Math.PI;

    ball.velX = -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    ball.velY = -velMag * Math.roundTo(100000, Math.sin(resultAngle));


    ball.x += -velMag * Math.roundTo(100000, Math.cos(resultAngle));
    ball.y += -velMag * Math.roundTo(100000, Math.sin(resultAngle));

    /* CHANGE PLAYER SPEED REDUCTION AFTER HIT */

    player1.vel = player1.vel * .75;
  }
}

function ballWallCollisionDetect() {
  if (ball.x + ball.radius >= CANVAS_WIDTH) {
    ball.velX = -ball.velX;
    while (ball.x + ball.radius >= CANVAS_WIDTH) {
      ball.x -= 2;
    }
  }
  if (ball.x - ball.radius <= 0) {
    ball.velX = -ball.velX;
    while (ball.x - ball.radius <= 0) {
      ball.x += 2;
    }
  }
  if (ball.y + ball.radius >= CANVAS_HEIGHT) {
    ball.velY = -ball.velY;
    while (ball.y + ball.radius >= CANVAS_HEIGHT) {
      ball.y -= 2;
    }
  }
  if (ball.y - ball.radius <= 0) {
    ball.velY = -ball.velY;
    while (ball.y - ball.radius <= 0) {
      ball.y += 2;
    }
  }
}

/* CORNER HIT DETECTION */

// TAKES ARRAY corner AND TESTS IF IT IS WITHIN THE BALL
function testCornerInBall(corner) {
  // corner[0] = x
  // corner[1] = y
  // Uses equation of a circle to calculate if corner lies within the ball
  if (Math.pow(corner[0] - ball.x, 2) + Math.pow(corner[1] - ball.y, 2) < Math.pow(ball.radius, 2)) {
    console.log("cornerDETECTED");
    return true;
  } else {
    return false;
  }
}

/* CORNER HIT RESPONSE */

function northEastCornerHit() {
  if (testCornerInBall(southEastCorner)) {

    ball.color = "orange";
    ball.velY += -player1.vel*Math.cos(player1.rot*Math.PI/180);
    ball.velX += player1.vel*Math.sin(player1.rot*Math.PI/180);
  }
}

function northWestCornerHit() {
  if (testCornerInBall(southWestCorner)) {

    ball.color = "teal";
    ball.velY += -player1.vel*Math.cos(player1.rot*Math.PI/180);
    ball.velX += player1.vel*Math.sin(player1.rot*Math.PI/180);
  }
}

function southEastCornerHit() {
  if (testCornerInBall(northEastCorner)) {

    ball.color = "chartreuse";
    ball.velY += -player1.vel*Math.cos(player1.rot*Math.PI/180);
    ball.velX += player1.vel*Math.sin(player1.rot*Math.PI/180);
  }
}

function southWestCornerHit() {
  if (testCornerInBall(northWestCorner)) {

    ball.color = "pink";
    ball.velY += -player1.vel*Math.cos(player1.rot*Math.PI/180);
    ball.velX += player1.vel*Math.sin(player1.rot*Math.PI/180);
  }
}

/* BALL SPEED DECAY */

function ballFriction() {
  var ballVelMagTi = Math.hypot(ball.velX, ball.velY);
  var velAngle = Math.atan(ball.velX/ball.velY);
    if (ballVelMagTi > 1) {
      // CONTROL DECELERATION DUE TO FRICTION HERE
      var ballVelMagTf = ballVelMagTi - 1;
      if (ball.velY > 0) {
        ball.velY -= ballVelMagTi*Math.cos(velAngle) - ballVelMagTf*Math.cos(velAngle);
      } else {
        ball.velY += ballVelMagTi*Math.cos(velAngle) - ballVelMagTf*Math.cos(velAngle);
      }
      if (ball.velX > 0) {
        ball.velX -= ballVelMagTi*Math.sin(velAngle) - ballVelMagTf*Math.sin(velAngle);
      } else {
        ball.velX += ballVelMagTi*Math.sin(velAngle) - ballVelMagTf*Math.sin(velAngle);
      }
    }
  }

// // SPEED DECAY FUNCTION CALL
// setInterval(ballFriction, 600);

// FPS SETTING
var FPS = 60;
setInterval(function() {
  update();
  requestAnimationFrame(draw);
}, 1000/FPS);
