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
   this.vy = 0.3;
};

Ball.SPEED = 900/1000;      // speed of ball after collision with a player.. (keep momentum when colliding with wall?)
Ball.RADIUS = 10;
//Ball.GRAVITY = Player.GRAVITY;
Ball.GRAVITY = 0.26/1000;

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

Ball.prototype.getUpdatedVars = function() {
   var walls = this.getWallCollision();
   var net   = this.getNetCollision();

   return walls.time < net.time ? walls : net;
};

Ball.prototype.getGroundCollision = function() {
};

Ball.prototype.getNetCollision = function() {
   fenceWidth = 4;
   var leftSide  = this.getVertWallCollision(750/2 - fenceWidth/2, 40);
   var rightSide = this.getVertWallCollision(750/2 + fenceWidth/2, 40);
   var topSide   = this.getHorWallCollision(750/2 - fenceWidth/2, 750/2 + fenceWidth/2, 40);

   var ret = leftSide.time < rightSide.time ? leftSide : rightSide;
   var ret = ret.time < topSide.time ? ret : topSide;
   return ret;
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

   var y = this.y0 + this.vy * time - 0.5 * Ball.GRAVITY * time * time;
   if (time <= 0 || y > yTop) {
      time = Infinity;
   }

   return {
      time: time,
      newVars: {
         x0: x,
         y0: y,
         vx: -this.vx,
         vy: this.vy - Ball.GRAVITY * time
      }
   };
}

// x1 = left coordinate of wall
// x2 = right coordinate of wall
// y  = y coordinate of wall
Ball.prototype.getHorWallCollision = function(x1, x2, y) {
   // adjust for the radius of the ball
   y += Ball.RADIUS;

   // get the time the ball will hit the wall
   var a = 0.5 * -Ball.GRAVITY;
   var b = this.vy;
   var c = this.y0 - y;
   var discriminant = b*b - 4.0 * a * c;
   var time = (-b + Math.sqrt(discriminant) ) / (2 * a);
   if (time < 0)
      time = (-b - Math.sqrt(discriminant) ) / (2 * a);

   // calculate the x coordinate when the ball passes the plane of the wall
   var x = this.x0 + this.vx * time;

   // if there is no solution or the ball will pass without hitting the wall return an infinite time
   if (discriminant < 0 || x < x1 || x > x2) {
      return  { time: Number.MAX_VALUE,
                 newVars: {}
      };
   }

   return {
      time: time,
      newVars: {
         x0: x,
         y0: y,
         vx: this.vx,
         vy: -this.vy
      }
   };
}

Ball.prototype.move = function(Player1, Player2) {
   var now = Date.now();

   var update = this.getUpdatedVars();
   if (this.tb + update.time < now) {
      console.log('Updating!');
      this.tb += update.time;
      this.x0 = update.newVars.x0;
      this.y0 = update.newVars.y0;
      this.vx = update.newVars.vx;
      this.vy = update.newVars.vy;
   }

   this.printDebug({energy:true});//{vx: true, vy: true, prettyEnergy: true});

   var t = now - this.tb;
   this.y = this.y0 + this.vy * t - 0.5 * Ball.GRAVITY * t * t;

   this.x = this.x0 + this.vx * t;
};

Ball.prototype.draw = function(ctx) {
   ctx.beginPath();
   ctx.fillStyle = 'yellow';
   ctx.arc(this.x, 275 - this.y, Ball.RADIUS, 0, 2*Math.PI, true);
   ctx.fill();
};

/**
 * I find myself printing these repeatedly for debugging.
 */
Ball.prototype.printDebug = function(options) {
   // this.vy is just the starting vy (vx doesn't change so realvx == this.vx)
   var time = Date.now() - this.tb;
   var realvy = this.vy - Ball.GRAVITY * time;

   // velocity = magnitude of x and y vectors
   var velocity = Math.sqrt(this.vx * this.vx + realvy * realvy);

   // potential energy = m * g * h
   var penergy = 1 * Ball.GRAVITY * this.y;

   // kinetic energy = 1/2 * m * v^2
   var kenergy = 0.5 * 1 * velocity * velocity;

   if (options.vx) {
      console.log('Vx = ' + this.vx);
   }
   if (options.vy) {
      console.log('Vy = ' + this.vy);
   }
   if (options.velocity) {
      console.log('V  = ' + velocity);
   }
   if(options.penergy) {
      console.log('PE = ' + penergy);
   }
   if (options.kenergy) {
      console.log('KE = ' + kenergy);
   }
   if (options.energy) {
      console.log('E  = ' + (kenergy+penergy));
   }
   if (options.prettyEnergy) {
      console.log(kenergy + ' + ' + penergy + ' = ' + (kenergy+penergy));
   }
}
