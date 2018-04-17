(function(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext("2d"),
  width = 1440,
  height = 720,
  player = {
    x : 25,
    y : height - 20,
    width: 30,
    height: 30,
    speed : 5,
    velX : 0,
    velY : 0,
    jumping : false,
    grounded : false,
  },
  keys = [],
  friction = 0.9;
  gravity = 0.7;

var boxes = [];

//walls/floor
boxes.push({
  x:0,
  y:0,
  width:20,
  height: height
});
boxes.push({
  x: 0,
  y: height-20,
  width:width,
  height: 50
});
boxes.push({
  x: width-20,
  y: 0,
  width:50,
  height: height
});

//platforms (light plat = 200x20)
//world 1
boxes.push({
    x: 220,
    y: 600,
    width: 100,
    height: 100
});
boxes.push({
    x: 250,
    y: 380,
    width: 200,
    height: 20
});
boxes.push({
    x: 480,
    y: 520,
    width: 200,
    height: 200
});
boxes.push({
    x: 20,
    y: 250,
    width: 200,
    height: 20
});
boxes.push({
    x: 400,
    y: 180,
    width: 300,
    height: 20
});
boxes.push({
    x: 680,
    y: 180,
    width: 150,
    height: 380
});
boxes.push({
    x: 880,
    y: 0,
    width: 20,
    height: 625
});
boxes.push({
    x: 720,
    y: 620,
    width: 180,
    height: 20
});

canvas.width = width;
canvas.height = height;

function update(){
  //check keys
  if(keys[38] || keys[32] || keys[90]){
    //up arrow or space
    if (!player.jumping && player.grounded){
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.speed * 3;
    }
  }
  if(keys[39] || keys[68]){
    //right arrow or d
    if(player.velX < player.speed){
      player.velX++;
    }
  }
  if(keys[37] || keys[81]){
    //left arrow or q
    if(player.velX > -player.speed){
      player.velX--;
    }
  }
  player.velX *= friction;
  player.velY += gravity;
  // player.x += player.velX;
  // player.y += player.velY;

  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = "black";
  ctx.beginPath();

  player.grounded = false;
  for (var i = 0; i < boxes.length; i++) {
      ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

      var dir = colCheck(player, boxes[i]);

      if (dir === "l" || dir === "r") {
          player.velX = 0;
          player.jumping = false;
      } else if (dir === "b") {
          player.grounded = true;
          player.jumping = false;
      } else if (dir === "t") {
          player.velY *= -1;
      }
  }

  if(player.grounded){
    player.velY = 0;
  }

  player.x += player.velX;
  player.y += player.velY;

  ctx.fill();
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);

  // if(player.x >= width-player.width){
  //   player.x = width-player.width;
  // }else if(player.x <= 0){
  //   player.x = 0;
  // }
  // if(player.y >= height-player.height){
  //   player.y = height - player.height;
  //   player.jumping = false;
  // }
}

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
      vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
      // add the half widths and half heights of the objects
      hWidths = (shapeA.width / 2) + (shapeB.width / 2),
      hHeights = (shapeA.height / 2) + (shapeB.height / 2),
      colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
        if (vY > 0) {
            colDir = "t";
            shapeA.y += oY;
        } else {
            colDir = "b";
            shapeA.y -= oY;
        }
    } else {
        if (vX > 0) {
            colDir = "l";
            shapeA.x += oX;
        } else {
            colDir = "r";
            shapeA.x -= oX;
        }
    }
  }
  return colDir;
}

document.body.addEventListener("keydown", function(e){
  keys[e.keyCode]=true;
});
document.body.addEventListener("keyup", function(e){
  keys[e.keyCode]=false;
});

window.addEventListener("load",function(){
  update();
});
