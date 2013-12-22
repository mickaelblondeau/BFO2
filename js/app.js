(function() {
  var Arena, Bonus, BonusManager, CollisionManager, ControllablePlayer, Cube, FallingCube, Game, Keyboard, LevelManager, NetworkManager, Player, SquareEnum, StaticCube, VirtualPlayer, animFrame, arena, bg, bonusManager, collisionManager, config, fallingCubes, game, keyboard, levelManager, networkManager, player, players, stage, staticBg, staticCubes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  config = {
    levelHeight: 976,
    levelWidth: 704,
    levelSpeed: 1000,
    playerJumpMax: 1,
    playerJumpHeight: 80,
    playerSpeed: 0.3
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
      return networkManager.sendReset();
    };

    Game.prototype.launch = function() {
      return networkManager.sendLaunch();
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
        stroke: null
      });
      players.add(this.shape);
      this.skin = new Kinetic.Shape({
        drawFunc: function(context) {
          context.beginPath();
          context.arc(16, 10, 10, 0, 180, false);
          context.moveTo(0, 62);
          context.lineTo(32, 62);
          context.lineTo(16, 22);
          context.closePath();
          return context.fillStrokeShape(this);
        },
        fill: 'red',
        stroke: 'black'
      });
      return players.add(this.skin);
    };

    Player.prototype.spawn = function() {
      this.shape.setX(336);
      return this.shape.setY(stage.getY() * -1);
    };

    Player.prototype.reset = function() {
      this.spawn();
      this.alive = true;
      this.falling = true;
      this.jumpMax = config.playerJumpMax;
      this.speed = config.playerSpeed;
      return this.jumpHeight = config.playerJumpHeight;
    };

    Player.prototype.kill = function() {
      this.shape.setX(32);
      this.shape.setY(32);
      this.skin.setX(32);
      this.skin.setY(32);
      return this.alive = false;
    };

    return Player;

  })();

  ControllablePlayer = (function(_super) {
    __extends(ControllablePlayer, _super);

    function ControllablePlayer() {
      ControllablePlayer.__super__.constructor.call(this);
      this.speed = config.playerSpeed;
      this.couchedSpeedRatio = 0.5;
      this.fallMinAcceleration = 0.2;
      this.fallMaxAcceleration = 0.6;
      this.fallAcceleration = 1.05;
      this.fallCurrentAcceleration = this.fallMinAcceleration;
      this.jumpMinAcceleration = 0.1;
      this.jumpMaxAcceleration = 0.6;
      this.jumpDeceleration = 0.95;
      this.jumpCurrentAcceleration = 0;
      this.jumpHeight = config.playerJumpHeight;
      this.jumpMax = config.playerJumpMax;
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
          networkManager.sendDie();
        } else if (collide && collide.getName().split(' ')[0] === 'bonus') {
          this.takeBonus(collide);
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
          networkManager.sendMove(this.shape.getX(), this.shape.getY());
          this.skin.setX(this.shape.getX());
          this.skin.setY(this.shape.getY());
          this.skin.setWidth(this.shape.getWidth());
          this.skin.setHeight(this.shape.getHeight());
        } else if (this.couched) {
          this.stopCouch();
          this.skin.setX(this.shape.getX());
          this.skin.setY(this.shape.getY());
          this.skin.setWidth(this.shape.getWidth());
          this.skin.setHeight(this.shape.getHeight());
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
      } else {
        return this.falling = true;
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
          if ((x !== 0 && collision.getY() !== this.shape.getY() + this.shape.getHeight()) || (y !== 0 && collision.getX() !== this.shape.getX() + this.shape.getWidth() && collision.getX() + collision.getWidth() !== this.shape.getX())) {
            if (collision.getName() !== void 0 && collision.getName() !== null && collision.getName().split(' ')[0] === 'bonus') {
              this.takeBonus(collision);
              return false;
            } else {
              return collision;
            }
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

    ControllablePlayer.prototype.takeBonus = function(bonus) {
      bonusManager.getBonus(bonus.getName().split(' ')[1], this);
      bonus.destroy();
      return fallingCubes.draw();
    };

    return ControllablePlayer;

  })(Player);

  VirtualPlayer = (function(_super) {
    __extends(VirtualPlayer, _super);

    function VirtualPlayer(name) {
      VirtualPlayer.__super__.constructor.call(this);
      this.skin.setFill('white');
      this.name = new Kinetic.Text({
        text: name,
        fill: 'black',
        fontFamily: 'Calibri',
        fontSize: 18
      });
      players.add(this.name);
    }

    VirtualPlayer.prototype.move = function(x, y) {
      this.shape.setX(x);
      this.shape.setY(y);
      this.skin.setX(x);
      this.skin.setY(y);
      this.name.setX(x);
      return this.name.setY(y - 20);
    };

    VirtualPlayer.prototype.remove = function() {
      this.shape.destroy();
      this.skin.destroy();
      this.name.destroy();
      return delete this;
    };

    return VirtualPlayer;

  })(Player);

  SquareEnum = {
    BONUS: {
      x: 0,
      y: 0
    },
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
      y = stage.getY() * -1;
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

  Bonus = (function() {
    function Bonus(col, destination, type) {
      this.type = type;
      this.x = col * 32 + 160;
      this.y = stage.getY() * -1;
      this.draw();
      this.destination = arena.y - destination * 32 - 32;
      this.diffY = this.destination - this.y;
      this.speed = 600;
      this.fall();
    }

    Bonus.prototype.fall = function() {
      var tween;
      tween = new Kinetic.Tween({
        node: this.shape,
        duration: this.diffY / this.speed,
        y: this.destination
      });
      return tween.play();
    };

    Bonus.prototype.draw = function() {
      this.shape = new Kinetic.Rect({
        x: this.x,
        y: this.y,
        width: 32,
        height: 32,
        fill: 'gold',
        stroke: 'black',
        strokeWidth: 1,
        name: 'bonus ' + this.type
      });
      return fallingCubes.add(this.shape);
    };

    return Bonus;

  })();

  BonusManager = (function() {
    function BonusManager() {
      this.bonuses = [
        {
          name: 'doubleJump',
          attribute: 'jumpCount',
          value: 1,
          time: 3000
        }
      ];
    }

    BonusManager.prototype.getBonus = function(bonusName, player) {
      var bonus, self, _i, _len, _ref, _results;
      _ref = this.bonuses;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bonus = _ref[_i];
        if (bonusName === bonus.name) {
          this.addBonus(bonus, player);
          if (bonus.time !== void 0) {
            self = this;
            _results.push(setTimeout(function() {
              return self.removeBonus(bonus, player);
            }, bonus.time));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    BonusManager.prototype.addBonus = function(bonus, player) {
      switch (bonus.attribute) {
        case "speed":
          return player.speed += bonus.value;
        case "jumpHeight":
          return player.jumpHeight += bonus.value;
        case "jumpCount":
          return player.jumpMax += bonus.value;
      }
    };

    BonusManager.prototype.removeBonus = function(bonus, player) {
      switch (bonus.attribute) {
        case "speed":
          return player.speed -= bonus.value;
        case "jumpHeight":
          return player.jumpHeight -= bonus.value;
        case "jumpCount":
          return player.jumpMax -= bonus.value;
      }
    };

    return BonusManager;

  })();

  LevelManager = (function() {
    function LevelManager() {
      this.tweens = [];
      this.level = 0;
    }

    LevelManager.prototype.reset = function() {
      var tween, _i, _len, _ref;
      _ref = this.tweens;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        if (tween !== void 0) {
          tween.pause();
        }
      }
      stage.setY(0);
      staticBg.setY(0);
      arena.reset();
      fallingCubes.destroyChildren();
      stage.draw();
      return this.level = 0;
    };

    LevelManager.prototype.moveLevel = function(height) {
      arena.add(height / 32);
      this.tweens[0] = new Kinetic.Tween({
        node: stage,
        duration: 2,
        y: stage.getY() + height,
        onFinish: function() {
          return networkManager.sendMoveLevelOk();
        }
      });
      this.tweens[0].play();
      this.tweens[1] = new Kinetic.Tween({
        node: staticBg,
        duration: 2,
        y: staticBg.getY() - height
      });
      return this.tweens[1].play();
    };

    LevelManager.prototype.clearLevel = function() {
      var cubes;
      this.level++;
      HTML.query('#lml').textContent = this.level;
      arena.clearOutOfScreen();
      cubes = fallingCubes.find('Rect');
      return cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight()) {
          return cube.destroy();
        }
      });
    };

    return LevelManager;

  })();

  NetworkManager = (function() {
    function NetworkManager() {
      this.socket = io.connect('http://localhost:8080');
      this.players = [];
      this.listener();
    }

    NetworkManager.prototype.listener = function() {
      var self;
      self = this;
      this.socket.on('fallingCube', function(data) {
        return new FallingCube(data[0], data[1], data[2]);
      });
      this.socket.on('fallingBonus', function(data) {
        return new Bonus(data[0], data[1], data[2]);
      });
      this.socket.on('resetLevel', function() {
        levelManager.reset();
        return player.reset();
      });
      this.socket.on('clearLevel', function() {
        return levelManager.clearLevel();
      });
      this.socket.on('moveLevel', function(height) {
        return levelManager.moveLevel(height);
      });
      this.socket.on('connection', function(arr) {
        return self.players[arr[0]] = new VirtualPlayer(arr[1]);
      });
      this.socket.on('disconnect', function(id) {
        return self.players[id].remove();
      });
      this.socket.on('move', function(arr) {
        if (self.players[arr[0]] !== void 0) {
          return self.players[arr[0]].move(arr[1], arr[2]);
        }
      });
      return this.socket.on('kill', function(id) {
        return self.players[id].kill();
      });
    };

    NetworkManager.prototype.sendLaunch = function() {
      return this.socket.emit('launch');
    };

    NetworkManager.prototype.sendReset = function() {
      return this.socket.emit('reset');
    };

    NetworkManager.prototype.sendMove = function(x, y) {
      return this.socket.emit('move', [parseInt(x), parseInt(y)]);
    };

    NetworkManager.prototype.sendDie = function() {
      return this.socket.emit('die');
    };

    NetworkManager.prototype.sendMoveLevelOk = function() {
      return this.socket.emit('moveLevelOk');
    };

    return NetworkManager;

  })();

  Arena = (function() {
    function Arena() {
      this.y = stage.getHeight();
      this.initHeight = 31;
      this.height = this.initHeight;
      this.draw();
    }

    Arena.prototype.draw = function() {
      var i, _i, _j, _ref, _results;
      for (i = _i = 0; _i <= 13; i = ++_i) {
        new StaticCube(i * 32 + 128, this.y, SquareEnum.SMALL);
      }
      _results = [];
      for (i = _j = 0, _ref = this.height; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
        new StaticCube(128, this.y - i * 32, SquareEnum.SMALL);
        _results.push(new StaticCube(544, this.y - i * 32, SquareEnum.SMALL));
      }
      return _results;
    };

    Arena.prototype.reset = function() {
      this.height = this.initHeight;
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

    Arena.prototype.add = function(level) {
      var i, _i, _ref, _ref1;
      for (i = _i = _ref = this.height, _ref1 = this.height + level; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        new StaticCube(128, this.y - i * 32, SquareEnum.SMALL);
        new StaticCube(544, this.y - i * 32, SquareEnum.SMALL);
      }
      return this.height += level;
    };

    Arena.prototype.clearOutOfScreen = function() {
      var cubes;
      cubes = staticCubes.find('Rect');
      return cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight()) {
          return cube.destroy();
        }
      });
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

  staticCubes = new Kinetic.Layer();

  staticBg = new Kinetic.Layer();

  stage.add(staticBg);

  stage.add(staticCubes);

  stage.add(players);

  stage.add(fallingCubes);

  bg = new Kinetic.Rect({
    width: stage.getWidth(),
    height: stage.getHeight(),
    fill: "grey",
    stroke: "black"
  });

  staticBg.add(bg);

  bg.setZIndex(-1);

  bg.draw();

  networkManager = new NetworkManager();

  game = new Game();

  game.start();

  collisionManager = new CollisionManager();

  arena = new Arena();

  keyboard = new Keyboard();

  player = new ControllablePlayer();

  levelManager = new LevelManager();

  bonusManager = new BonusManager();

  game.update = function(frameTime) {
    var cubes;
    players.draw();
    player.update(frameTime);
    cubes = fallingCubes.find('Rect');
    HTML.query('#cc').textContent = cubes.length;
    cubes = staticCubes.find('Rect');
    return HTML.query('#sc').textContent = cubes.length;
  };

  window.onresize = function() {
    return game.resize();
  };

}).call(this);
