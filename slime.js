var drawBackground = function(ctx) {
    // blue sky
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 750, 275);
    
    // grey ground
    ctx.fillStyle = 'rgb(128, 128, 128)';
    ctx.fillRect(0, 275, 750, 100);
    
    // white fence in the middle
    fenceWidth = 4;
    fenceTop = 40;
    fenceBottom = 4;
    ctx.fillStyle = 'white';
    ctx.fillRect(750/2 - fenceWidth/2, 275 - fenceTop, fenceWidth, fenceTop + fenceBottom);
};

function Player(color, side) {
    //TODO: convert these to private variables?
    this.color = color;
    this.side = side;
    this.y = 0;
    this.velY = 0;
    
    if (this.side === 'left') {
        this.x = 150;
        this.eyeOffset = Math.sin(Math.PI/4) * (Player.PLAYER_RADIUS - Player.EYE_RADIUS);
        this.leftBound = 0 + Player.PLAYER_RADIUS;
        this.rightBound = 750/2-2 - Player.PLAYER_RADIUS;
    }
    else if (this.side == 'right') {
        this.x = 600;
        this.eyeOffset = Math.sin(Math.PI*3/4) * (Player.PLAYER_RADIUS - Player.EYE_RADIUS);
        this.leftBound = 750/2+2 + Player.PLAYER_RADIUS;
        this.rightBound = 750 - Player.PLAYER_RADIUS;
    }
    else {
        console.log('ERROR: side needs to be right or left');
    }
};

Player.PLAYER_RADIUS = 35;
Player.EYE_RADIUS = 6;

Player.prototype.draw = function(ctx) {
    // draw the body
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, 275 - this.y, Player.PLAYER_RADIUS, 0, Math.PI, true);
    ctx.fill();
    
    // draw the eye
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.x+ this.eyeOffset, 275 - this.y - this.eyeOffset, Player.EYE_RADIUS, 0, 2*Math.PI, true);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(this.x+ this.eyeOffset, 275 - this.y - this.eyeOffset, Player.EYE_RADIUS/3, 0, 2*Math.PI, true);
    ctx.fill();
};

Player.prototype.move = function(keys) {
    if (keys.right === 1)
        this.x += 2;
    
    if (keys.left === 1)
        this.x -= 2;
    
    if (keys.up === 1 && this.y === 0)
        this.velY = 5;
    // TODO make a gravity constant
    this.velY -= 0.2;
    
    this.y += this.velY;
    if (this.y < 0)
        this.y = 0;
    
    if (this.x < this.leftBound)
        this.x = this.leftBound;
    if (this.x > this.rightBound)
        this.x = this.rightBound;
};

var drawBall = function(ctx, xPos, height) {
    var radius = 10;
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(xPos, 275 - height, radius, 0, 2*Math.PI, true);
    ctx.fill();
};

$(document).ready(function() {
  var canvas = $('canvas');
  var ctx = canvas[0].getContext('2d');

  var player1 = new Player('red', 'left');

  var mainLoop = function() {
      //console.log('mainLoop here');
      drawBackground(ctx);
      
      player1.move(KEYS);
      player1.draw(ctx);
      
      drawBall(ctx, 100, 50);
  };
  timer = window.setInterval(mainLoop, 20);

  //Key handling
  KEYS = {
      "left": 0,
      "right": 0,
      "up": 0,
      "down": 0
  };

  $('body').keydown(function(event) {
      switch(event.which)
      {
          case 37:
              KEYS['left'] = 1;
              break;
          case 39:
              KEYS['right'] = 1;
              break;
          case 38:
              KEYS['up'] = 1;
              break;
          case 40:
              KEYS['down'] = 1;
              break;
          default: 
      }
  });

  $('body').keyup(function(event) {
      switch(event.which)
      {
          case 37:
              KEYS['left'] = 0;
              break;
          case 39:
              KEYS['right'] = 0;
              break;
          case 38:
              KEYS['up'] = 0;
              break;
          case 40:
              KEYS['down'] = 0;
              break;
          default: 
      }
  });
}); // document is ready
