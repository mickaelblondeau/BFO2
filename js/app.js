(function() {
  var Arena, CollisionManager, ControllablePlayer, Cube, CubeManager, FallingCube, Game, Keyboard, LevelManager, Player, SquareEnum, StaticCube, animFrame, arena, bg, collisionManager, config, cubeManager, fallingCubes, game, keyboard, levelManager, player, players, stage, staticBg, staticCubes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = {
    FPS: 60,
    fpsSkip: 10,
    test: 100,
    levelHeight: 976,
    levelWidth: 704
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
        right: shape.getX() + shape.getWidth(),
        x: shape.getX() + shape.getWidth() / 2,
        y: shape.getY() + shape.getHeight() / 2,
        width: shape.getWidth(),
        height: shape.getHeight()
      };
    };

    CollisionManager.prototype.colliding = function(a, b) {
      return !((a.left > b.right) || (a.right < b.left) || (a.top > b.bottom) || (a.bottom < b.top));
    };

    CollisionManager.prototype.getSide = function(a, b) {
      var margin, sides;
      margin = 2;
      sides = {
        top: false,
        bot: false,
        left: false,
        right: false
      };
      if (a.bottom <= b.top + b.height / 2 && a.left < b.right - margin && a.right > b.left + margin) {
        sides.top = true;
      } else if (a.top >= b.bottom - b.height / 2 && a.left < b.right - margin && a.right > b.left + margin) {
        sides.bot = true;
      }
      if (a.left >= b.right - b.width / 2 && a.bottom >= b.top + margin) {
        sides.left = true;
      } else if (a.right <= b.left + b.width / 2 && a.bottom >= b.top + margin) {
        sides.right = true;
      }
      return sides;
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
      this.speed = 0.25;
      this.couchSpeed = 0.1;
      this.move = {
        left: false,
        right: false
      };
      this.fallingSpeed = 6;
      this.maxJump = 1;
      this.numJump = 1;
      this.jump = false;
      this.jumpLaunched = false;
      this.canJump = true;
      this.falling = true;
      this.couched = false;
      this.stopCouch = false;
      this.tween = null;
      this.lockDirection = {
        left: false,
        right: false
      };
      this.alive = true;
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
      var moveSpeed;
      if (this.alive) {
        if (this.couched && !this.falling) {
          moveSpeed = this.couchSpeed * frameTime;
        } else {
          moveSpeed = this.speed * frameTime;
        }
        this.checkCollisions();
        if (keyboard.keys.left && !this.lockDirection.left) {
          this.shape.setX(this.shape.getX() - moveSpeed);
        }
        if (keyboard.keys.right && !this.lockDirection.right) {
          this.shape.setX(this.shape.getX() + moveSpeed);
        }
        if (keyboard.keys.down && !this.couched) {
          this.couch();
        } else if (!keyboard.keys.down && this.couched) {
          this.wake();
        }
        if (keyboard.keys.up && !this.jump && this.canJump && !this.couched && this.numJump < this.maxJump) {
          this.startJump();
        }
        if (this.couched && this.stopCouch) {
          this.wake();
        }
        if (!this.jump && this.falling) {
          this.doFall();
        }
        HTML.query('#jump').textContent = this.jump;
        HTML.query('#jumps').textContent = this.numJump + "/" + this.maxJump;
        HTML.query('#falling').textContent = !this.jump && this.falling;
        return HTML.query('#alive').textContent = this.alive;
      }
    };

    ControllablePlayer.prototype.doJump = function() {
      var player;
      player = this;
      this.jumpLaunched = true;
      this.tween = new Kinetic.Tween({
        node: this.shape,
        duration: 0.3,
        easing: Kinetic.Easings.EaseOut,
        y: this.shape.getY() - 84,
        onFinish: function() {
          return player.stopJump();
        }
      });
      return this.tween.play();
    };

    ControllablePlayer.prototype.doFall = function() {
      return this.shape.setY(this.shape.getY() + this.fallingSpeed);
    };

    ControllablePlayer.prototype.couch = function() {
      if (this.couched === false) {
        this.shape.setHeight(this.heightCouched);
        this.shape.setY(player.shape.getY() + (this.height - this.heightCouched));
        return this.couched = true;
      }
    };

    ControllablePlayer.prototype.wake = function() {
      var tmpCount;
      tmpCount = this.getCountCollisions();
      this.shape.setHeight(this.height);
      this.shape.setY(player.shape.getY() - (this.height - this.heightCouched));
      this.couched = false;
      if (this.getCountCollisions() > tmpCount) {
        this.shape.setHeight(this.heightCouched);
        this.shape.setY(player.shape.getY() + (this.height - this.heightCouched));
        return this.couched = true;
      } else {
        return this.stopCouch = false;
      }
    };

    ControllablePlayer.prototype.startJump = function() {
      this.numJump++;
      this.canJump = false;
      this.jump = true;
      return this.doJump();
    };

    ControllablePlayer.prototype.stopJump = function() {
      this.jump = false;
      return this.jumpLaunched = false;
    };

    ControllablePlayer.prototype.cancelJump = function() {
      this.stopJump();
      if (this.tween !== null) {
        return this.tween.pause();
      }
    };

    ControllablePlayer.prototype.stopFall = function(y) {
      if (!this.jump) {
        this.falling = false;
        this.canJump = true;
        this.numJump = 0;
        return this.shape.setY(y - this.shape.getHeight());
      }
    };

    ControllablePlayer.prototype.stopDirection = function(way, x) {
      if (way === 'left') {
        this.lockDirection.left = true;
        return this.shape.setX(x);
      } else {
        this.lockDirection.right = true;
        return this.shape.setX(x - this.shape.getWidth());
      }
    };

    ControllablePlayer.prototype.checkCollisions = function() {
      var collision, collisions, player, _i, _len, _results;
      player = this;
      this.falling = true;
      this.lockDirection.left = false;
      this.lockDirection.right = false;
      collisions = this.getCollisions();
      _results = [];
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        if (collision.sides.top) {
          _results.push(player.stopFall(collision.cube.getY()));
        } else {
          if (collision.sides.bot) {
            if (collision.cube.getName() === 'falling') {
              player.kill();
            }
            player.cancelJump();
          }
          if (collision.sides.left) {
            _results.push(player.stopDirection('left', collision.cube.getX() + collision.cube.getWidth()));
          } else if (collision.sides.right) {
            _results.push(player.stopDirection('right', collision.cube.getX()));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
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
          return result.push({
            cube: cube,
            sides: collisionManager.getSide(playerBoundBox, cubeBoundBox)
          });
        }
      });
      cubes = fallingCubes.find('Rect');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(playerBoundBox, cubeBoundBox)) {
          return result.push({
            cube: cube,
            sides: collisionManager.getSide(playerBoundBox, cubeBoundBox)
          });
        }
      });
      return result;
    };

    ControllablePlayer.prototype.getCountCollisions = function() {
      var collision, collisions, count, _i, _len;
      collisions = this.getCollisions();
      count = 0;
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        if (collision.sides.bot) {
          count++;
        }
      }
      return count;
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
      this.speed = 1000;
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
      return this.speed = 1000;
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

  new FallingCube(0, SquareEnum.MEDIUM, 1);

  new FallingCube(3, SquareEnum.SMALL, 0);

  new FallingCube(5, SquareEnum.MEDIUM, 2);

  new FallingCube(7, SquareEnum.SMALL, 0);

  new FallingCube(7, SquareEnum.SMALL, 1);

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
