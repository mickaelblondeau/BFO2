(function() {
  var Arena, Bonus, BonusManager, Boss, BossManager, CollisionManager, ContentLoader, ControllablePlayer, Cube, CubeFragment, CubeManager, Effect, FallingCube, FreezeMan, FreezeManPart, Game, HUD, Keyboard, LevelManager, MultiPartBoss, NetworkManager, Player, PoingMan, PoingManPart, RoueMan, SkinManager, SpecialCube, SquareEnum, StaticCube, VirtualPlayer, animFrame, arena, bonusManager, bonusTypes, bossManager, collisionManager, config, contentLoader, cubeManager, div, divs, dynamicEntities, game, hud, hudLayer, keyboard, levelManager, networkManager, player, players, skin, skinManager, stage, staticBg, staticCubes, _i, _len,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = {
    levelHeight: 976,
    levelWidth: 704,
    levelSpeed: 1000,
    playerJumpMax: 1,
    playerJumpHeight: 82,
    playerSpeed: 0.17,
    debug: false,
    skins: {
      body: 3,
      hair: 3,
      head: 1,
      leg: 3,
      shoes: 3,
      skin: 3
    }
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
            if (!game.writting) {
              return game.reset();
            }
          }
        }, {
          keys: "e",
          on_keydown: function() {
            if (!game.writting) {
              return game.launch();
            }
          }
        }, {
          keys: "enter",
          on_keydown: function() {
            return game.chat();
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
      this.writting = false;
    }

    Game.prototype.loop = function() {
      var frameTime, thisFrame;
      thisFrame = Date.now();
      frameTime = thisFrame - this.lastFrame;
      animFrame(Game.prototype.loop.bind(this));
      this.lastFrame = thisFrame;
      if (frameTime > 200) {
        frameTime = 200;
      }
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
      document.getElementById("container").style.margin = "-" + (config.levelHeight - window.innerHeight) + " auto";
      return document.getElementById("container").style.width = config.levelWidth;
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
      contentLoader.loadImage({
        name: 'cubes',
        url: '../assets/cubes.jpg'
      });
      contentLoader.loadImage({
        name: 'cubes_red',
        url: '../assets/cubes_red.jpg'
      });
      contentLoader.loadImage({
        name: 'cubes_blue',
        url: '../assets/cubes_blue.jpg'
      });
      contentLoader.loadImage({
        name: 'cubes_green',
        url: '../assets/cubes_green.jpg'
      });
      contentLoader.loadImage({
        name: 'cubes_special',
        url: '../assets/cubes_special.jpg'
      });
      contentLoader.loadImage({
        name: 'effects',
        url: '../assets/effects.png'
      });
      contentLoader.loadImage({
        name: 'bonus',
        url: '../assets/bonus.png'
      });
      contentLoader.loadImage({
        name: 'bg',
        url: '../assets/bg.jpg'
      });
      contentLoader.loadImage({
        name: 'boss',
        url: '../assets/boss.png'
      });
      contentLoader.loadImage({
        name: 'playerSpirteSheet',
        url: '../assets/playerSpirteSheet.png'
      });
      contentLoader.loadSound({
        name: 'beep',
        url: '../assets/sounds/beep.wav'
      });
      contentLoader.loadSound({
        name: 'death',
        url: '../assets/sounds/death.wav'
      });
      contentLoader.loadSound({
        name: 'music',
        url: '../assets/sounds/music.ogg'
      });
      contentLoader.loadSound({
        name: 'explosion',
        url: '../assets/sounds/explosion.wav'
      });
      contentLoader.loadSound({
        name: 'pickup',
        url: '../assets/sounds/pickup.wav'
      });
      return contentLoader.load();
    };

    Game.prototype.chat = function() {
      if (document.activeElement.id === 'chatMessage') {
        this.writting = false;
        if (document.activeElement.value !== void 0 && document.activeElement.value.trim() !== '') {
          networkManager.sendMessage(document.getElementById('chatMessage').value);
          this.addMessage('Me', document.getElementById('chatMessage').value);
        }
        document.getElementById('chatMessage').blur();
        return document.getElementById('chatMessage').value = null;
      } else {
        this.writting = true;
        return document.getElementById('chatMessage').focus();
      }
    };

    Game.prototype.addMessage = function(name, message) {
      var callback;
      contentLoader.play('beep');
      document.getElementById('chatMessages').innerHTML += '<div class="message"><span class="from">' + name + '</span> : <span class="content">' + message + '</span></div>';
      callback = function() {
        return document.querySelectorAll('#chatMessages .message')[0].remove();
      };
      return setTimeout(callback, 3000);
    };

    return Game;

  })();

  ContentLoader = (function() {
    function ContentLoader() {
      this.imagesToLoad = [];
      this.soundsToLoad = [];
      this.images = [];
      this.sounds = [];
      this.count = 0;
      this.total = 0;
    }

    ContentLoader.prototype.loadImage = function(image) {
      return this.imagesToLoad.push(image);
    };

    ContentLoader.prototype.loadSound = function(sound) {
      return this.soundsToLoad.push(sound);
    };

    ContentLoader.prototype.load = function() {
      var audioObj, imageObj, img, self, sound, _i, _j, _len, _len1, _ref, _ref1, _results;
      self = this;
      this.total = this.imagesToLoad.length + this.soundsToLoad.length;
      _ref = this.imagesToLoad;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        imageObj = new Image();
        imageObj.src = img.url;
        this.images[img.name] = imageObj;
        imageObj.onload = function() {
          self.count++;
          if (self.count === self.total) {
            return self.contentsLoaded();
          }
        };
      }
      _ref1 = this.soundsToLoad;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        sound = _ref1[_j];
        audioObj = new Audio();
        audioObj.src = sound.url;
        audioObj.volume = 0.1;
        this.sounds[sound.name] = audioObj;
        _results.push(audioObj.oncanplaythrough = function() {
          self.count++;
          if (self.count === self.total) {
            return self.contentsLoaded();
          }
        });
      }
      return _results;
    };

    ContentLoader.prototype.contentsLoaded = function() {};

    ContentLoader.prototype.muteVolume = function() {
      var sound, _i, _len, _ref, _results;
      _ref = this.soundsToLoad;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        _results.push(this.sounds[sound.name].volume = 0);
      }
      return _results;
    };

    ContentLoader.prototype.addVolume = function() {
      var sound, tmp, _i, _len, _ref, _results;
      _ref = this.soundsToLoad;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        tmp = this.sounds[sound.name].volume + 0.05;
        if (tmp <= 1) {
          _results.push(this.sounds[sound.name].volume = tmp);
        } else {
          _results.push(this.sounds[sound.name].volume = 1);
        }
      }
      return _results;
    };

    ContentLoader.prototype.lessVolume = function() {
      var sound, tmp, _i, _len, _ref, _results;
      _ref = this.soundsToLoad;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        tmp = this.sounds[sound.name].volume - 0.05;
        if (tmp >= 0) {
          _results.push(this.sounds[sound.name].volume = tmp);
        } else {
          _results.push(this.sounds[sound.name].volume = 0);
        }
      }
      return _results;
    };

    ContentLoader.prototype.play = function(sound) {
      this.sounds[sound].pause();
      this.sounds[sound].currentTime = 0;
      return this.sounds[sound].play();
    };

    return ContentLoader;

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
    function Player(skin) {
      var callback, self;
      this.heightCouched = 30;
      this.height = 46;
      this.active = false;
      this.playerSkin = skin;
      this.draw();
      this.spawn();
      self = this;
      callback = function(image) {
        self.skin.setImage(image);
        return self.fixSkinPos();
      };
      skinManager.createSkin(skin, callback, self.skin._id);
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
            x: 288,
            y: 0,
            width: 48,
            height: 48
          }
        ],
        jump: [
          {
            x: 336,
            y: 0,
            width: 48,
            height: 48
          }
        ],
        fall: [
          {
            x: 384,
            y: 0,
            width: 48,
            height: 48
          }
        ],
        run: [
          {
            x: 0,
            y: 0,
            width: 48,
            height: 48
          }, {
            x: 48,
            y: 0,
            width: 48,
            height: 48
          }, {
            x: 96,
            y: 0,
            width: 48,
            height: 48
          }, {
            x: 144,
            y: 0,
            width: 48,
            height: 48
          }, {
            x: 192,
            y: 0,
            width: 48,
            height: 48
          }, {
            x: 240,
            y: 0,
            width: 48,
            height: 48
          }
        ],
        couch: [
          {
            x: 0,
            y: 48,
            width: 48,
            height: 48
          }
        ],
        couchMove: [
          {
            x: 48,
            y: 48,
            width: 48,
            height: 48
          }, {
            x: 96,
            y: 48,
            width: 48,
            height: 48
          }, {
            x: 144,
            y: 48,
            width: 48,
            height: 48
          }, {
            x: 192,
            y: 48,
            width: 48,
            height: 48
          }, {
            x: 240,
            y: 48,
            width: 48,
            height: 48
          }
        ],
        grabbing: [
          {
            x: 0,
            y: 96,
            width: 48,
            height: 48
          }
        ],
        dead: [
          {
            x: 288,
            y: 48,
            width: 48,
            height: 48
          }
        ]
      };
      this.skin = new Kinetic.Sprite({
        image: contentLoader.images['playerSpirteSheet'],
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

    Player.prototype.fixSkinPos = function() {
      if (this.skin.getScaleX() === -1) {
        this.skin.setX(this.shape.getX() - 12 + 48);
      } else {
        this.skin.setX(this.shape.getX() - 12);
      }
      if (this.skin.getAnimation() === 'couch' || this.skin.getAnimation() === 'couchMove') {
        return this.skin.setY(this.shape.getY() - 18);
      } else {
        return this.skin.setY(this.shape.getY());
      }
    };

    Player.prototype.changeAnimation = function(animation) {
      if (this.skin.getAnimation() !== animation) {
        this.skin.setAnimation(animation);
        return this.fixSkinPos();
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

    function ControllablePlayer(skin) {
      ControllablePlayer.__super__.constructor.call(this, skin);
      this.speed = config.playerSpeed;
      this.couchedSpeedRatio = 0.5;
      this.fallMinAcceleration = 0.1;
      this.fallMaxAcceleration = 0.6;
      this.fallAcceleration = 1.10;
      this.fallCurrentAcceleration = this.fallMinAcceleration;
      this.jumpMinAcceleration = 0.1;
      this.jumpMaxAcceleration = 0.6;
      this.jumpDeceleration = 0.90;
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
      this.cached = {};
    }

    ControllablePlayer.prototype.update = function(frameTime) {
      var collide, moveSide, moveSpeed;
      if (!(!this.alive && this.shape.getY() > stage.getY() * -1 + stage.getHeight())) {
        this.sliding = false;
        if (!this.testMove(0, this.shape.getY())) {
          this.falling = true;
        }
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
        if (this.alive) {
          moveSide = 0;
          if (this.shape.getY() > 1000) {
            this.kill();
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
          if (keyboard.keys.down && !this.falling && !this.jump) {
            this.startCouch();
          } else {
            this.stopCouch();
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
          this.getCornerCollisions();
          if (moveSide === -1 && this.skin.getScaleX() !== -1) {
            this.changeSide(-1);
          } else if (moveSide === 1 && this.skin.getScaleX() !== 1) {
            this.changeSide(1);
          }
        } else {
          this.changeAnimation('dead');
        }
        this.fixSkinPos();
        if (this.cached.x !== this.shape.getX() || this.cached.y !== this.shape.getY() || this.cached.animation !== this.skin.getAnimation()) {
          networkManager.sendMove(this.shape.getX(), this.shape.getY());
          this.cached.x = this.shape.getX();
          this.cached.y = this.shape.getY();
          this.cached.animation = this.skin.getAnimation();
        }
        if (this.sliding) {
          if (this.skin.getScaleX() === -1) {
            collide = this.testMove(this.shape.getX() - (this.speed * frameTime) / 2, 0);
            if (collide) {
              return this.shape.setX(collide.getX() + collide.getWidth());
            }
          } else {
            collide = this.testMove(this.shape.getX() + (this.speed * frameTime) / 2, 0);
            if (collide) {
              return this.shape.setX(collide.getX() - this.shape.getWidth());
            }
          }
        }
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
      var collision, collisions, _i, _len;
      if (x !== 0) {
        this.shape.setX(x);
      }
      if (y !== 0) {
        this.shape.setY(y);
      }
      collisions = this.getCollisions();
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        if (collision.getName() !== void 0 && collision.getName() !== null) {
          if (collision.getName().type === 'bonus' && this.alive) {
            this.takeBonus(collision);
          }
          if (collision.getName().type === 'boss') {
            this.collideBoss(collision);
          }
          if (collision.getName().type === 'effect') {
            this.collideEffect(collision);
          }
          if (collision.getName().type === 'cube' || collision.getName().type === 'special') {
            if (collision.getName().falling && collision.getY() + collision.getHeight() - 16 < this.shape.getY()) {
              this.kill();
            }
            return collision;
          }
        } else {
          return collision;
        }
      }
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

    ControllablePlayer.prototype.collideEffect = function(effect) {
      if (effect.getName().name === 'ice') {
        return this.sliding = true;
      }
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
        if (!cube.getName().falling && cube.getName().type === 'cube') {
          cubeBoundBox = collisionManager.getBoundBox(cube);
          if (collisionManager.colliding(playerBoundBox, cubeBoundBox) && ((cubeBoundBox.left < playerBoundBox.left && self.skin.getScaleX() === -1) || (cubeBoundBox.left > playerBoundBox.left && self.skin.getScaleX() === 1))) {
            if (collisionManager.collidingCorners(playerBoundBox, cubeBoundBox)) {
              if (self.canGrab) {
                self.grab(cube);
                return count++;
              } else {
                return players.find('Rect').each(function(plr) {
                  var otherPlayerBoundBox, skin;
                  skin = players.find('#skin-' + plr.getId())[0];
                  if (plr.getId() !== void 0) {
                    if (plr.getName() === 'otherPlayer' && skin.getAnimation() === 'couch') {
                      otherPlayerBoundBox = collisionManager.getBoundBox(plr);
                      otherPlayerBoundBox.bottom += 4;
                      if (collisionManager.colliding(playerBoundBox, otherPlayerBoundBox)) {
                        self.grab(cube);
                        return count++;
                      }
                    }
                  }
                });
              }
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
        var otherPlayerBoundBox, skin;
        if (plr.getId() !== void 0) {
          skin = players.find('#skin-' + plr.getId())[0];
          if (plr.getName() === 'otherPlayer' && skin.getAnimation() === 'couch') {
            otherPlayerBoundBox = collisionManager.getBoundBox(plr);
            if (collisionManager.colliding(playerBoundBox, otherPlayerBoundBox)) {
              return response = true;
            }
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

    ControllablePlayer.prototype.kill = function() {
      if (this.alive) {
        this.alive = false;
        contentLoader.play('death');
        new Effect(this.shape.getX() - 16, this.shape.getY(), SquareEnum.SMALL, 'blood', true);
        return networkManager.sendDie();
      }
    };

    return ControllablePlayer;

  })(Player);

  VirtualPlayer = (function(_super) {
    __extends(VirtualPlayer, _super);

    function VirtualPlayer(id, name, skin) {
      VirtualPlayer.__super__.constructor.call(this, skin);
      this.skin.setFill('white');
      this.shape.setName('otherPlayer');
      this.shape.setId(id);
      this.skin.setId('skin-' + id);
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

    VirtualPlayer.prototype.kill = function() {
      contentLoader.play('death');
      return new Effect(this.shape.getX() - 16, this.shape.getY(), SquareEnum.SMALL, 'blood', true);
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
    function Cube(x, y, size, spriteSheet, animation) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.spriteSheet = spriteSheet;
      this.animation = animation;
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
        ],
        'iceExplosion': [
          {
            x: 0,
            y: 0,
            width: 64,
            height: 64
          }
        ],
        'explosion': [
          {
            x: 64,
            y: 0,
            width: 64,
            height: 64
          }
        ],
        'ice': [
          {
            x: 0,
            y: 0,
            width: 32,
            height: 32
          }
        ],
        'explosionEffect': [
          {
            x: 0,
            y: 32,
            width: 160,
            height: 128
          }, {
            x: 160,
            y: 32,
            width: 160,
            height: 128
          }, {
            x: 320,
            y: 32,
            width: 160,
            height: 128
          }, {
            x: 480,
            y: 32,
            width: 160,
            height: 128
          }, {
            x: 0,
            y: 160,
            width: 160,
            height: 128
          }, {
            x: 160,
            y: 160,
            width: 160,
            height: 128
          }, {
            x: 320,
            y: 160,
            width: 160,
            height: 128
          }, {
            x: 480,
            y: 160,
            width: 160,
            height: 128
          }, {
            x: 0,
            y: 288,
            width: 160,
            height: 128
          }, {
            x: 160,
            y: 288,
            width: 160,
            height: 128
          }
        ],
        'iceExplosionEffect': [
          {
            x: 0,
            y: 416,
            width: 160,
            height: 128
          }, {
            x: 160,
            y: 416,
            width: 160,
            height: 128
          }, {
            x: 320,
            y: 416,
            width: 160,
            height: 128
          }, {
            x: 480,
            y: 416,
            width: 160,
            height: 128
          }, {
            x: 0,
            y: 544,
            width: 160,
            height: 128
          }, {
            x: 160,
            y: 544,
            width: 160,
            height: 128
          }, {
            x: 320,
            y: 544,
            width: 160,
            height: 128
          }, {
            x: 480,
            y: 544,
            width: 160,
            height: 128
          }, {
            x: 0,
            y: 672,
            width: 160,
            height: 128
          }, {
            x: 160,
            y: 672,
            width: 160,
            height: 128
          }
        ],
        'blood': [
          {
            x: 160,
            y: 0,
            width: 64,
            height: 64
          }, {
            x: 224,
            y: 0,
            width: 64,
            height: 64
          }, {
            x: 288,
            y: 0,
            width: 64,
            height: 64
          }, {
            x: 352,
            y: 0,
            width: 64,
            height: 64
          }, {
            x: 416,
            y: 0,
            width: 64,
            height: 64
          }, {
            x: 480,
            y: 0,
            width: 64,
            height: 64
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
        image: contentLoader.images[this.spriteSheet],
        animation: this.animation,
        animations: this.cubesTypes,
        frameRate: 7,
        index: 0
      });
    };

    return Cube;

  })();

  FallingCube = (function(_super) {
    __extends(FallingCube, _super);

    function FallingCube(col, size) {
      var anim, x, y;
      x = col * 32 + 160;
      y = stage.getY() * -1;
      anim = size.x + '-' + size.y;
      FallingCube.__super__.constructor.call(this, x, y, size, this.getSpriteSheet(), anim);
      dynamicEntities.add(this.shape);
      this.shape.setName({
        type: 'cube',
        falling: true
      });
      this.shape.draw();
    }

    FallingCube.prototype.getSpriteSheet = function() {
      var sheets;
      sheets = ["cubes_red", "cubes_green", "cubes_blue"];
      return sheets[Math.floor(Math.random() * sheets.length)];
    };

    return FallingCube;

  })(Cube);

  StaticCube = (function(_super) {
    __extends(StaticCube, _super);

    function StaticCube(x, y, size) {
      var anim;
      anim = size.x + '-' + size.y;
      StaticCube.__super__.constructor.call(this, x, y, size, 'cubes', anim);
      staticCubes.add(this.shape);
      this.shape.draw();
    }

    return StaticCube;

  })(Cube);

  SpecialCube = (function(_super) {
    __extends(SpecialCube, _super);

    function SpecialCube(col, size, type) {
      var x, y;
      x = col * 32 + 160;
      y = stage.getY() * -1;
      this.type = type;
      SpecialCube.__super__.constructor.call(this, x, y, size, 'cubes_special', type);
      dynamicEntities.add(this.shape);
      this.shape.setName({
        type: 'special',
        falling: true
      });
      this.shape.setId(type);
      this.shape.draw();
    }

    return SpecialCube;

  })(Cube);

  CubeFragment = (function(_super) {
    __extends(CubeFragment, _super);

    function CubeFragment(x, y, size) {
      var anim;
      anim = size.x + '-' + size.y;
      CubeFragment.__super__.constructor.call(this, x, y, size, this.getSpriteSheet(), anim);
      dynamicEntities.add(this.shape);
      this.shape.setName({
        type: 'cube'
      });
      this.shape.draw();
    }

    CubeFragment.prototype.getSpriteSheet = function() {
      var sheets;
      sheets = ["cubes_red", "cubes_green", "cubes_blue"];
      return sheets[Math.floor(Math.random() * sheets.length)];
    };

    return CubeFragment;

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
    function Bonus(col, type, id) {
      this.id = id;
      this.type = type;
      this.x = col * 32 + 160;
      this.y = stage.getY() * -1;
      this.draw();
    }

    Bonus.prototype.draw = function() {
      this.shape = new Kinetic.Sprite({
        x: this.x,
        y: this.y,
        width: 32,
        height: 32,
        image: contentLoader.images['bonus'],
        animation: this.type,
        animations: bonusTypes,
        frameRate: 0,
        index: 0,
        name: {
          type: 'bonus',
          name: this.type,
          falling: true
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
          value: 0.03
        }, {
          name: 'jumpHeight',
          attribute: 'jumpHeight',
          value: 5
        }
      ];
      this.timers = [];
    }

    BonusManager.prototype.getBonus = function(bonusName, player, bonusId) {
      var bonus, callback, self, thisBonus, _i, _len, _ref, _results;
      contentLoader.play('pickup');
      _ref = this.bonuses;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bonus = _ref[_i];
        if (bonusName === bonus.name) {
          this.addBonus(bonus, player);
          hud.addBuff(bonusName, bonus.time);
          if (bonus.time !== void 0) {
            self = this;
            thisBonus = bonus;
            callback = function() {
              self.removeBonus(thisBonus, player);
              return hud.deleteBuff(bonusName);
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
      this.levelHeight = 0;
    }

    LevelManager.prototype.reset = function() {
      var tween, _i, _len, _ref;
      _ref = this.tweens;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        if (tween !== void 0) {
          tween.destroy();
        }
      }
      stage.setY(0);
      staticBg.setY(0);
      hudLayer.setY(0);
      arena.reset();
      bonusManager.reset();
      bossManager.reset();
      hud.reset();
      dynamicEntities.destroyChildren();
      stage.draw();
      this.level = 0;
      return this.levelHeight = 0;
    };

    LevelManager.prototype.moveLevel = function(height) {
      arena.add(height / 32);
      this.levelHeight += height;
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
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight() || cube.getName().type === 'bonus') {
          return cube.destroy();
        }
      });
      if (player.shape.getY() > stage.getY() * -1 + stage.getHeight()) {
        player.kill();
      }
      arena.clearOutOfScreen();
      return cubeManager.convertToStatic();
    };

    return LevelManager;

  })();

  CubeManager = (function() {
    function CubeManager() {
      this.speed = 0.4;
    }

    CubeManager.prototype.reinitAllPhys = function() {
      var cubes;
      cubes = dynamicEntities.find('Sprite');
      return cubes.each(function(cube) {
        var obj;
        if (cube.getName().type === 'cube') {
          obj = cube.getName();
          if (obj === null || obj === void 0) {
            obj = {};
          }
          obj.falling = true;
          return cube.setName(obj);
        }
      });
    };

    CubeManager.prototype.reinitPhys = function(oldCube) {
      var cubes;
      cubes = dynamicEntities.find('Sprite');
      return cubes.each(function(cube) {
        var obj;
        if (cube.getName().type === 'cube') {
          if (cube.getY() < oldCube.getY() && cube.getX() >= oldCube.getX() && cube.getX() <= oldCube.getX() + oldCube.getWidth()) {
            obj = cube.getName();
            if (obj === null || obj === void 0) {
              obj = {};
            }
            obj.falling = true;
            return cube.setName(obj);
          }
        }
      });
    };

    CubeManager.prototype.update = function(frameTime) {
      var cubes, self;
      self = this;
      cubes = dynamicEntities.find('Sprite');
      return cubes.each(function(cube) {
        var collide, obj;
        if (cube.getName() !== void 0 && cube.getName() !== null && cube.getName().falling) {
          collide = self.testMove(cube, cube.getY() + self.speed * frameTime);
          if (collide) {
            cube.setY(collide.getY() - cube.getHeight());
            obj = cube.getName();
            if (obj === null || obj === void 0) {
              obj = {};
            }
            obj.falling = false;
            cube.setName(obj);
            self.reinitPhys(cube);
            if (cube.getId() !== void 0) {
              return self.doEffect(cube, cube.getId());
            }
          } else {
            return cube.setY(cube.getY() + 0.1 * frameTime);
          }
        }
      });
    };

    CubeManager.prototype.getCollisions = function(shape) {
      var cubes, result, thisBoundBox;
      result = [];
      thisBoundBox = collisionManager.getBoundBox(shape);
      cubes = staticCubes.find('Sprite');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(thisBoundBox, cubeBoundBox)) {
          return result.push(cube);
        }
      });
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        var cubeBoundBox;
        if (shape._id !== cube._id && cube.getName() !== void 0 && cube.getName() !== null && cube.getName().type === 'cube') {
          cubeBoundBox = collisionManager.getBoundBox(cube);
          if (collisionManager.colliding(thisBoundBox, cubeBoundBox)) {
            return result.push(cube);
          }
        }
      });
      return result;
    };

    CubeManager.prototype.testMove = function(shape, y) {
      var collision, collisions, _i, _len;
      shape.setY(y);
      collisions = this.getCollisions(shape);
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        return collision;
      }
      return false;
    };

    CubeManager.prototype.convertToStatic = function() {
      var cubes;
      cubes = dynamicEntities.find('Sprite');
      return cubes.each(function(cube) {
        if (cube.getName().type === 'cube') {
          cube.moveTo(staticCubes);
          return cube.draw();
        }
      });
    };

    CubeManager.prototype.doEffect = function(shape, type) {
      if (type === 'iceExplosion') {
        this.iceExplosionEffect(shape);
      }
      if (type === 'explosion') {
        return this.explosionEffet(shape);
      }
    };

    CubeManager.prototype.iceExplosionEffect = function(shape) {
      contentLoader.play('explosion');
      new Effect(shape.getX() - shape.getWidth() / 2 - 16, shape.getY() - shape.getHeight() / 2 - 32, SquareEnum.SMALL, 'iceExplosionEffect', true);
      dynamicEntities.find('Sprite').each(function(cube) {
        var i, _i, _ref, _results;
        if (!cube.getName().falling && cube.getName().type === 'cube') {
          if (cube.getX() < shape.getX() + 128 && cube.getX() > shape.getX() - 128 && cube.getY() < shape.getY() + 128 && cube.getY() > shape.getY() - 128) {
            _results = [];
            for (i = _i = 0, _ref = (cube.getWidth() / 32) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
              _results.push(new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'ice'));
            }
            return _results;
          }
        }
      });
      return shape.destroy();
    };

    CubeManager.prototype.explosionEffet = function(shape) {
      var arr;
      contentLoader.play('explosion');
      new Effect(shape.getX() - shape.getWidth() / 2 - 16, shape.getY() - shape.getHeight() / 2 - 32, SquareEnum.SMALL, 'explosionEffect', true);
      arr = [];
      dynamicEntities.find('Sprite').each(function(cube) {
        var i, j, _i, _j, _ref, _ref1;
        if (!cube.getName().falling && cube.getName().type === 'cube') {
          if (cube.getWidth() > 32 || cube.getHeight() > 32) {
            for (i = _i = 0, _ref = cube.getWidth() / 32 - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
              for (j = _j = 0, _ref1 = cube.getHeight() / 32 - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
                if (arr[(cube.getX() + i * 32) + "_" + cube.getY() + j * 32] === void 0) {
                  arr[(cube.getX() + i * 32) + "_" + cube.getY() + j * 32] = 1;
                  new CubeFragment(cube.getX() + i * 32, cube.getY() + j * 32, SquareEnum.SMALL);
                }
              }
            }
            return cube.destroy();
          }
        }
      });
      dynamicEntities.find('Sprite').each(function(cube) {
        var i, j, _i, _results;
        _results = [];
        for (i = _i = -4; _i <= 5; i = ++_i) {
          j = i;
          if (i > 0) {
            j = i - 1;
          }
          if (cube.getX() === shape.getX() + i * 32 && cube.getY() < shape.getY() - (-5 + Math.abs(j)) * 32 && cube.getY() > shape.getY() + (-5 + Math.abs(j)) * 32) {
            _results.push(cube.destroy());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      if (player.shape.getX() < shape.getX() + 96 && player.shape.getX() > shape.getX() - 96 && player.shape.getY() < shape.getY() + 96 && player.shape.getY() > shape.getY() - 96) {
        player.kill();
      }
      return this.reinitAllPhys();
    };

    return CubeManager;

  })();

  NetworkManager = (function() {
    function NetworkManager() {
      this.players = [];
      this.playersId = [];
    }

    NetworkManager.prototype.connect = function(ip, name, skin) {
      this.socket = io.connect('http://' + ip + ':8080');
      this.socket.emit('login', [name, skin]);
      return this.listener();
    };

    NetworkManager.prototype.listener = function() {
      var self;
      self = this;
      this.socket.on('fallingCube', function(data) {
        return new FallingCube(data[0], data[1]);
      });
      this.socket.on('fallingBonus', function(data) {
        return new Bonus(data[0], data[1], data[2]);
      });
      this.socket.on('fallingSpecial', function(data) {
        return new SpecialCube(data[0], data[1], data[2]);
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
        self.players[arr[0]] = new VirtualPlayer(arr[0], arr[1], arr[2]);
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
        if (self.players[arr[0]] !== void 0) {
          return self.players[arr[0]].changeAnimation(arr[1]);
        }
      });
      this.socket.on('changeAnimationSide', function(arr) {
        if (self.players[arr[0]] !== void 0) {
          return self.players[arr[0]].changeSide(arr[1]);
        }
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
      this.socket.on('debugMap', function(map) {
        if (config.debug) {
          return debugMap(map);
        }
      });
      this.socket.on('playerList', function(arr) {
        var i, id, _i, _len, _ref, _results;
        _ref = self.playersId;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          id = _ref[i];
          if (arr.indexOf(id) === -1) {
            if (self.players[id] !== void 0) {
              self.players[id].remove();
            }
            _results.push(self.playersId.splice(i, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      return this.socket.on('message', function(arr) {
        return game.addMessage(self.players[arr[0]].name.getText(), arr[1]);
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

    NetworkManager.prototype.sendMessage = function(message) {
      return this.socket.emit('message', message);
    };

    return NetworkManager;

  })();

  SkinManager = (function() {
    function SkinManager() {
      this.parts = ['skin', 'hair', 'head', 'body', 'leg', 'shoes'];
      this.skins = [];
      this.callback = [];
    }

    SkinManager.prototype.createSkin = function(parts, callback, id) {
      var count, images, img, part, self, skin, _i, _len, _ref, _results;
      this.callback[id] = callback;
      self = this;
      count = 0;
      images = [];
      img = null;
      _ref = this.parts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        skin = new Image();
        skin.src = '../assets/player/' + part + '/' + parts[part] + '.png';
        images.push(skin);
        _results.push(skin.onload = function() {
          count++;
          if (count === self.parts.length) {
            return self.createSheet(images, id);
          }
        });
      }
      return _results;
    };

    SkinManager.prototype.createSheet = function(images, id) {
      var image, self, shape, tmpLayer, _i, _len;
      self = this;
      tmpLayer = new Kinetic.Layer();
      stage.add(tmpLayer);
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        shape = new Kinetic.Image({
          image: image
        });
        tmpLayer.add(shape);
      }
      tmpLayer.toImage({
        callback: function(image) {
          self.callback[id](image);
          return delete self.callback[id];
        }
      });
      return tmpLayer.destroy();
    };

    return SkinManager;

  })();

  Arena = (function() {
    function Arena() {
      this.y = stage.getHeight() - 32;
      this.initHeight = 32;
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

    HUD.prototype.addBuff = function(buffType, time) {
      var buff, count, timer;
      if (buffType !== 'resurection') {
        this.buffs.push({
          buff: buffType,
          time: time
        });
        if (hudLayer.find('#' + buffType)[0] !== void 0) {
          count = hudLayer.find('#count' + buffType)[0];
          count.setText((parseInt(count.getText().split(' x ')) + 1) + ' x ');
          if (time !== void 0) {
            timer = hudLayer.find('#timer' + buffType)[0];
            return timer.setText(time / 1000);
          }
        } else {
          buff = new Kinetic.Sprite({
            x: 618,
            y: 0,
            width: 32,
            height: 32,
            image: contentLoader.images['bonus'],
            animation: buffType,
            animations: bonusTypes,
            frameRate: 0,
            index: 0,
            id: buffType
          });
          hudLayer.add(buff);
          if (time !== void 0) {
            timer = new Kinetic.Text({
              x: 658,
              y: 0,
              text: time / 1000,
              fill: 'black',
              fontFamily: 'Calibri',
              fontSize: 18,
              id: 'timer' + buffType,
              name: 'timer'
            });
            hudLayer.add(timer);
            timer.setAttr('currentTime', time / 1000);
          }
          count = new Kinetic.Text({
            x: 590,
            y: 0,
            text: '1 x ',
            fill: 'black',
            fontFamily: 'Calibri',
            fontSize: 18,
            id: 'count' + buffType,
            name: 'count'
          });
          return hudLayer.add(count);
        }
      }
    };

    HUD.prototype.deleteBuff = function(buffType) {
      var buff, count, text;
      buff = hudLayer.find('#' + buffType)[0];
      count = hudLayer.find('#count' + buffType)[0];
      text = hudLayer.find('#timer' + buffType)[0];
      if (buff !== void 0) {
        if (count !== void 0) {
          if (count.getText() === '1 x ') {
            buff.destroy();
            count.destroy();
            if (text !== void 0) {
              return text.destroy();
            }
          } else {
            return count.setText((parseInt(count.getText().split(' x ')) - 1) + ' x ');
          }
        } else {
          buff.destroy();
          count.destroy();
          if (text !== void 0) {
            return text.destroy();
          }
        }
      }
    };

    HUD.prototype.updateBuffs = function(frameTime) {
      var y;
      y = 0;
      hudLayer.find('Sprite').each(function(icon) {
        var count, timer;
        timer = hudLayer.find('#timer' + icon.getId())[0];
        if (timer !== void 0) {
          timer.setY(y + 8);
        }
        count = hudLayer.find('#count' + icon.getId())[0];
        if (count !== void 0) {
          count.setY(y + 8);
        }
        icon.setY(y);
        return y += 40;
      });
      return hudLayer.find('Text').each(function(timer) {
        var newTime;
        if (timer.getName() === 'timer') {
          newTime = timer.getAttr('currentTime') - frameTime / 1000;
          if (newTime < 0) {
            newTime = 0;
          }
          timer.setAttr('currentTime', newTime);
          return timer.setText(Math.round(newTime * 100) / 100);
        }
      });
    };

    HUD.prototype.reset = function() {
      hudLayer.find('Text').each(function(timer) {
        if (timer.getName() === 'timer' || timer.getName() === 'count') {
          return timer.destroy();
        }
      });
      return hudLayer.find('Sprite').each(function(icon) {
        return icon.destroy();
      });
    };

    return HUD;

  })();

  Effect = (function(_super) {
    __extends(Effect, _super);

    function Effect(x, y, size, anim, hasCycle) {
      var len, self;
      Effect.__super__.constructor.call(this, x, y, size, 'effects', anim);
      dynamicEntities.add(this.shape);
      this.shape.setName({
        type: 'effect',
        name: anim
      });
      this.shape.draw();
      if (anim === 'explosionEffect' || anim === 'iceExplosionEffect') {
        this.shape.setFrameRate(20);
      } else if (anim === 'blood') {
        this.shape.setFrameRate(16);
      }
      this.shape.start();
      if (hasCycle !== void 0) {
        self = this;
        len = this.shape.getAnimations()[this.shape.getAnimation()].length - 1;
        this.shape.afterFrame(len, function() {
          return self.shape.destroy();
        });
      }
    }

    return Effect;

  })(Cube);

  Boss = (function() {
    function Boss(type, x, y, w, h) {
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
            width: 63,
            height: 64
          }, {
            x: 64,
            y: 0,
            width: 63,
            height: 64
          }, {
            x: 128,
            y: 0,
            width: 63,
            height: 64
          }
        ],
        freezeman: [
          {
            x: 0,
            y: 64,
            width: 544,
            height: 32
          }
        ],
        poingman: [
          {
            x: 128,
            y: 128,
            width: 64,
            height: 64
          }
        ]
      };
      this.draw();
    }

    Boss.prototype.draw = function() {
      this.shape = new Kinetic.Sprite({
        x: this.x,
        y: this.y,
        width: this.w,
        height: this.h,
        image: contentLoader.images['boss'],
        animation: this.type,
        animations: this.bossTypes,
        frameRate: 10,
        index: 0,
        name: {
          type: 'boss',
          name: this.type
        },
        stroke: 'black',
        strokeWidth: 1,
        strokeEnabled: true
      });
      dynamicEntities.add(this.shape);
      return this.shape.start();
    };

    Boss.prototype.finish = function() {
      bossManager.stopUpdate();
      this.shape.destroy();
      return networkManager.sendBossBeaten();
    };

    Boss.prototype.reset = function() {
      return this.shape.destroy();
    };

    return Boss;

  })();

  MultiPartBoss = (function(_super) {
    __extends(MultiPartBoss, _super);

    function MultiPartBoss(type, x, y, w, h) {
      MultiPartBoss.__super__.constructor.call(this, type, x, y, w, h);
      this.parts = [];
    }

    MultiPartBoss.prototype.reset = function() {
      var part, _i, _len, _ref, _results;
      MultiPartBoss.__super__.reset.call(this);
      _ref = this.parts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        _results.push(part.reset());
      }
      return _results;
    };

    MultiPartBoss.prototype.finish = function() {
      this.reset();
      bossManager.stopUpdate();
      return networkManager.sendBossBeaten();
    };

    return MultiPartBoss;

  })(Boss);

  BossManager = (function() {
    function BossManager() {
      this.currentBoss;
    }

    BossManager.prototype.spawn = function(boss, options) {
      if (boss === 'roueman') {
        this.currentBoss = new RoueMan(options);
      }
      if (boss === 'freezeman') {
        this.currentBoss = new FreezeMan(options);
      }
      if (boss === 'poingman') {
        return this.currentBoss = new PoingMan(options);
      }
    };

    BossManager.prototype.reset = function() {
      this.stopUpdate();
      if (this.currentBoss !== void 0) {
        return this.currentBoss.reset();
      }
    };

    BossManager.prototype.update = function(frameTime) {};

    BossManager.prototype.stopUpdate = function() {
      return this.update = function(frameTime) {};
    };

    return BossManager;

  })();

  RoueMan = (function(_super) {
    __extends(RoueMan, _super);

    function RoueMan(pattern) {
      var y;
      y = stage.getY() * -1;
      RoueMan.__super__.constructor.call(this, 'roueman', 0, y, 64, 64);
      this.attacks = pattern;
      this.attackIndex = 0;
      this.attackSpeed = 0.6;
      this.start();
    }

    RoueMan.prototype.start = function() {
      return this.moveY(arena.y - levelManager.levelHeight - 128, '+', 'next');
    };

    RoueMan.prototype.moveX = function(x, side, next) {
      var self;
      self = this;
      return bossManager.update = function(frameTime) {
        var tmp;
        if (side === '+') {
          tmp = self.shape.getX() + frameTime * self.attackSpeed;
        } else if (side === '-') {
          tmp = self.shape.getX() - frameTime * self.attackSpeed;
        }
        if ((side === '+' && tmp < x) || (side === '-' && tmp > x)) {
          return self.shape.setX(tmp);
        } else {
          self.shape.setX(x);
          if (next === 'return') {
            return self.moveY(arena.y - levelManager.levelHeight - 128, '-', 'return');
          } else if (next === 'next') {
            return self.next();
          }
        }
      };
    };

    RoueMan.prototype.moveY = function(y, side, next) {
      var self;
      self = this;
      return bossManager.update = function(frameTime) {
        var tmp;
        if (side === '+') {
          tmp = self.shape.getY() + frameTime * self.attackSpeed;
        } else if (side === '-') {
          tmp = self.shape.getY() - frameTime * self.attackSpeed;
        }
        if ((side === '+' && tmp < y) || (side === '-' && tmp > y)) {
          return self.shape.setY(tmp);
        } else {
          self.shape.setY(y);
          if (next === 'attack') {
            return self.moveX(config.levelWidth - 64, '+', 'return');
          } else if (next === 'return') {
            return self.moveX(0, '-', 'next');
          } else if (next === 'next') {
            return self.next();
          }
        }
      };
    };

    RoueMan.prototype.next = function() {
      var tmp;
      tmp = this.attacks[this.attackIndex];
      if (tmp !== void 0) {
        this.moveY(arena.y - levelManager.levelHeight - tmp * 32, '+', 'attack');
        return this.attackIndex++;
      } else {
        return this.finish();
      }
    };

    return RoueMan;

  })(Boss);

  FreezeMan = (function() {
    function FreezeMan(pattern) {
      this.speed = 0.4;
      this.counter = 0;
      this.interval = 1500;
      this.attacks = pattern;
      this.attackIndex = 0;
      this.count = 0;
      this.parts = [];
      this.levelHeight = arena.y - levelManager.levelHeight;
      this.start();
      this.next();
    }

    FreezeMan.prototype.start = function() {
      var i, self, _i;
      for (i = _i = 5; _i <= 16; i = ++_i) {
        new Effect(i * 32, this.levelHeight - 4, SquareEnum.SMALL, 'ice');
      }
      self = this;
      return bossManager.update = function(frameTime) {
        var part, speed, tmp, _j, _len, _ref;
        self.counter += frameTime;
        if (self.counter >= self.interval) {
          self.counter = 0;
          self.next();
        }
        speed = frameTime * self.speed;
        _ref = self.parts;
        for (i = _j = 0, _len = _ref.length; _j < _len; i = ++_j) {
          part = _ref[i];
          if (part !== void 0) {
            tmp = part.shape.getY() + speed;
            if (tmp < self.levelHeight) {
              part.shape.setY(tmp);
            } else {
              part.shape.destroy();
              self.parts[i] = null;
              self.count++;
              if (self.count === self.attacks.length * 2) {
                self.finish();
              }
            }
          }
        }
        return self.parts = self.parts.filter(function(e) {
          return e;
        });
      };
    };

    FreezeMan.prototype.next = function() {
      var tmp;
      tmp = this.attacks[this.attackIndex];
      if (tmp !== void 0) {
        this.parts.push(new FreezeManPart(tmp[0] * 32 + 128));
        this.parts.push(new FreezeManPart(tmp[1] * 32 + 128));
        return this.attackIndex++;
      }
    };

    FreezeMan.prototype.reset = function() {
      var part, _i, _len, _ref, _results;
      _ref = this.parts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        _results.push(part.reset());
      }
      return _results;
    };

    FreezeMan.prototype.finish = function() {
      bossManager.stopUpdate();
      return networkManager.sendBossBeaten();
    };

    return FreezeMan;

  })();

  FreezeManPart = (function(_super) {
    __extends(FreezeManPart, _super);

    function FreezeManPart(x) {
      var y;
      y = stage.getY() * -1;
      FreezeManPart.__super__.constructor.call(this, 'freezeman', x, y, 544, 32);
    }

    return FreezeManPart;

  })(Boss);

  PoingMan = (function(_super) {
    __extends(PoingMan, _super);

    function PoingMan(pattern) {
      var x;
      x = 900;
      this.levelHeight = arena.y - levelManager.levelHeight;
      this.y = this.levelHeight - 256;
      PoingMan.__super__.constructor.call(this, 'poingman', x, this.y, 64, 64);
      this.attacking = false;
      this.comeBack = false;
      this.finishing = false;
      this.starting = true;
      this.speed = 0.4;
      this.attackSpeed = 0.6;
      this.attacks = pattern;
      this.index = 0;
      this.oldPos = 0;
      this.start();
    }

    PoingMan.prototype.start = function() {
      var self;
      self = this;
      this.parts.push(new PoingManPart(128 - 128, this.levelHeight - 64));
      this.parts.push(new PoingManPart(512 + 128, this.levelHeight - 64));
      return bossManager.update = function(frameTime) {
        if (self.attacking && !self.finishing && !self.starting) {
          return self.attack(frameTime);
        } else if (!self.finishing && !self.starting) {
          return self.moveToPosition(frameTime);
        } else if (!self.starting) {
          return self.finishingPhase(frameTime);
        } else {
          return self.startingPhase(frameTime);
        }
      };
    };

    PoingMan.prototype.moveToPosition = function(frameTime) {
      var dest, tmp;
      dest = this.attacks[this.index] * 32 + 160;
      if (this.shape.getX() >= dest && this.oldPos >= dest) {
        tmp = this.shape.getX() - this.speed * frameTime;
        if (tmp < dest) {
          this.shape.setX(dest);
          this.oldPos = this.shape.getX();
          return this.attacking = true;
        } else {
          return this.shape.setX(tmp);
        }
      } else if (this.shape.getX() < dest && this.oldPos < dest) {
        tmp = this.shape.getX() + this.speed * frameTime;
        if (tmp > dest) {
          this.shape.setX(dest);
          this.oldPos = this.shape.getX();
          return this.attacking = true;
        } else {
          return this.shape.setX(tmp);
        }
      }
    };

    PoingMan.prototype.attack = function(frameTime) {
      var collision, collisions, ground, tmp, _i, _len;
      ground = this.levelHeight - 62;
      if (this.shape.getY() < ground && !this.comeBack) {
        tmp = this.shape.getY() + this.attackSpeed * frameTime;
        if (tmp > ground) {
          return this.shape.setY(ground);
        } else {
          return this.shape.setY(tmp);
        }
      } else if (this.shape.getY() > this.y && this.comeBack) {
        tmp = this.shape.getY() - this.attackSpeed * frameTime;
        if (tmp < this.y) {
          return this.shape.setY(this.y);
        } else {
          return this.shape.setY(tmp);
        }
      } else {
        if (this.comeBack) {
          this.index++;
          this.attacking = false;
          this.comeBack = false;
          if (this.attacks[this.index] === void 0) {
            this.finishing = true;
            return this.regenMap();
          }
        } else {
          contentLoader.play('explosion');
          this.comeBack = true;
          collisions = cubeManager.getCollisions(this.shape);
          for (_i = 0, _len = collisions.length; _i < _len; _i++) {
            collision = collisions[_i];
            collision.destroy();
          }
          return staticCubes.draw();
        }
      }
    };

    PoingMan.prototype.startingPhase = function(frameTime) {
      var tmp;
      tmp = this.parts[0].shape.getX() + this.speed * frameTime;
      if (tmp > 128) {
        this.parts[0].shape.setX(128);
      } else {
        this.parts[0].shape.setX(tmp);
      }
      tmp = this.parts[1].shape.getX() - this.speed * frameTime;
      if (tmp < 512) {
        this.parts[1].shape.setX(512);
      } else {
        this.parts[1].shape.setX(tmp);
      }
      this.shape.setX(this.shape.getX() - this.speed * frameTime);
      if (this.shape.getX() < 64) {
        return this.starting = false;
      }
    };

    PoingMan.prototype.finishingPhase = function(frameTime) {
      this.parts[0].shape.setX(this.parts[0].shape.getX() - this.speed * frameTime);
      this.parts[1].shape.setX(this.parts[1].shape.getX() + this.speed * frameTime);
      this.shape.setX(this.shape.getX() + this.speed * frameTime);
      if (this.shape.getX() > 800) {
        return this.finish();
      }
    };

    PoingMan.prototype.regenMap = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 12; i = ++_i) {
        _results.push(new StaticCube(i * 32 + 128, this.levelHeight, SquareEnum.SMALL));
      }
      return _results;
    };

    return PoingMan;

  })(MultiPartBoss);

  PoingManPart = (function(_super) {
    __extends(PoingManPart, _super);

    function PoingManPart(x, y) {
      PoingManPart.__super__.constructor.call(this, 'roueman', x, y, 64, 64);
      this.attached = true;
    }

    return PoingManPart;

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

  stage.add(players);

  stage.add(staticCubes);

  stage.add(dynamicEntities);

  stage.add(hudLayer);

  networkManager = new NetworkManager();

  contentLoader = new ContentLoader();

  collisionManager = new CollisionManager();

  keyboard = new Keyboard();

  levelManager = new LevelManager();

  bonusManager = new BonusManager();

  bossManager = new BossManager();

  cubeManager = new CubeManager();

  skinManager = new SkinManager();

  game = new Game();

  game.loadAssets();

  arena = null;

  player = null;

  hud = null;

  skin = {
    body: 1,
    hair: 1,
    head: 1,
    leg: 1,
    shoes: 1,
    skin: 1
  };

  contentLoader.contentsLoaded = function() {
    var launchGame;
    document.querySelector('#login-form').style.display = 'block';
    document.querySelector('#login-loading').style.display = 'none';
    contentLoader.sounds['music'].loop = true;
    /*contentLoader.sounds['music'].play()*/

    launchGame = function(ip, name) {
      var bg, debugLayer, debugMap, fn;
      bg = new Kinetic.Rect({
        width: stage.getWidth(),
        height: stage.getHeight(),
        fillPatternImage: contentLoader.images['bg']
      });
      staticBg.add(bg);
      bg.setZIndex(-1);
      bg.draw();
      arena = new Arena();
      player = new ControllablePlayer(skin);
      hud = new HUD();
      networkManager.connect(ip, name, skin);
      game.update = function(frameTime) {
        players.draw();
        dynamicEntities.draw();
        player.update(frameTime);
        bossManager.update(frameTime);
        hud.update(frameTime);
        return cubeManager.update(frameTime);
      };
      game.start();
      if (config.debug) {
        debugLayer = new Kinetic.Layer();
        stage.add(debugLayer);
        debugLayer.setZIndex(100);
        debugMap = function(map) {
          var shape, subMap, val, x, y, _i, _j, _len, _len1;
          debugLayer.destroyChildren();
          for (x = _i = 0, _len = map.length; _i < _len; x = ++_i) {
            subMap = map[x];
            for (y = _j = 0, _len1 = subMap.length; _j < _len1; y = ++_j) {
              val = subMap[y];
              if (val !== null) {
                shape = new Kinetic.Rect({
                  x: x * 32 + 160,
                  y: arena.y - y * 32 - 32,
                  width: 32,
                  height: 32,
                  stroke: "red"
                });
                debugLayer.add(shape);
              }
            }
          }
          return debugLayer.draw();
        };
        fn = function() {
          return bossManager.spawn('poingman', [0, 2, 4, 6, 8, 10]);
        };
        return setTimeout(fn, 1000);
      }
    };
    return document.querySelector('#play').onclick = function() {
      document.querySelector('#login').style.display = 'none';
      launchGame(document.querySelector('#ip').value.replace(" ", ""), document.querySelector('#name').value);
      return contentLoader.play('beep');
    };
  };

  window.onresize = function() {
    return game.resize();
  };

  document.querySelector('#sound-mute').onclick = function() {
    return contentLoader.muteVolume();
  };

  document.querySelector('#sound-add').onclick = function() {
    return contentLoader.addVolume();
  };

  document.querySelector('#sound-sub').onclick = function() {
    return contentLoader.lessVolume();
  };

  divs = document.querySelectorAll('#skin-control div a');

  for (_i = 0, _len = divs.length; _i < _len; _i++) {
    div = divs[_i];
    div.onclick = function(e) {
      var elm, num;
      contentLoader.play('beep');
      e.preventDefault();
      elm = document.querySelector('#skin-preview .' + this.getAttribute("data-type"));
      if (elm.style.background === "") {
        num = 2;
      } else {
        num = parseInt(elm.style.background.split('/')[4].split('.png')[0]) + parseInt(this.getAttribute("data-add"));
      }
      if (num < 1) {
        num = config.skins[this.getAttribute("data-type")];
      } else if (num > config.skins[this.getAttribute("data-type")]) {
        num = 1;
      }
      elm.style.background = 'url("../assets/player/' + this.getAttribute("data-type") + '/' + num + '.png") 140px 0';
      return skin[this.getAttribute("data-type")] = num;
    };
  }

}).call(this);
