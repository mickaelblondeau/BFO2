(function() {
  var Arena, CollisionManager, ControllablePlayer, Cube, CubeManager, FallingCube, Game, Keyboard, LevelManager, Player, SquareEnum, StaticCube, animFrame, arena, bg, collisionManager, config, cubeManager, fallingCubes, game, keyboard, levelManager, player, players, stage, staticBg, staticCubes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  config = {
    FPS: 60,
    fpsSkip: 10,
    levelHeight: 976,
    levelWidth: 704,
    levelSpeed: 1000
  };

  Keyboard = (function() {
    function Keyboard() {
      this.defineEvents();
      this.keys = {
        left: false,
        right: false,
        up: false,
        down: false
      };
    }

    Keyboard.prototype.defineEvents = function() {
      var my_combos;
      my_combos = [
        {
          keys: "left",
          on_keydown: function(e) {
            e.preventDefault();
            return keyboard.keys.left = true;
          },
          on_release: function() {
            return keyboard.keys.left = false;
          }
        }, {
          keys: "right",
          on_keydown: function(e) {
            e.preventDefault();
            return keyboard.keys.right = true;
          },
          on_release: function() {
            return keyboard.keys.right = false;
          }
        }, {
          keys: "down",
          on_keydown: function(e) {
            e.preventDefault();
            return keyboard.keys.down = true;
          },
          on_release: function() {
            return keyboard.keys.down = false;
          }
        }, {
          keys: "up",
          on_keydown: function(e) {
            e.preventDefault();
            return keyboard.keys.up = true;
          },
          on_release: function() {
            return keyboard.keys.up = false;
          }
        }, {
          keys: "r",
          on_keydown: function(e) {
            e.preventDefault();
            return game.reset();
          }
        }, {
          keys: "space",
          on_keydown: function(e) {
            e.preventDefault();
            return game.launch();
          }
        }
      ];
      return keypress.register_many(my_combos);
    };

    return Keyboard;

  })();

  animFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame || null;

  Game = (function() {
    function Game() {
      this.lastFrame = Date.now();
      this.statsInit();
    }

    Game.prototype.loop = function() {
      var frameTime, thisFrame;
      thisFrame = Date.now();
      frameTime = thisFrame - this.lastFrame;
      animFrame(Game.prototype.loop.bind(this));
      this.lastFrame = thisFrame;
      game.statsBegin();
      game.update(frameTime);
      return game.statsEnd();
    };

    Game.prototype.update = function(frameTime) {};

    Game.prototype.start = function() {
      this.resize();
      return this.loop();
    };

    Game.prototype.resize = function() {
      var scale;
      scale = window.innerHeight / config.levelHeight;
      stage.setScaleX(scale);
      stage.setScaleY(scale);
      stage.draw();
      return document.getElementById("container").style.width = config.levelWidth * scale + "px";
    };

    Game.prototype.statsInit = function() {
      this.fps = new Stats();
      return document.body.appendChild(this.fps.domElement);
    };

    Game.prototype.statsBegin = function() {
      return this.fps.begin();
    };

    Game.prototype.statsEnd = function() {
      return this.fps.end();
    };

    Game.prototype.reset = function() {
      levelManager.reset();
      return player.reset();
    };

    Game.prototype.launch = function() {
      return levelManager.launch();
    };

    return Game;

  })();

  CollisionManager = (function() {
    function CollisionManager() {}

    CollisionManager.prototype.getBoundBox = function(shape) {
      return {
        top: shape.getY(),
        bottom: shape.getY() + shape.getHeight(),
        left: shape.getX(),
        right: shape.getX() + shape.getWidth()
      };
    };

    CollisionManager.prototype.colliding = function(a, b) {
      return !((a.left >= b.right) || (a.right <= b.left) || (a.top >= b.bottom) || (a.bottom <= b.top));
    };

    return CollisionManager;

  })();

  Player = (function() {
    function Player(x, y) {
      this.x = x;
      this.y = y;
      this.draw();
      this.heightCouched = 30;
      this.height = 62;
    }

    Player.prototype.draw = function() {
      this.shape = new Kinetic.Rect({
        x: this.x,
        y: this.y,
        width: 32,
        height: 62,
        stroke: 'black',
        strokeWidth: 1
      });
      return players.add(this.shape);
    };

    return Player;

  })();

  ControllablePlayer = (function(_super) {
    __extends(ControllablePlayer, _super);

    function ControllablePlayer(x, y) {
      ControllablePlayer.__super__.constructor.call(this, x, y);
      this.speed = 0.3;
      this.fallingSpeed = 6;
      this.falling = true;
      this.alive = true;
      this.jumpSpeed = 0.3;
      this.jumpHeight = 80;
      this.jumpMax = 1;
      this.jump = false;
      this.canJump = true;
      this.jumpStart = 0;
      this.jumpCount = 0;
      this.couched = false;
      this.actualCollisions = [];
    }

    ControllablePlayer.prototype.reset = function() {
      this.shape.setX(200);
      this.shape.setY(256);
      return this.alive = true;
    };

    ControllablePlayer.prototype.kill = function() {
      this.shape.setX(32);
      this.shape.setY(32);
      return this.alive = false;
    };

    ControllablePlayer.prototype.update = function(frameTime) {
      var collide, moveSpeed;
      if (this.alive) {
        collide = this.testDiff();
        if (collide && collide.getName() === 'falling') {
          this.kill();
        }
        if (!this.jump) {
          this.doFall();
        } else {
          this.doJump(frameTime);
        }
        moveSpeed = this.speed * frameTime;
        if (keyboard.keys.left) {
          collide = this.testMove(this.shape.getX() - moveSpeed, 0);
          if (collide) {
            this.shape.setX(collide.getX() + collide.getWidth());
          }
        }
        if (keyboard.keys.right) {
          collide = this.testMove(this.shape.getX() + moveSpeed, 0);
          if (collide) {
            this.shape.setX(collide.getX() - this.shape.getWidth());
          }
        }
        if (keyboard.keys.up) {
          if (this.canJump) {
            this.startJump();
          }
        } else {
          this.canJump = true;
        }
        if (keyboard.keys.down) {
          this.startCouch();
        } else {
          this.stopCouch();
        }
        HTML.query('#jump').textContent = this.jump;
        HTML.query('#jumps').textContent = this.jumpCount + '/' + this.jumpMax;
        HTML.query('#falling').textContent = this.falling;
        return HTML.query('#alive').textContent = this.alive;
      }
    };

    ControllablePlayer.prototype.doFall = function() {
      var collide;
      if (this.jumpCount === 0) {
        this.jumpCount = 1;
      }
      collide = this.testMove(0, this.shape.getY() + this.fallingSpeed);
      if (collide) {
        return this.stopFall(collide.getY());
      }
    };

    ControllablePlayer.prototype.stopFall = function(y) {
      this.shape.setY(y - this.shape.getHeight());
      return this.jumpCount = 0;
    };

    ControllablePlayer.prototype.startJump = function() {
      this.canJump = false;
      if (this.jumpCount < this.jumpMax && !this.couched) {
        this.jumpCount++;
        this.jump = true;
        return this.jumpStart = this.shape.getY();
      }
    };

    ControllablePlayer.prototype.doJump = function(frameTime) {
      var collide;
      if (this.jumpStart - this.shape.getY() < this.jumpHeight) {
        collide = this.testMove(0, this.shape.getY() - this.jumpSpeed * frameTime);
        if (collide) {
          this.shape.setY(collide.getY() + collide.getHeight());
          this.stopJump();
        }
        return this.jumpTime += frameTime;
      } else {
        return this.stopJump();
      }
    };

    ControllablePlayer.prototype.stopJump = function() {
      return this.jump = false;
    };

    ControllablePlayer.prototype.startCouch = function() {
      if (!this.couched) {
        this.couched = true;
        this.shape.setHeight(this.heightCouched);
        return this.shape.setY(this.shape.getY() + this.height - this.heightCouched);
      }
    };

    ControllablePlayer.prototype.stopCouch = function() {
      var collide;
      if (this.couched) {
        this.couched = false;
        this.shape.setHeight(this.height);
        collide = this.testMove(0, this.shape.getY() - this.height + this.heightCouched);
        if (collide) {
          return this.startCouch();
        }
      }
    };

    ControllablePlayer.prototype.getCollisions = function() {
      var cubes, playerBoundBox, result;
      result = [];
      playerBoundBox = collisionManager.getBoundBox(this.shape);
      cubes = staticCubes.find('Rect');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(playerBoundBox, cubeBoundBox)) {
          return result.push(cube);
        }
      });
      cubes = fallingCubes.find('Rect');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(playerBoundBox, cubeBoundBox)) {
          return result.push(cube);
        }
      });
      return result;
    };

    ControllablePlayer.prototype.testMove = function(x, y) {
      var collision, collisions, list, _i, _len;
      list = this.getCollisions();
      if (x !== 0) {
        this.shape.setX(x);
      }
      if (y !== 0) {
        this.shape.setY(y);
      }
      collisions = this.getCollisions();
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        if (__indexOf.call(list, collision) < 0) {
          if (x !== 0 && collision.getY() !== this.shape.getY() + this.shape.getHeight()) {
            return collision;
          }
          if (y !== 0 && collision.getX() !== this.shape.getX() + this.shape.getWidth() && collision.getX() + collision.getWidth() !== this.shape.getX()) {
            return collision;
          }
        }
      }
      return false;
    };

    ControllablePlayer.prototype.testDiff = function() {
      var collision, collisions, _i, _len;
      collisions = this.getCollisions();
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        if (__indexOf.call(this.actualCollisions, collision) < 0) {
          this.actualCollisions = collisions;
          return collision;
        }
      }
      this.actualCollisions = collisions;
      return false;
    };

    return ControllablePlayer;

  })(Player);

  SquareEnum = {
    SMALL: 32,
    MEDIUM: 64,
    LARGE: 128
  };

  Cube = (function() {
    function Cube(x, y, size, color) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = color;
      this.draw();
    }

    Cube.prototype.draw = function() {
      return this.shape = new Kinetic.Rect({
        x: this.x,
        y: this.y,
        width: this.size,
        height: this.size,
        fill: this.color,
        stroke: 'black',
        strokeWidth: 1
      });
    };

    return Cube;

  })();

  FallingCube = (function(_super) {
    __extends(FallingCube, _super);

    function FallingCube(col, size, destination) {
      var x, y;
      x = col * 32 + 160;
      y = stage.getY() * -1;
      FallingCube.__super__.constructor.call(this, x, y, size, this.getColor());
      fallingCubes.add(this.shape);
      this.shape.setName('falling');
      this.shape.draw();
      this.destination = 880 - destination * 32 - size;
      this.diffY = this.destination - y;
      this.speed = 600;
      this.fall();
    }

    FallingCube.prototype.fall = function() {
      var self, tween;
      self = this;
      tween = new Kinetic.Tween({
        node: this.shape,
        duration: this.diffY / this.speed,
        y: this.destination,
        onFinish: function() {
          return self.shape.setName(null);
        }
      });
      return tween.play();
    };

    FallingCube.prototype.getColor = function() {
      var colors;
      colors = ["red", "orange", "yellow", "green", "blue", "cyan", "purple"];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    return FallingCube;

  })(Cube);

  StaticCube = (function(_super) {
    __extends(StaticCube, _super);

    function StaticCube(x, y, size) {
      StaticCube.__super__.constructor.call(this, x, y, size, 'white');
      staticCubes.add(this.shape);
      this.shape.draw();
    }

    return StaticCube;

  })(Cube);

  CubeManager = (function() {
    function CubeManager() {
      this.map = [];
      this.resetMap();
      this.updateRate = 0;
      this.current = 0;
      this.levelHeight = 0;
      this.running = false;
      this.waiting = false;
    }

    CubeManager.prototype.start = function(level, rate) {
      if (!this.running && !this.waiting) {
        this.updateRate = rate;
        this.current = 0;
        this.levelHeight += level;
        this.running = true;
        HTML.query('#cmr').textContent = true;
        HTML.query('#cml').textContent = level;
        return HTML.query('#cms').textContent = rate;
      }
    };

    CubeManager.prototype.reset = function() {
      this.levelHeight = 0;
      this.stop();
      this.waiting = false;
      return this.resetMap();
    };

    CubeManager.prototype.stop = function() {
      this.running = false;
      return HTML.query('#cmr').textContent = false;
    };

    CubeManager.prototype.wait = function() {
      this.stop();
      this.waiting = true;
      return levelManager.update();
    };

    CubeManager.prototype.resetMap = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 11; i = ++_i) {
        _results.push(this.map[i] = 0);
      }
      return _results;
    };

    CubeManager.prototype.sendCube = function() {
      var bigLen, col, cols, midLen, size, smallLen;
      cols = this.checkCols();
      bigLen = cols.big.length;
      midLen = cols.mid.length;
      smallLen = cols.small.length;
      if (smallLen === 0) {
        return false;
      } else {
        if (bigLen === 0) {
          if (midLen === 0) {
            size = SquareEnum.SMALL;
            this.updateRate = 500;
          } else {
            size = this.randSize(2);
          }
        } else {
          size = this.randSize(3);
        }
        col = this.randCol(size, cols);
        new FallingCube(col, size, this.findHeight(size, col));
        this.fillMap(size, col);
        return true;
      }
    };

    CubeManager.prototype.randSize = function(max) {
      var size;
      size = Math.floor(Math.random() * 100);
      if (max === 2) {
        size -= 25;
      }
      if (max === 1) {
        return SquareEnum.SMALL;
      }
      if (size > 75) {
        return SquareEnum.LARGE;
      } else if (size > 40 && size <= 75) {
        return SquareEnum.MEDIUM;
      } else {
        return SquareEnum.SMALL;
      }
    };

    CubeManager.prototype.randCol = function(size, cols) {
      if (size === SquareEnum.LARGE) {
        return cols.big[Math.floor(Math.random() * cols.big.length)];
      } else if (size === SquareEnum.MEDIUM) {
        return cols.mid[Math.floor(Math.random() * cols.mid.length)];
      } else {
        return cols.small[Math.floor(Math.random() * cols.small.length)];
      }
    };

    CubeManager.prototype.fillMap = function(size, col) {
      var heightest;
      heightest = this.findHeight(size, col);
      if (size === SquareEnum.LARGE) {
        this.map[col] = heightest + 4;
        this.map[col + 1] = heightest + 4;
        this.map[col + 2] = heightest + 4;
        return this.map[col + 3] = heightest + 4;
      } else if (size === SquareEnum.MEDIUM) {
        this.map[col] = heightest + 2;
        return this.map[col + 1] = heightest + 2;
      } else {
        return this.map[col] += 1;
      }
    };

    CubeManager.prototype.findHeight = function(size, col) {
      var heightest;
      heightest = 0;
      if (size === SquareEnum.LARGE) {
        heightest = this.map[col];
        if (this.map[col + 1] > heightest) {
          heightest = this.map[col + 1];
        }
        if (this.map[col + 2] > heightest) {
          heightest = this.map[col + 2];
        }
        return heightest;
      } else if (size === SquareEnum.MEDIUM) {
        heightest = this.map[col];
        if (this.map[col + 1] > heightest) {
          heightest = this.map[col + 1];
        }
        return heightest;
      } else {
        return this.map[col];
      }
    };

    CubeManager.prototype.update = function(frameTime) {
      if (this.running) {
        this.current += frameTime;
        if (this.current >= this.updateRate) {
          this.current = 0;
          if (!this.sendCube()) {
            this.wait();
          }
        }
      }
      return HTML.query('#cmc').textContent = this.map;
    };

    CubeManager.prototype.checkCols = function() {
      var availableBig, availableMid, availableSmall, col, i, space, _i, _len, _ref;
      availableSmall = [];
      availableMid = [];
      availableBig = [];
      _ref = this.map;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        col = _ref[i];
        space = this.levelHeight - col;
        if (space > 0) {
          availableSmall.push(i);
        }
        if (space > 1 && this.levelHeight - this.map[i + 1] > 1) {
          availableMid.push(i);
        }
        if (space > 3 && this.levelHeight - this.map[i + 1] > 3 && this.levelHeight - this.map[i + 2] > 3 && this.levelHeight - this.map[i + 3] > 3) {
          availableBig.push(i);
        }
      }
      return {
        small: availableSmall,
        mid: availableMid,
        big: availableBig
      };
    };

    return CubeManager;

  })();

  LevelManager = (function() {
    function LevelManager() {
      this.level = 0;
      this.speed = config.levelSpeed;
      this.tween = [];
      this.lastHeight = 0;
    }

    LevelManager.prototype.launch = function() {
      return this.nextLevel();
    };

    LevelManager.prototype.reset = function() {
      if (this.tween[0] !== void 0) {
        this.tween[0].pause();
      }
      if (this.tween[1] !== void 0) {
        this.tween[1].pause();
      }
      stage.setY(0);
      staticBg.setY(0);
      fallingCubes.destroyChildren();
      stage.draw();
      cubeManager.reset();
      this.level = 0;
      return this.speed = config.levelSpeed;
    };

    LevelManager.prototype.moveStage = function() {
      var height, self;
      self = this;
      height = this.lastHeight * 32;
      this.tween[0] = new Kinetic.Tween({
        node: stage,
        duration: 2,
        y: stage.getY() + height,
        onFinish: function() {
          cubeManager.waiting = false;
          return self.nextLevel();
        }
      });
      this.tween[0].play();
      this.tween[1] = new Kinetic.Tween({
        node: staticBg,
        duration: 2,
        y: staticBg.getY() - height
      });
      return this.tween[1].play();
    };

    LevelManager.prototype.update = function() {
      this.level++;
      this.speed -= 50;
      return this.moveStage();
    };

    LevelManager.prototype.randomizeHeight = function() {
      return Math.floor((Math.random() * 3) + 4);
    };

    LevelManager.prototype.nextLevel = function() {
      this.clearLevel();
      this.lastHeight = this.randomizeHeight();
      cubeManager.start(this.lastHeight, this.speed);
      return HTML.query('#lml').textContent = this.level;
    };

    LevelManager.prototype.clearLevel = function() {
      var cubes, height;
      height = this.lastHeight * 32;
      cubes = fallingCubes.find('Rect');
      return cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight()) {
          return cube.destroy();
        }
      });
    };

    return LevelManager;

  })();

  Arena = (function() {
    function Arena() {
      this.y = stage.getHeight() - 96;
      this.draw();
    }

    Arena.prototype.draw = function() {
      var i, _i, _j, _results;
      for (i = _i = 0; _i <= 13; i = ++_i) {
        new StaticCube(i * 32 + 128, this.y, 32);
      }
      _results = [];
      for (i = _j = 0; _j <= 80; i = ++_j) {
        new StaticCube(128, this.y - i * 32, 32);
        _results.push(new StaticCube(13 * 32 + 128, this.y - i * 32, 32));
      }
      return _results;
    };

    Arena.prototype.reset = function() {
      this.clear();
      return this.draw();
    };

    Arena.prototype.clear = function() {
      var shapes;
      shapes = staticCubes.find('Rect');
      shapes.each(function(shape) {
        return shape.remove();
      });
      return staticCubes.draw();
    };

    return Arena;

  })();

  stage = new Kinetic.Stage({
    container: 'container',
    width: config.levelWidth,
    height: config.levelHeight
  });

  fallingCubes = new Kinetic.Layer();

  staticCubes = new Kinetic.Layer();

  players = new Kinetic.Layer();

  staticBg = new Kinetic.Layer();

  stage.add(staticBg);

  stage.add(players);

  stage.add(staticCubes);

  stage.add(fallingCubes);

  bg = new Kinetic.Rect({
    width: stage.getWidth(),
    height: stage.getHeight(),
    fill: "grey",
    stroke: "black"
  });

  staticBg.add(bg);

  bg.draw();

  game = new Game();

  game.start();

  collisionManager = new CollisionManager();

  arena = new Arena();

  keyboard = new Keyboard();

  player = new ControllablePlayer(500, 256);

  cubeManager = new CubeManager();

  levelManager = new LevelManager();

  new FallingCube(0, SquareEnum.LARGE, 2);

  new FallingCube(4, SquareEnum.MEDIUM, 2);

  new FallingCube(8, SquareEnum.SMALL, 1);

  game.update = function(frameTime) {
    var cubes;
    players.draw();
    player.update(frameTime);
    cubeManager.update(frameTime);
    cubes = fallingCubes.find('Rect');
    return HTML.query('#cc').textContent = cubes.length;
  };

  window.onresize = function() {
    return game.resize();
  };

}).call(this);
