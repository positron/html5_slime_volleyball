function Player(color, side) {
  //TODO: convert all of these to private variables?
  this.color = color;
  this.side = side;
  this.y = 0;
  this.velY = 0;
  this.lastMove = (new Date()).getTime();
  this.lastJump = 0;
  
  if (this.side === 'left') {
    this.x = 150;
    this.eyeOffset = Math.sin(Math.PI/4) * (Player.PLAYER_RADIUS - Player.EYE_RADIUS);
    this.leftBound = 0 + Player.PLAYER_RADIUS;
    this.rightBound = 750/2-2 - Player.PLAYER_RADIUS;
    this.rightKey = 68; // d
    this.leftKey = 65;  // a
    this.upKey = 87;    // w
  }
  else if (this.side == 'right') {
    this.x = 600;
    this.eyeOffset = Math.sin(Math.PI*3/4) * (Player.PLAYER_RADIUS - Player.EYE_RADIUS);
    this.leftBound = 750/2+2 + Player.PLAYER_RADIUS;
    this.rightBound = 750 - Player.PLAYER_RADIUS;
    this.leftKey = 37;  // left arrow
    this.rightKey = 39; // right arrow
    this.upKey = 38;    // up arrow
  }
  else {
    console.log('ERROR: side needs to be right or left');
  }
};

Player.PLAYER_RADIUS = 38;
Player.EYE_RADIUS = 6;
// All speeds are in px/ms or an accelerations in px/ms/ms
Player.GRAVITY = -2/1000;
Player.JUMP_SPEED = 600/1000;
Player.SPEED = 250/1000;

Player.prototype.draw = function(ctx) {
  // draw the body
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, 275 - this.y, Player.PLAYER_RADIUS, 0, Math.PI, true);
  ctx.fill();
  
  // draw the eye
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(this.x + this.eyeOffset, 275 - this.y - this.eyeOffset, Player.EYE_RADIUS, 0, 2*Math.PI, true);
  ctx.fill();
  
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.arc(this.x + this.eyeOffset, 275 - this.y - this.eyeOffset, Player.EYE_RADIUS/3, 0, 2*Math.PI, true);
  ctx.fill();
};

Player.prototype.move = function(keys) {
  var d = new Date();
  var delta = d.getTime() - this.lastMove;
  this.lastMove = d.getTime();

  if (keys[this.rightKey] === 1)
    this.x += Player.SPEED * delta;
  
  if (keys[this.leftKey] === 1)
    this.x -= Player.SPEED * delta;
  
  if (keys[this.upKey] === 1 && this.y === 0)
    this.lastJump = d.getTime();

  // give 1 free millisecond to simplify the code. Otherwise I would need a special case
  // or the above if statement would set lastJump to now as long as the up key is pressed
  var jumpDelta = d.getTime() - this.lastJump + 1;
  // physics 101: d = d_0 + vt + (1/2)at^2
  this.y = Player.JUMP_SPEED * jumpDelta + 0.5 * Player.GRAVITY * jumpDelta * jumpDelta;

  // Stay in the bounds of the game
  if (this.y < 0)
    this.y = 0;
  if (this.x < this.leftBound)
    this.x = this.leftBound;
  if (this.x > this.rightBound)
    this.x = this.rightBound;
};

