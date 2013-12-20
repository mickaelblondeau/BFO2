(function() {
  var Arena, CollisionManager, ControllablePlayer, Cube, CubeManager, FallingCube, Game, Keyboard, LevelManager, Player, SquareEnum, StaticCube, animFrame, arena, bg, collisionManager, config, cubeManager, fallingCubes, game, keyboard, levelManager, player, players, stage, staticCubes, staticLayer,
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
    function Player() {
      this.heightCouched = 30;
      this.height = 62;
      this.draw();
      this.spawn();
    }

    Player.prototype.draw = function() {
      this.shape = new Kinetic.Rect({
        width: 32,
        height: this.height,
        stroke: 'black',
        strokeWidth: 1
      });
      return players.add(this.shape);
    };

    Player.prototype.spawn = function() {
      this.shape.setX(336);
      return this.shape.setY(stage.getY() * -1);
    };

    Player.prototype.reset = function() {
      this.spawn();
      this.alive = true;
      return this.falling = true;
    };

    Player.prototype.kill = function() {
      this.shape.setX(32);
      this.shape.setY(32);
      return this.alive = false;
    };

    return Player;

  })();

  ControllablePlayer = (function(_super) {
    __extends(ControllablePlayer, _super);

    function ControllablePlayer(x, y) {
      ControllablePlayer.__super__.constructor.call(this, x, y);
      this.speed = 0.3;
      this.couchedSpeedRatio = 0.5;
      this.fallMinAcceleration = 0.2;
      this.fallMaxAcceleration = 0.6;
      this.fallAcceleration = 1.05;
      this.fallCurrentAcceleration = this.fallMinAcceleration;
      this.jumpMinAcceleration = 0.1;
      this.jumpMaxAcceleration = 0.6;
      this.jumpDeceleration = 0.95;
      this.jumpCurrentAcceleration = 0;
      this.jumpHeight = 80;
      this.jumpMax = 1;
      this.jump = false;
      this.canJump = true;
      this.jumpStart = 0;
      this.jumpCount = 0;
      this.couched = false;
      this.falling = true;
      this.alive = true;
      this.actualCollisions = [];
    }

    ControllablePlayer.prototype.update = function(frameTime) {
      var collide, moveSpeed;
      if (this.alive) {
        collide = this.testDiff();
        if (collide && collide.getName() === 'falling') {
          this.kill();
        }
        if (this.jump || this.falling || keyboard.keys.left || keyboard.keys.right || keyboard.keys.up || keyboard.keys.down) {
          if (!this.jump) {
            this.doFall(frameTime);
          } else {
            this.doJump(frameTime);
          }
          if (this.couched && !this.jump) {
            moveSpeed = this.speed * frameTime * this.couchedSpeedRatio;
          } else {
            moveSpeed = this.speed * frameTime;
          }
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
        } else if (this.couched) {
          this.stopCouch();
        } else if (!keyboard.keys.up) {
          this.canJump = true;
        }
        HTML.query('#jump').textContent = this.jump;
        HTML.query('#jumps').textContent = this.jumpCount + '/' + this.jumpMax;
        HTML.query('#falling').textContent = this.falling;
        HTML.query('#alive').textContent = this.alive;
        return HTML.query('#ppc').textContent = !(this.jump || this.falling || keyboard.keys.left || keyboard.keys.right || keyboard.keys.up || keyboard.keys.down);
      }
    };

    ControllablePlayer.prototype.doFall = function(frameTime) {
      var collide, tmpAcceleration;
      if (this.jumpCount === 0) {
        this.jumpCount = 1;
      }
      collide = this.testMove(0, this.shape.getY() + this.fallCurrentAcceleration * frameTime);
      tmpAcceleration = this.fallCurrentAcceleration * this.fallAcceleration;
      if (tmpAcceleration <= this.fallMaxAcceleration) {
        this.fallCurrentAcceleration = tmpAcceleration;
      } else {
        this.fallCurrentAcceleration = this.fallMaxAcceleration;
      }
      if (collide) {
        return this.stopFall(collide.getY());
      }
    };

    ControllablePlayer.prototype.stopFall = function(y) {
      this.shape.setY(y - this.shape.getHeight());
      this.jumpCount = 0;
      this.fallCurrentAcceleration = this.fallMinAcceleration;
      return this.falling = false;
    };

    ControllablePlayer.prototype.startJump = function() {
      this.canJump = false;
      if (this.jumpCount < this.jumpMax && !this.couched) {
        this.jumpCount++;
        this.jump = true;
        this.jumpCurrentAcceleration = this.jumpMaxAcceleration;
        return this.jumpStart = this.shape.getY();
      }
    };

    ControllablePlayer.prototype.doJump = function(frameTime) {
      var collide, tmpAcceleration;
      if (this.jumpStart - this.shape.getY() < this.jumpHeight) {
        collide = this.testMove(0, this.shape.getY() - this.jumpCurrentAcceleration * frameTime);
        tmpAcceleration = this.jumpCurrentAcceleration * this.jumpDeceleration;
        if (tmpAcceleration >= this.jumpMinAcceleration) {
          this.jumpCurrentAcceleration = tmpAcceleration;
        } else {
          this.jumpCurrentAcceleration = this.jumpMinAcceleration;
        }
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
      this.jump = false;
      return this.falling = true;
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
    SMALL: {
      x: 32,
      y: 32
    },
    MEDIUM: {
      x: 64,
      y: 64
    },
    LARGE: {
      x: 128,
      y: 128
    },
    MEDIUM_RECT: {
      x: 64,
      y: 32
    },
    LARGE_RECT: {
      x: 128,
      y: 64
    },
    LONG_RECT: {
      x: 32,
      y: 128
    }
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
        width: this.size.x,
        height: this.size.y,
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
      y = fallingCubes.getY() * -1;
      FallingCube.__super__.constructor.call(this, x, y, size, this.getColor());
      fallingCubes.add(this.shape);
      this.shape.setName('falling');
      this.shape.draw();
      this.destination = arena.y - destination * 32 - size.y;
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
      this.types = [
        {
          proba: 8,
          size: SquareEnum.LARGE,
          width: SquareEnum.LARGE.x / 32,
          height: SquareEnum.LARGE.y / 32
        }, {
          proba: 26,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32
        }, {
          proba: 26,
          size: SquareEnum.SMALL,
          width: SquareEnum.SMALL.x / 32,
          height: SquareEnum.SMALL.y / 32
        }, {
          proba: 16,
          size: SquareEnum.MEDIUM_RECT,
          width: SquareEnum.MEDIUM_RECT.x / 32,
          height: SquareEnum.MEDIUM_RECT.y / 32
        }, {
          proba: 8,
          size: SquareEnum.LARGE_RECT,
          width: SquareEnum.LARGE_RECT.x / 32,
          height: SquareEnum.LARGE_RECT.y / 32
        }, {
          proba: 16,
          size: SquareEnum.LONG_RECT,
          width: SquareEnum.LONG_RECT.x / 32,
          height: SquareEnum.LONG_RECT.y / 32
        }
      ];
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
      var choice, choices, columnPosition, count, rand, tmp, type, typeIndex, _i, _ref;
      choices = this.checkCols();
      if (choices.length > 0) {
        tmp = this.randomizeType(choices);
        type = tmp.type;
        typeIndex = tmp.index;
        count = choices[typeIndex].length;
        rand = Math.floor(Math.random() * count);
        choice = choices[typeIndex][rand];
        new FallingCube(choice.column, type.size, choice.height);
        for (columnPosition = _i = 1, _ref = type.width; 1 <= _ref ? _i <= _ref : _i >= _ref; columnPosition = 1 <= _ref ? ++_i : --_i) {
          this.map[choice.column + columnPosition - 1] = choice.height + type.height;
        }
        return true;
      } else {
        return false;
      }
    };

    CubeManager.prototype.randomizeType = function(choices) {
      var index, item, possibleType, possibleTypes, rand, randomCount, randomMap, ratio, type, typeIndex, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
      possibleTypes = [];
      _ref = this.types;
      for (typeIndex = _i = 0, _len = _ref.length; _i < _len; typeIndex = ++_i) {
        type = _ref[typeIndex];
        if (choices[typeIndex] !== void 0 && choices[typeIndex].length > 0) {
          possibleTypes.push({
            type: type,
            index: typeIndex,
            proba: type.proba
          });
        }
      }
      if (possibleTypes.length !== this.types.length) {
        ratio = this.types.length / possibleTypes.length;
        for (_j = 0, _len1 = possibleTypes.length; _j < _len1; _j++) {
          possibleType = possibleTypes[_j];
          possibleType.proba *= ratio;
        }
      }
      randomMap = [];
      randomCount = 0;
      for (index = _k = 0, _len2 = possibleTypes.length; _k < _len2; index = ++_k) {
        possibleType = possibleTypes[index];
        randomCount += possibleType.proba;
        randomMap.push({
          index: index,
          percent: randomCount
        });
      }
      rand = Math.floor(Math.random() * 100) + 1;
      for (_l = 0, _len3 = randomMap.length; _l < _len3; _l++) {
        item = randomMap[_l];
        if (rand <= item.percent) {
          return possibleTypes[item.index];
        }
      }
      return possibleTypes[randomMap.length - 1];
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
      var available, column, columnIndex, columnPosition, height, placeForType, tmp, type, typeIndex, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
      available = [];
      _ref = this.map;
      for (columnIndex = _i = 0, _len = _ref.length; _i < _len; columnIndex = ++_i) {
        column = _ref[columnIndex];
        _ref1 = this.types;
        for (typeIndex = _j = 0, _len1 = _ref1.length; _j < _len1; typeIndex = ++_j) {
          type = _ref1[typeIndex];
          placeForType = true;
          height = 0;
          for (columnPosition = _k = 1, _ref2 = type.width; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; columnPosition = 1 <= _ref2 ? ++_k : --_k) {
            tmp = this.map[columnIndex + columnPosition - 1];
            if (!(tmp + type.height <= this.levelHeight)) {
              placeForType = false;
              break;
            } else if (tmp > height) {
              height = tmp;
            }
          }
          if (placeForType) {
            if (available[typeIndex] === void 0) {
              available[typeIndex] = [];
            }
            available[typeIndex].push({
              column: columnIndex,
              height: height
            });
          }
        }
      }
      return available;
    };

    return CubeManager;

  })();

  LevelManager = (function() {
    function LevelManager() {
      this.level = 0;
      this.speed = config.levelSpeed;
      this.tweens = [];
      this.lastHeight = 0;
    }

    LevelManager.prototype.launch = function() {
      return this.nextLevel();
    };

    LevelManager.prototype.reset = function() {
      var tween, _i, _len, _ref;
      _ref = this.tweens;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        if (tween !== void 0) {
          tween.pause();
        }
      }
      fallingCubes.setY(0);
      fallingCubes.destroyChildren();
      players.setY(0);
      stage.draw();
      cubeManager.reset();
      this.level = 0;
      return this.speed = config.levelSpeed;
    };

    LevelManager.prototype.moveStage = function() {
      var height, self;
      self = this;
      height = this.lastHeight * 32;
      this.tweens[0] = new Kinetic.Tween({
        node: fallingCubes,
        duration: 2,
        y: fallingCubes.getY() + height,
        onFinish: function() {
          cubeManager.waiting = false;
          return self.nextLevel();
        }
      });
      this.tweens[0].play();
      this.tweens[1] = new Kinetic.Tween({
        node: players,
        duration: 2,
        y: players.getY() + height
      });
      return this.tweens[1].play();
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
      return fallingCubes.destroyChildren();
    };

    return LevelManager;

  })();

  Arena = (function() {
    function Arena() {
      this.y = stage.getHeight();
      this.draw();
    }

    Arena.prototype.draw = function() {
      var i, _i, _j, _results;
      for (i = _i = 0; _i <= 13; i = ++_i) {
        new StaticCube(i * 32 + 128, this.y, SquareEnum.SMALL);
      }
      _results = [];
      for (i = _j = 0; _j <= 32; i = ++_j) {
        new StaticCube(128, this.y - i * 32, SquareEnum.SMALL);
        _results.push(new StaticCube(13 * 32 + 128, this.y - i * 32, SquareEnum.SMALL));
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

  players = new Kinetic.Layer();

  staticLayer = new Kinetic.Layer();

  stage.add(staticLayer);

  stage.add(players);

  stage.add(fallingCubes);

  staticCubes = new Kinetic.Group();

  staticLayer.add(staticCubes);

  bg = new Kinetic.Rect({
    width: stage.getWidth(),
    height: stage.getHeight(),
    fill: "grey",
    stroke: "black"
  });

  staticLayer.add(bg);

  bg.setZIndex(-1);

  bg.draw();

  game = new Game();

  game.start();

  collisionManager = new CollisionManager();

  arena = new Arena();

  keyboard = new Keyboard();

  player = new ControllablePlayer();

  cubeManager = new CubeManager();

  levelManager = new LevelManager();

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
