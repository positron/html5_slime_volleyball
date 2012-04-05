// wolfram alpha: 
//derivative with respect to t of ( d_p + x_p * (t - r_p) - d_b - x_b * (t - r_b)) ^2 + (y_p * (t - r_p) - G * (t - r_p)^2 - (y_0 + y_b * (t - r_p) - G * (t - r_b)^2 ) ) ^ 2

// note that I used r_p instead of t_p becuase it confused wolfram alpha (it means time of last change)
// d_p and d_b are d_0p and d_0p respectively
// y_b means v_yb (velocity in y direction of ball), similarly for the x direction and the player object


// http://www.wolframalpha.com/input/?i=derivative+with+respect+to+t+of+%28+d_p+%2B+x_p+*+%28t+-+r_p%29+-+d_b+-+x_b+*+%28t+-+r_b%29%29+%5E2+%2B+%28y_p+*+%28t+-+r_p%29+-+G+*+%28t+-+r_p%29%5E2+-+%28y_0+%2B+y_b+*+%28t+-+r_p%29+-+G+*+%28t+-+r_b%29%5E2+%29+%29+%5E+2

function Ball() {
   // current coordinates of the ball, this is used for drawing
   this.x = 100;
   this.y = 100; // height above the ground, not canvas coordinates

   // timestamp when the ball changed directions last
   this.tb = Date.now();

   // position of the ball when it's velocity vector changed
   this.x0 = this.x;
   this.y0 = this.y;

   // starting velocity of the ball at the time it changed direction
   this.vx = -0.1;
   this.vy = 10;
};

Ball.SPEED = 900/1000;      // speed of ball after collision with a player.. (keep momentum when colliding with wall?)
Ball.RADIUS = 10;

// physics psuedo code
/*
   Loop over every object in the game the ball could collide with and report time of collision
   Pick lowest time and adjust variables
   - variables to update: x0, y0, vx, vy, tb
   Repeat until the lowest time of collision is greater than the current time

   function for each object, pass back object {t, x0, y0, vx, vy}
   select the lowest t and pass that object to a updateVars or something
   or... maybe a closure that updates itself?
 */

Ball.prototype.getGroundCollision = function() {
};

Ball.prototype.getNetCollision = function() {
};

// return the update object for 
Ball.prototype.getWallCollision = function() {
   var leftWall  = this.getVertWallCollision(0,   Infinity);
   var rightWall = this.getVertWallCollision(750, Infinity);

   return leftWall.time < rightWall.time ? leftWall : rightWall;
};

Ball.prototype.getPlayerCollision = function(player) {
   // TODO
   return {
      time: Number.MAX_VALUE,
      newVars: {}
   };
};

// x = x location of wall
// yTop = top of wall
Ball.prototype.getVertWallCollision = function(x, yTop) {
   // adjust for the radius of the ball
   x = x < this.x ? x + Ball.RADIUS : x - Ball.RADIUS;

   // get the time the ball will hit this wall
   var time = (x - this.x0) / this.vx;
   /*
   if (this.x0 < 22) {
   console.log(time);
   }//*/
   var y = this.y0 + this.vy * time - Player.GRAVITY * time * time;
   if (time <= 0 || y > yTop) {
      time = Infinity;
   }

   return {
      time: time,
      newVars: {
         x0: x,
         y0: y,
         vx: -this.vx,
         vy: this.vy
      }
   };
}

Ball.prototype.move = function(Player1, Player2) {
   var now = Date.now();

   var update = this.getWallCollision();
   if (this.tb + update.time < now) {
      // TODO: debug by printing this. I think it is flickering because oscilating between back and forth
      //console.log(update);
      //console.log([this.tb, update.time, now]);
      this.tb += update.time;
      this.x0 = update.newVars.x0;
      //this.y0 = update.newVars.y0;
      this.vx = update.newVars.vx;
      this.vy = update.newVars.vy;
   }

   //this.y = this.y0 + this.vy * t - Player.GRAVITY * t * t;
   // TODO remove when ground collision written
   //this.y = this.y < 0 ? 0 : this.y;
   var t = now - this.tb;
   this.x = this.x0 + this.vx * t;
   //console.log(this.x + '-----------------------');
   //console.log(update);

   //console.log([this.x, this.y]);
};

Ball.prototype.draw = function(ctx) {
   ctx.beginPath();
   ctx.fillStyle = 'yellow';
   ctx.arc(this.x, 275 - this.y, Ball.RADIUS, 0, 2*Math.PI, true);
   ctx.fill();
};
