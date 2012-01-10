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
  var player2 = new Player('green', 'right');

  // holds a value of 1 for each key that is currently pressed down
  var KEYS = {};

  var mainLoop = function() {
      drawBackground(ctx);
      
      player1.move(KEYS);
      player1.draw(ctx);
      player2.move(KEYS);
      player2.draw(ctx);
      
      drawBall(ctx, 100, 50);
  };
  mainLoop();
  mainLoopTimer = window.setInterval(mainLoop, 20);

  $('body').keydown(function(event) {
    KEYS[event.which] = 1;
  });

  $('body').keyup(function(event) {
    KEYS[event.which] = 0;
  });
}); // document is ready
