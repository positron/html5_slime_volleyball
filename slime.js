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
  var ball    = new Ball();

  var mainLoop = function() {
    drawBackground(ctx);
    
    player1.move();
    player1.draw(ctx);
    player2.move();
    player2.draw(ctx);
    
    ball.move(player1, player2);
    ball.draw(ctx);
    //drawBall(ctx, 100, 50);
  };
  mainLoop();
  mainLoopTimer = window.setInterval(mainLoop, 50);

  $('body').keydown(function(event) {
    player1.processKey(event.which, 'down');
    player2.processKey(event.which, 'down');
  });

  $('body').keyup(function(event) {
    player1.processKey(event.which, 'up');
    player2.processKey(event.which, 'up');
  });
}); // document is ready
