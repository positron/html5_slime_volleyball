function Player(color, side) {
  this.color = color;

  // string representing which side of the net this player is on
  this.side = side;

  // current location of the player, only used by the draw method
  this.x = 0;
  this.y = 0;

  // initial position of the player at the time it changed direction
  this.x0 = 0;
  this.y0 = 0;

  // initial velocity of the player at the time it changed direction
  this.vy = 0;
  this.vx = 0;

  // timestamp when the player changed directions last
  this.tx = Date.now();
  this.ty = this.tx;

  // Store what keys are down so we can ignore repeated keyDown events
  this.rightKeyDown = false;
  this.leftKeyDown  = false;
  this.upKeyDown    = false;

  // What jump the player is on if the player is holding down the up key
  this.jump = 0;
  
  if (this.side === 'left') {
    this.x0 = 150;

    // cached calculations used to draw the player and keep it in the right place
    this.eyeOffset = Math.sin(Math.PI/4) * (Player.PLAYER_RADIUS - Player.EYE_RADIUS);
    this.leftBound = 0 + Player.PLAYER_RADIUS;
    this.rightBound = 750/2-2 - Player.PLAYER_RADIUS;

    this.rightKey = 68; // d
    this.leftKey = 65;  // a
    this.upKey = 87;    // w
  }
  else if (this.side == 'right') {
    this.x0 = 600;

    // cached calculations used to draw the player and keep it in the right place
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
Player.GRAVITY = 2/1000;
Player.JUMP_V0 = 900/1000;
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

Player.prototype.move = function() {
  // this is the "t" we plug into the standard distance formulas
  var tx = Date.now() - this.tx;
  var ty = Date.now() - this.ty;

  // d = d0 + vt
  this.x = this.x0 + this.vx * tx

  // initial velocity is set, so we are still in the middle of a jump. However,
  // the down key isn't pressed, so we should exit the jump as soon as we hit 
  // the ground
  if (this.vy != 0) {
    // we are in the middle of a jump and the up key is still down, so the player
    // could be bouncing up and down repeatedly
    var timeForOneJump = Math.round(this.vy / Player.GRAVITY);
    var effectiveT = ty % timeForOneJump;
    var jumpNum = Math.floor(ty / timeForOneJump) + 1;

    // if the up key is still pressed, increment the jump counter to whatever
    // jump we're currently on
    if (this.upKeyDown) {
      this.jump = jumpNum;
    }

    // if the jump counter has progressed past the current jump whenever the user
    // let the key go then the jump is over
    if (jumpNum != this.jump && !this.upKeyDown) {
      this.y = 0;
      this.vy = 0;
      this.jump = 0;
    }
    else {
      this.y = this.vy * effectiveT - Player.GRAVITY * effectiveT * effectiveT;
    }
  }
  else {
    this.y = 0;
  }

  // Stay in the bounds of the game
  if (this.x < this.leftBound)
    this.x = this.leftBound;
  if (this.x > this.rightBound)
    this.x = this.rightBound;
};

Player.prototype.processKey = function(key, upDown) {
  // ignore all keypresses except left, right, up
  if (!(key === this.rightKey || key === this.leftKey || key === this.upKey))
    return;

  // ignore repeated keydown events from holding a key down
  if (upDown === 'down') {
    if ( (key === this.rightKey && this.rightKeyDown) ||
         (key === this.leftKey  && this.leftKeyDown) ||
         (key === this.upKey    && this.upKeyDown) )
     {
       return;
     }
  }

  // special case, don't register a velocity changed event
  // if all we do is release the up key
  if (key === this.upKey && upDown == 'up') {
    this.upKeyDown = false;
    // this.vy is still the initial velocity used in the distance formula so don't change it
    return;
  }

  if (key === this.rightKey) {
    this.tx = Date.now();
    this.x0 = this.x;
    if (upDown == 'down') {
      this.vx = Player.SPEED;
      this.rightKeyDown = true;
    }
    else {
      this.vx = this.leftKeyDown ? -Player.SPEED : 0;
      this.rightKeyDown = false;
    }
  }
  else if (key === this.leftKey) {
    this.tx = Date.now();
    this.x0 = this.x;
    if (upDown == 'down') {
      this.vx = -Player.SPEED;
      this.leftKeyDown = true;
    }
    else {
      this.vx = this.rightKeyDown ? Player.SPEED : 0;
      this.leftKeyDown = false;
    }
  }
  else if (key === this.upKey) {
    if (upDown == 'down') {
      this.upKeyDown = true;
      if (this.jump == 0) { // make the player jump if it's not already jumping
        this.ty = Date.now();
        this.vy = Player.JUMP_V0;
      }
    }
    // the down event is handled as a special case above
  }
};
