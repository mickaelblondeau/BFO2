(function() {
  var Arena, Bonus, BonusManager, Boss, BossManager, CollisionManager, ControllablePlayer, Cube, FallingCube, Game, HUD, ImageLoader, Keyboard, LevelManager, NetworkManager, Player, RoueMan, SquareEnum, StaticCube, VirtualPlayer, animFrame, arena, bonusManager, bonusTypes, bossManager, collisionManager, config, dynamicEntities, game, hud, hudLayer, imageLoader, keyboard, levelManager, networkManager, player, players, stage, staticBg, staticCubes,
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
          on_keydown: function() {
            return game.reset();
          }
        }, {
          keys: "enter",
          on_keydown: function() {
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
      this.statsInit();
      this.scale = 1;
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
      this.lastFrame = Date.now();
      this.resize();
      return this.loop();
    };

    Game.prototype.resize = function() {
      this.scale = window.innerHeight / config.levelHeight;
      stage.setScaleX(this.scale);
      stage.setScaleY(this.scale);
      stage.draw();
      return document.getElementById("container").style.width = config.levelWidth * this.scale + "px";
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
      if (networkManager.socket !== void 0) {
        return networkManager.sendReset();
      }
    };

    Game.prototype.launch = function() {
      if (networkManager.socket !== void 0) {
        return networkManager.sendLaunch();
      }
    };

    Game.prototype.loadAssets = function() {
      imageLoader.addLoad({
        name: 'cubes',
        url: '../assets/cubes.jpg'
      });
      imageLoader.addLoad({
        name: 'cubes_red',
        url: '../assets/cubes_red.jpg'
      });
      imageLoader.addLoad({
        name: 'cubes_blue',
        url: '../assets/cubes_blue.jpg'
      });
      imageLoader.addLoad({
        name: 'cubes_green',
        url: '../assets/cubes_green.jpg'
      });
      imageLoader.addLoad({
        name: 'bonus',
        url: '../assets/bonus.png'
      });
      imageLoader.addLoad({
        name: 'bg',
        url: '../assets/bg.jpg'
      });
      imageLoader.addLoad({
        name: 'boss',
        url: '../assets/boss.png'
      });
      imageLoader.addLoad({
        name: 'playerSpirteSheet',
        url: '../assets/playerSpirteSheet.png'
      });
      return imageLoader.load();
    };

    return Game;

  })();

  ImageLoader = (function() {
    function ImageLoader() {
      this.imagesToLoad = [];
      this.images = [];
    }

    ImageLoader.prototype.addLoad = function(image) {
      return this.imagesToLoad.push(image);
    };

    ImageLoader.prototype.load = function() {
      var count, imageObj, img, self, total, _i, _len, _ref, _results;
      self = this;
      count = 0;
      total = this.imagesToLoad.length;
      _ref = this.imagesToLoad;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        imageObj = new Image();
        imageObj.src = img.url;
        this.images[img.name] = imageObj;
        _results.push(imageObj.onload = function() {
          count++;
          if (count === total) {
            return self.imagesLoaded();
          }
        });
      }
      return _results;
    };

    ImageLoader.prototype.imagesLoaded = function() {};

    return ImageLoader;

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

    CollisionManager.prototype.collidingCorners = function(a, b) {
      return ((b.right >= a.left && b.right < a.right && b.top >= a.top && b.top < a.bottom) || (b.left >= a.left && b.left < a.right && b.top >= a.top && b.top < a.bottom)) && a.top > b.top - 5;
    };

    return CollisionManager;

  })();

  Player = (function() {
    function Player() {
      this.heightCouched = 30;
      this.height = 46;
      this.draw();
      this.spawn();
    }

    Player.prototype.draw = function() {
      var animations;
      this.shape = new Kinetic.Rect({
        width: 22,
        height: this.height,
        stroke: null
      });
      players.add(this.shape);
      animations = {
        idle: [
          {
            x: 290,
            y: 2,
            width: 46,
            height: 45
          }
        ],
        jump: [
          {
            x: 339,
            y: 2,
            width: 45,
            height: 45
          }
        ],
        fall: [
          {
            x: 387,
            y: 2,
            width: 46,
            height: 45
          }
        ],
        run: [
          {
            x: 0,
            y: 2,
            width: 46,
            height: 45
          }, {
            x: 49,
            y: 2,
            width: 46,
            height: 45
          }, {
            x: 97,
            y: 2,
            width: 46,
            height: 45
          }, {
            x: 145,
            y: 2,
            width: 46,
            height: 45
          }, {
            x: 193,
            y: 2,
            width: 46,
            height: 45
          }, {
            x: 241,
            y: 2,
            width: 46,
            height: 45
          }
        ],
        couch: [
          {
            x: 0,
            y: 63,
            width: 46,
            height: 34
          }
        ],
        couchMove: [
          {
            x: 50,
            y: 67,
            width: 46,
            height: 30
          }, {
            x: 98,
            y: 67,
            width: 46,
            height: 30
          }, {
            x: 146,
            y: 67,
            width: 46,
            height: 30
          }, {
            x: 194,
            y: 67,
            width: 46,
            height: 30
          }, {
            x: 242,
            y: 67,
            width: 46,
            height: 30
          }
        ],
        grabbing: [
          {
            x: 0,
            y: 98,
            width: 46,
            height: 48
          }
        ]
      };
      this.skin = new Kinetic.Sprite({
        image: imageLoader.images['playerSpirteSheet'],
        animation: 'run',
        animations: animations,
        frameRate: 7,
        index: 0
      });
      players.add(this.skin);
      return this.skin.start();
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
      this.jumpHeight = config.playerJumpHeight;
      this.grabbing = false;
      this.canGrab = false;
      return this.coopJump = false;
    };

    Player.prototype.resurection = function() {
      if (!this.alive) {
        return this.reset();
      }
    };

    Player.prototype.kill = function() {
      this.shape.setX(-64);
      this.alive = false;
      return hud.reset();
    };

    Player.prototype.fixSkinPos = function() {
      if (this.skin.getScaleX() === -1) {
        this.skin.setX(this.shape.getX() - 12 + 48);
      } else {
        this.skin.setX(this.shape.getX() - 12);
      }
      if (this.skin.getAnimation() === 'couch') {
        return this.skin.setY(this.shape.getY() - 4);
      } else {
        return this.skin.setY(this.shape.getY());
      }
    };

    Player.prototype.changeAnimation = function(animation) {
      if (this.skin.getAnimation() !== animation) {
        return this.skin.setAnimation(animation);
      }
    };

    Player.prototype.changeSide = function(side) {
      if (side === -1) {
        this.skin.setScaleX(-1);
        return this.skin.setX(this.skin.getX() + 48);
      } else if (side === 1) {
        this.skin.setScaleX(1);
        return this.skin.setX(this.skin.getX() - 48);
      }
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
      this.grabbing = false;
      this.canGrab = false;
      this.coopJump = false;
      this.alive = true;
      this.actualCollisions = [];
    }

    ControllablePlayer.prototype.update = function(frameTime) {
      var collide, moveSide, moveSpeed;
      if (this.alive) {
        collide = this.testDiff();
        if (collide && collide.getName() === 'falling') {
          this.kill();
          networkManager.sendDie();
        } else if (collide && collide.getName().type === 'bonus') {
          this.takeBonus(collide);
        } else if (collide && collide.getName().type === 'boss') {
          this.collideBoss(collide);
        }
        moveSide = 0;
        if (this.jump || this.falling || keyboard.keys.left || keyboard.keys.right || keyboard.keys.up || keyboard.keys.down) {
          if (!this.jump && !this.grabbing) {
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
            } else {
              moveSide = -1;
            }
          }
          if (keyboard.keys.right) {
            collide = this.testMove(this.shape.getX() + moveSpeed, 0);
            if (collide) {
              this.shape.setX(collide.getX() - this.shape.getWidth());
            } else {
              moveSide = 1;
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
        } else if (this.couched) {
          this.stopCouch();
          networkManager.sendMove(this.shape.getX(), this.shape.getY());
        } else if (!keyboard.keys.up) {
          this.canJump = true;
        }
        if (moveSide === -1 && this.skin.getScaleX() !== -1) {
          this.changeSide(-1);
        } else if (moveSide === 1 && this.skin.getScaleX() !== 1) {
          this.changeSide(1);
        }
        if (this.jump) {
          this.changeAnimation('jump');
        } else if (this.grabbing) {
          this.changeAnimation('grabbing');
        } else if (this.falling) {
          this.changeAnimation('fall');
        } else if (this.couched) {
          if (moveSide !== 0) {
            this.changeAnimation('couchMove');
          } else {
            this.changeAnimation('couch');
          }
        } else if (moveSide !== 0) {
          this.changeAnimation('run');
        } else {
          this.changeAnimation('idle');
        }
        this.fixSkinPos();
        this.getCornerCollisions();
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
        if (this.playerCollision()) {
          this.coopJump = true;
          this.jumpHeight += 40;
        }
        this.jumpCount++;
        this.jump = true;
        this.jumpCurrentAcceleration = this.jumpMaxAcceleration;
        return this.jumpStart = this.shape.getY();
      }
    };

    ControllablePlayer.prototype.doJump = function(frameTime) {
      var collide, tmpAcceleration;
      if ((this.jumpStart - this.shape.getY() < this.jumpHeight) && this.jump) {
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
      this.falling = true;
      if (this.coopJump) {
        this.coopJump = false;
        return this.jumpHeight -= 40;
      }
    };

    ControllablePlayer.prototype.startCouch = function() {
      if (!this.couched && !this.grabbing) {
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
      cubes = staticCubes.find('Sprite');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(playerBoundBox, cubeBoundBox)) {
          return result.push(cube);
        }
      });
      cubes = dynamicEntities.find('Sprite');
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
      var collision, collisions, list, _i, _j, _len, _len1;
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
            if (!(collision.getName() !== void 0 && collision.getName() !== null && (collision.getName().type === 'bonus' || collision.getName().type === 'boss'))) {
              return collision;
            }
          }
        }
      }
      for (_j = 0, _len1 = collisions.length; _j < _len1; _j++) {
        collision = collisions[_j];
        if (__indexOf.call(list, collision) < 0) {
          if (collision.getName() !== void 0 && collision.getName() !== null) {
            if (collision.getName().type === 'bonus') {
              this.takeBonus(collision);
            }
            if (collision.getName().type === 'boss') {
              this.collideBoss(collision);
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
      bonusManager.getBonus(bonus.getName().name, this, bonus.getId());
      bonus.destroy();
      dynamicEntities.draw();
      return networkManager.sendBonusTaken(bonus.getId());
    };

    ControllablePlayer.prototype.changeAnimation = function(animation) {
      if (this.skin.getAnimation() !== animation) {
        this.skin.setAnimation(animation);
        return networkManager.sendAnimation(animation);
      }
    };

    ControllablePlayer.prototype.changeSide = function(side) {
      ControllablePlayer.__super__.changeSide.call(this, side);
      return networkManager.sendAnimationSide(side);
    };

    ControllablePlayer.prototype.collideBoss = function(boss) {
      return this.kill();
    };

    ControllablePlayer.prototype.getCornerCollisions = function() {
      var count, cubes, playerBoundBox, self;
      self = this;
      count = 0;
      playerBoundBox = collisionManager.getBoundBox(this.shape);
      playerBoundBox.left -= 4;
      playerBoundBox.right += 4;
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(playerBoundBox, cubeBoundBox)) {
          if (collisionManager.collidingCorners(playerBoundBox, cubeBoundBox)) {
            if (self.canGrab) {
              self.grab(cube);
              return count++;
            } else {
              return players.find('Rect').each(function(plr) {
                var otherPlayerBoundBox;
                if (plr.getName() === 'otherPlayer') {
                  otherPlayerBoundBox = collisionManager.getBoundBox(plr);
                  otherPlayerBoundBox.bottom += 4;
                  if (collisionManager.colliding(playerBoundBox, otherPlayerBoundBox) && plr.getHeight() < self.height) {
                    self.grab(cube);
                    return count++;
                  }
                }
              });
            }
          }
        }
      });
      if (count === 0) {
        return this.grabbing = false;
      }
    };

    ControllablePlayer.prototype.playerCollision = function() {
      var playerBoundBox, response;
      response = false;
      playerBoundBox = collisionManager.getBoundBox(this.shape);
      players.find('Rect').each(function(plr) {
        var otherPlayerBoundBox;
        if (plr.getName() === 'otherPlayer') {
          otherPlayerBoundBox = collisionManager.getBoundBox(plr);
          if (collisionManager.colliding(playerBoundBox, otherPlayerBoundBox) && plr.getHeight() < self.height) {
            return response = true;
          }
        }
      });
      return response;
    };

    ControllablePlayer.prototype.grab = function(cube) {
      if (!this.grabbing) {
        this.stopJump();
        this.grabbing = true;
        this.jumpCount = 0;
        return this.shape.setY(cube.getY());
      }
    };

    return ControllablePlayer;

  })(Player);

  VirtualPlayer = (function(_super) {
    __extends(VirtualPlayer, _super);

    function VirtualPlayer(name) {
      VirtualPlayer.__super__.constructor.call(this);
      this.skin.setFill('white');
      this.shape.setName('otherPlayer');
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
      this.name.setX(x);
      this.name.setY(y - 20);
      return this.fixSkinPos();
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
      this.cubesTypes = {
        '32-32': [
          {
            x: 192,
            y: 96,
            width: 32,
            height: 32
          }
        ],
        '64-64': [
          {
            x: 128,
            y: 64,
            width: 64,
            height: 64
          }
        ],
        '128-128': [
          {
            x: 0,
            y: 0,
            width: 128,
            height: 128
          }
        ],
        '64-32': [
          {
            x: 192,
            y: 64,
            width: 64,
            height: 32
          }
        ],
        '128-64': [
          {
            x: 128,
            y: 0,
            width: 128,
            height: 64
          }
        ],
        '32-128': [
          {
            x: 256,
            y: 0,
            width: 32,
            height: 128
          }
        ]
      };
      this.draw();
    }

    Cube.prototype.draw = function() {
      return this.shape = new Kinetic.Sprite({
        x: this.x,
        y: this.y,
        width: this.size.x,
        height: this.size.y,
        image: imageLoader.images['cubes' + this.color],
        animation: this.size.x + '-' + this.size.y,
        animations: this.cubesTypes,
        frameRate: 0,
        index: 0
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
      dynamicEntities.add(this.shape);
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
      colors = ["_red", "_green", "_blue"];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    return FallingCube;

  })(Cube);

  StaticCube = (function(_super) {
    __extends(StaticCube, _super);

    function StaticCube(x, y, size) {
      StaticCube.__super__.constructor.call(this, x, y, size, '');
      staticCubes.add(this.shape);
      this.shape.draw();
    }

    return StaticCube;

  })(Cube);

  bonusTypes = {
    doubleJump: [
      {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    grabbing: [
      {
        x: 32,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    resurection: [
      {
        x: 64,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    jumpHeight: [
      {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    speed: [
      {
        x: 96,
        y: 0,
        width: 32,
        height: 32
      }
    ]
  };

  Bonus = (function() {
    function Bonus(col, destination, type, id) {
      this.id = id;
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
      this.shape = new Kinetic.Sprite({
        x: this.x,
        y: this.y,
        width: 32,
        height: 32,
        image: imageLoader.images['bonus'],
        animation: this.type,
        animations: bonusTypes,
        frameRate: 0,
        index: 0,
        name: {
          type: 'bonus',
          name: this.type
        },
        id: 'bonus' + this.id
      });
      return dynamicEntities.add(this.shape);
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
        }, {
          name: 'grabbing',
          attribute: 'canGrab',
          value: true,
          time: 10000
        }, {
          name: 'resurection',
          attribute: 'resurection'
        }, {
          name: 'speed',
          attribute: 'speed',
          value: 0.1
        }, {
          name: 'jumpHeight',
          attribute: 'jumpHeight',
          value: 10
        }
      ];
      this.timers = [];
    }

    BonusManager.prototype.getBonus = function(bonusName, player, bonusId) {
      var bonus, callback, self, thisBonus, _i, _len, _ref, _results;
      _ref = this.bonuses;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bonus = _ref[_i];
        if (bonusName === bonus.name) {
          this.addBonus(bonus, player);
          hud.addBuff(bonusId, bonusName, bonus.time);
          if (bonus.time !== void 0) {
            self = this;
            thisBonus = bonus;
            callback = function() {
              self.removeBonus(thisBonus, player);
              return hud.deleteBuff(bonusId);
            };
            _results.push(this.timers.push(setTimeout(callback, bonus.time)));
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
        case "canGrab":
          return player.canGrab = true;
        case "resurection":
          networkManager.sendResurection();
          return player.resurection();
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
        case "canGrab":
          return player.canGrab = false;
      }
    };

    BonusManager.prototype.reset = function() {
      var timer, _i, _len, _ref, _results;
      _ref = this.timers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        timer = _ref[_i];
        _results.push(clearInterval(timer));
      }
      return _results;
    };

    BonusManager.prototype.remove = function(id) {
      var cubes;
      cubes = dynamicEntities.find('Sprite');
      return cubes.each(function(cube) {
        if (cube.getId() === id) {
          cube.destroy();
          return dynamicEntities.draw();
        }
      });
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
      bonusManager.reset();
      bossManager.reset();
      hud.reset();
      dynamicEntities.destroyChildren();
      stage.draw();
      return this.level = 0;
    };

    LevelManager.prototype.moveLevel = function(height) {
      arena.add(height / 32);
      this.tweens[0] = new Kinetic.Tween({
        node: stage,
        duration: 2,
        y: stage.getY() + height * game.scale,
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
      this.tweens[1].play();
      this.tweens[2] = new Kinetic.Tween({
        node: hudLayer,
        duration: 2,
        y: hudLayer.getY() - height
      });
      return this.tweens[2].play();
    };

    LevelManager.prototype.clearLevel = function() {
      var cubes;
      this.level++;
      HTML.query('#lml').textContent = this.level;
      arena.clearOutOfScreen();
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight()) {
          return cube.destroy();
        }
      });
      if (player.shape.getY() > stage.getY() * -1 + stage.getHeight()) {
        return player.kill();
      }
    };

    return LevelManager;

  })();

  NetworkManager = (function() {
    function NetworkManager() {
      this.players = [];
      this.playersId = [];
    }

    NetworkManager.prototype.connect = function(ip, name) {
      this.socket = io.connect('http://' + ip + ':8080');
      this.socket.emit('login', name);
      return this.listener();
    };

    NetworkManager.prototype.listener = function() {
      var self;
      self = this;
      this.socket.on('fallingCube', function(data) {
        return new FallingCube(data[0], data[1], data[2]);
      });
      this.socket.on('fallingBonus', function(data) {
        return new Bonus(data[0], data[1], data[2], data[3]);
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
      this.socket.on('bonusTaken', function(id) {
        return bonusManager.remove(id);
      });
      this.socket.on('connection', function(arr) {
        self.players[arr[0]] = new VirtualPlayer(arr[1]);
        return self.playersId.push(arr[0]);
      });
      this.socket.on('disconnect', function(id) {
        return self.players[id].remove();
      });
      this.socket.on('move', function(arr) {
        if (self.players[arr[0]] !== void 0) {
          return self.players[arr[0]].move(arr[1], arr[2]);
        }
      });
      this.socket.on('changeAnimation', function(arr) {
        return self.players[arr[0]].changeAnimation(arr[1]);
      });
      this.socket.on('changeAnimationSide', function(arr) {
        return self.players[arr[0]].changeSide(arr[1]);
      });
      this.socket.on('kill', function(id) {
        return self.players[id].kill();
      });
      this.socket.on('spawnBoss', function(arr) {
        return bossManager.spawn(arr[0], arr[1]);
      });
      this.socket.on('resurection', function() {
        return player.resurection();
      });
      return this.socket.on('playerList', function(arr) {
        var i, id, _i, _len, _ref, _results;
        _ref = self.playersId;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          id = _ref[i];
          if (arr.indexOf(id) === -1) {
            self.players[id].remove();
            _results.push(self.playersId.splice(i, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
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

    NetworkManager.prototype.sendBonusTaken = function(id) {
      return this.socket.emit('bonusTaken', id);
    };

    NetworkManager.prototype.sendAnimation = function(animation) {
      return this.socket.emit('changeAnimation', animation);
    };

    NetworkManager.prototype.sendAnimationSide = function(side) {
      return this.socket.emit('changeAnimationSide', side);
    };

    NetworkManager.prototype.sendBossBeaten = function() {
      return this.socket.emit('bossBeaten');
    };

    NetworkManager.prototype.sendResurection = function() {
      return this.socket.emit('resurection');
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
      shapes = staticCubes.find('Sprite');
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
      cubes = staticCubes.find('Sprite');
      return cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight()) {
          return cube.destroy();
        }
      });
    };

    return Arena;

  })();

  HUD = (function() {
    function HUD() {
      this.level;
      this.buffs = [];
      this.drawLevel();
    }

    HUD.prototype.update = function(frameTime) {
      var levelText;
      levelText = 'Level : ' + levelManager.level;
      if (levelText !== this.level.getText()) {
        this.level.setText(levelText);
      }
      this.updateBuffs(frameTime);
      return hudLayer.draw();
    };

    HUD.prototype.drawLevel = function() {
      this.level = new Kinetic.Text({
        text: 'Level : 0',
        fill: 'black',
        fontFamily: 'Calibri',
        fontSize: 18
      });
      return hudLayer.add(this.level);
    };

    HUD.prototype.addBuff = function(id, buff, time) {
      var timer;
      this.buffs.push({
        id: id,
        buff: buff,
        time: time
      });
      buff = new Kinetic.Sprite({
        x: 608,
        y: 0,
        width: 32,
        height: 32,
        image: imageLoader.images['bonus'],
        animation: buff,
        animations: bonusTypes,
        frameRate: 0,
        index: 0,
        id: id
      });
      hudLayer.add(buff);
      if (time !== void 0) {
        timer = new Kinetic.Text({
          x: 640,
          y: 0,
          text: time,
          fill: 'black',
          fontFamily: 'Calibri',
          fontSize: 18,
          id: 'txt' + id,
          name: 'timer'
        });
        return hudLayer.add(timer);
      }
    };

    HUD.prototype.deleteBuff = function(id) {
      hudLayer.find('Text').each(function(txt) {
        if (txt.getId() === 'txt' + id) {
          return txt.destroy();
        }
      });
      return hudLayer.find('Sprite').each(function(icon) {
        if (icon.getId() === id) {
          return icon.destroy();
        }
      });
    };

    HUD.prototype.updateBuffs = function(frameTime) {
      var y;
      y = 2;
      hudLayer.find('Sprite').each(function(icon) {
        var txt;
        txt = hudLayer.find('#txt' + icon.getId())[0];
        if (txt !== void 0) {
          txt.setY(y);
        }
        icon.setY(y);
        return y += 34;
      });
      return hudLayer.find('Text').each(function(txt) {
        if (txt.getName() === 'timer') {
          if (txt.getText() - frameTime >= 0) {
            return txt.setText(txt.getText() - frameTime);
          } else {
            return txt.setText(0);
          }
        }
      });
    };

    HUD.prototype.reset = function() {
      hudLayer.find('Text').each(function(txt) {
        if (txt.getName() === 'timer') {
          return txt.destroy();
        }
      });
      return hudLayer.find('Sprite').each(function(icon) {
        return icon.destroy();
      });
    };

    return HUD;

  })();

  Boss = (function() {
    function Boss(id, type, x, y, w, h) {
      this.id = id;
      this.type = type;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.bossTypes = {
        roueman: [
          {
            x: 0,
            y: 0,
            width: 64,
            height: 64
          }, {
            x: 64,
            y: 0,
            width: 64,
            height: 64
          }, {
            x: 128,
            y: 0,
            width: 64,
            height: 64
          }
        ]
      };
      this.draw();
      this.tweens = [];
    }

    Boss.prototype.draw = function() {
      this.shape = new Kinetic.Sprite({
        x: this.x,
        y: this.y,
        width: this.w,
        height: this.h,
        image: imageLoader.images['boss'],
        animation: this.type,
        animations: this.bossTypes,
        frameRate: 10,
        index: 0,
        name: {
          type: 'boss',
          name: this.type
        },
        id: 'boss' + this.id
      });
      dynamicEntities.add(this.shape);
      return this.shape.start();
    };

    Boss.prototype.finish = function() {
      this.shape.destroy();
      dynamicEntities.draw();
      return networkManager.sendBossBeaten();
    };

    Boss.prototype.reset = function() {
      var tween, _i, _len, _ref, _results;
      _ref = this.tweens;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        _results.push(tween.pause());
      }
      return _results;
    };

    return Boss;

  })();

  BossManager = (function() {
    function BossManager() {
      this.currentBoss;
    }

    BossManager.prototype.spawn = function(boss, options) {
      if (boss === 'roueman') {
        return this.currentBoss = new RoueMan(0, options);
      }
    };

    BossManager.prototype.reset = function() {
      if (this.currentBoss !== void 0) {
        return this.currentBoss.reset();
      }
    };

    return BossManager;

  })();

  RoueMan = (function(_super) {
    __extends(RoueMan, _super);

    function RoueMan(id, pattern) {
      var y;
      y = stage.getY() * -1 + config.levelHeight - 160;
      RoueMan.__super__.constructor.call(this, id, 'roueman', 0, y, 64, 64);
      this.attacks = pattern;
      this.index = 0;
      this.loop();
    }

    RoueMan.prototype.attack = function(level) {
      var self, tween1;
      self = this;
      this.tweens.push(tween1 = new Kinetic.Tween({
        node: this.shape,
        duration: 0.1,
        y: stage.getY() * -1 + config.levelHeight - level * 32,
        onFinish: function() {
          var tween2;
          self.tweens.push(tween2 = new Kinetic.Tween({
            node: self.shape,
            duration: 1,
            x: config.levelWidth - 64,
            onFinish: function() {
              var tween3;
              self.tweens.push(tween3 = new Kinetic.Tween({
                node: self.shape,
                duration: 0.1,
                y: stage.getY() * -1 + config.levelHeight - 128,
                onFinish: function() {
                  var tween4;
                  self.tweens.push(tween4 = new Kinetic.Tween({
                    node: self.shape,
                    duration: 0.5,
                    x: 0,
                    onFinish: function() {
                      return self.loop();
                    }
                  }));
                  return tween4.play();
                }
              }));
              return tween3.play();
            }
          }));
          return tween2.play();
        }
      }));
      return tween1.play();
    };

    RoueMan.prototype.loop = function() {
      if (this.attacks[this.index] !== void 0) {
        this.attack(this.attacks[this.index]);
        return this.index++;
      } else {
        return this.finish();
      }
    };

    return RoueMan;

  })(Boss);

  stage = new Kinetic.Stage({
    container: 'container',
    width: config.levelWidth,
    height: config.levelHeight
  });

  dynamicEntities = new Kinetic.Layer();

  players = new Kinetic.Layer();

  staticCubes = new Kinetic.Layer();

  staticBg = new Kinetic.Layer();

  hudLayer = new Kinetic.Layer();

  stage.add(staticBg);

  stage.add(staticCubes);

  stage.add(players);

  stage.add(dynamicEntities);

  stage.add(hudLayer);

  networkManager = new NetworkManager();

  imageLoader = new ImageLoader();

  collisionManager = new CollisionManager();

  keyboard = new Keyboard();

  levelManager = new LevelManager();

  bonusManager = new BonusManager();

  bossManager = new BossManager();

  game = new Game();

  game.loadAssets();

  arena = null;

  player = null;

  hud = null;

  imageLoader.imagesLoaded = function() {
    var launchGame;
    launchGame = function(ip, name) {
      var bg;
      bg = new Kinetic.Rect({
        width: stage.getWidth(),
        height: stage.getHeight(),
        fillPatternImage: imageLoader.images['bg']
      });
      staticBg.add(bg);
      bg.setZIndex(-1);
      bg.draw();
      arena = new Arena();
      player = new ControllablePlayer();
      hud = new HUD();
      networkManager.connect(ip, name);
      new Bonus(0, 0, 'doubleJump', 0);
      new Bonus(1, 0, 'grabbing', 1);
      new Bonus(4, 0, 'doubleJump', 2);
      new Bonus(7, 0, 'speed', 3);
      new Bonus(8, 0, 'jumpHeight', 4);
      new Bonus(9, 0, 'speed', 5);
      game.update = function(frameTime) {
        var cubes;
        players.draw();
        player.update(frameTime);
        hud.update(frameTime);
        cubes = dynamicEntities.find('Sprite');
        HTML.query('#cc').textContent = cubes.length;
        cubes = staticCubes.find('Sprite');
        return HTML.query('#sc').textContent = cubes.length;
      };
      return game.start();
    };
    return document.getElementById('play').onclick = function() {
      document.getElementById('login').style.display = 'none';
      return launchGame(document.getElementById('ip').value, document.getElementById('name').value);
    };
  };

  window.onresize = function() {
    return game.resize();
  };

}).call(this);
