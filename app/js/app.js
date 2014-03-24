(function() {
  var Arena, Bonus, BonusManager, Boss, BossManager, CollisionManager, ContentLoader, ControllablePlayer, CubeFragment, CubeManager, Effect, FallingCube, FreezeMan, FreezeManPart, Game, HUD, HomingMan, HomingManPart, Keyboard, LabiMan, LabiManPart, LevelManager, MissileMan, MissileManPart, MultiPartBoss, NetworkManager, Pidgeon, Player, PoingMan, RandomEvent, RoueMan, SaveManager, SkinManager, SparkMan, SparkManPart, SpecialCube, SpecialCubes, Sprite, SquareEnum, StaticCube, VirtualPlayer, animFrame, arena, bonusManager, bonusTypesId, bossManager, collisionManager, config, contentLoader, cubeManager, debugLayer, debugMap, div, divs, dynamicEntities, game, hud, hudLayer, keyboard, levelManager, networkManager, player, playerAnimationIndexes, players, randomEvents, saveManager, skin, skinManager, spriteAnimations, stage, staticBg, staticCubes, tmpLayer, _i, _len,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = {
    levelHeight: 976,
    levelWidth: 704,
    levelSpeed: 1000,
    playerJumpMax: 2,
    playerJumpHeight: 82,
    playerSpeed: 0.17,
    debug: false,
    skins: {
      body: 4,
      hair: 4,
      head: 3,
      leg: 3,
      shoes: 4,
      skin: 4
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
      this.writting = false;
      this.maxFrameTime = 200;
      this.stats = new Stats();
      this.stats.setMode(0);
      document.body.appendChild(this.stats.domElement);
      this.chatHist = [];
      this.chatHistLen = 5;
    }

    Game.prototype.loop = function() {
      var frameTime, interval, thisFrame, tmpFrameTime;
      this.stats.begin();
      thisFrame = Date.now();
      frameTime = thisFrame - this.lastFrame;
      animFrame(Game.prototype.loop.bind(this));
      this.lastFrame = thisFrame;
      tmpFrameTime = frameTime;
      while (true) {
        if (tmpFrameTime <= 50) {
          interval = tmpFrameTime;
          tmpFrameTime = 0;
        } else {
          interval = 50;
          tmpFrameTime -= 50;
        }
        game.update(interval);
        if (tmpFrameTime === 0) {
          break;
        }
      }
      return this.stats.end();
    };

    Game.prototype.update = function(frameTime) {};

    Game.prototype.draw = function() {};

    Game.prototype.start = function() {
      document.querySelector('#login').style.display = 'none';
      document.querySelector('#container').style.display = 'block';
      this.lastFrame = Date.now();
      this.resize();
      return this.loop();
    };

    Game.prototype.resize = function() {
      document.getElementById("container").style.margin = "-" + (config.levelHeight - window.innerHeight) + " auto";
      return document.getElementById("container").style.width = config.levelWidth;
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
      contentLoader.loadImage({
        name: 'pidgeon',
        url: '../assets/pidgeon.png'
      });
      contentLoader.loadSound({
        name: 'beep',
        url: '../assets/sounds/beep.wav',
        type: 'effect'
      });
      contentLoader.loadSound({
        name: 'death',
        url: '../assets/sounds/death.wav',
        type: 'effect'
      });
      contentLoader.loadSound({
        name: 'explosion',
        url: '../assets/sounds/explosion.wav',
        type: 'effect'
      });
      contentLoader.loadSound({
        name: 'pickup',
        url: '../assets/sounds/pickup.wav',
        type: 'effect'
      });
      contentLoader.loadSound({
        name: 'music1',
        url: '../assets/sounds/music/music.ogg',
        type: 'music'
      });
      contentLoader.loadSound({
        name: 'music2',
        url: '../assets/sounds/music/music2.ogg',
        type: 'music'
      });
      contentLoader.loadSound({
        name: 'music3',
        url: '../assets/sounds/music/music3.ogg',
        type: 'music'
      });
      contentLoader.loadSound({
        name: 'music4',
        url: '../assets/sounds/music/music4.ogg',
        type: 'music'
      });
      contentLoader.loadSound({
        name: 'music5',
        url: '../assets/sounds/music/music5.ogg',
        type: 'music'
      });
      contentLoader.loadSound({
        name: 'music6',
        url: '../assets/sounds/music/music6.ogg',
        type: 'music'
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
        document.getElementById('chatMessage').value = null;
        if (this.closeTime !== void 0) {
          clearInterval(this.closeTime);
        }
        return this.closeTime = setTimeout(this.closeHist, 3000);
      } else {
        this.writting = true;
        this.openHist();
        return document.getElementById('chatMessage').focus();
      }
    };

    Game.prototype.addMessage = function(name, message) {
      var callback, timeout;
      contentLoader.play('beep');
      if (name !== 'Me') {
        document.getElementById('chatMessages').innerHTML += '<div class="message"><span class="from">' + name + '</span> : <span class="content">' + message + '</span></div>';
        callback = function() {
          return document.querySelectorAll('#chatMessages .message')[0].remove();
        };
        timeout = 3000 + message.length * 30;
        setTimeout(callback, timeout);
      }
      this.chatHist.push([name, message]);
      if (this.chatHist.length > this.chatHistLen) {
        this.chatHist.shift();
      }
      return this.composeHistoric();
    };

    Game.prototype.composeHistoric = function() {
      var hist, i, _i, _len, _ref, _results;
      document.getElementById('chatHistoric').innerHTML = "";
      _ref = this.chatHist;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        hist = _ref[i];
        _results.push(document.getElementById('chatHistoric').innerHTML += '<div class="message"><span class="from">' + hist[0] + '</span> : <span class="content">' + hist[1] + '</span></div>');
      }
      return _results;
    };

    Game.prototype.openHist = function() {
      var message, messages, _i, _len;
      messages = document.querySelectorAll('#chatMessages .message');
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        message = messages[_i];
        message.remove();
      }
      return document.getElementById('chatHistoric').style.display = 'block';
    };

    Game.prototype.closeHist = function() {
      return document.getElementById('chatHistoric').style.display = 'none';
    };

    return Game;

  })();

  ContentLoader = (function() {
    function ContentLoader() {
      this.imagesToLoad = [];
      this.soundsToLoad = [];
      this.images = [];
      this.sounds = [];
      this.volumeStep = 0.01;
      this.count = 0;
      this.total = 0;
      this.musics = 0;
      this.currentSong;
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
        audioObj.oncanplaythrough = function() {
          self.count++;
          if (self.count === self.total) {
            return self.contentsLoaded();
          }
        };
        if (sound.type === 'music') {
          this.musics++;
          _results.push(audioObj.addEventListener("ended", function() {
            return self.nextSong();
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ContentLoader.prototype.contentsLoaded = function() {};

    ContentLoader.prototype.muteEffect = function() {
      var sound, _i, _len, _ref;
      _ref = this.soundsToLoad;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'effect') {
          this.sounds[sound.name].volume = 0;
        }
      }
      return document.querySelector('#sound-effect').innerHTML = 0;
    };

    ContentLoader.prototype.muteMusic = function() {
      var sound, _i, _len, _ref;
      _ref = this.soundsToLoad;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'music') {
          this.sounds[sound.name].volume = 0;
        }
      }
      return document.querySelector('#sound-music').innerHTML = 0;
    };

    ContentLoader.prototype.addVolumeEffect = function() {
      var sound, tmp, _i, _len, _ref, _results;
      _ref = this.soundsToLoad;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'effect') {
          tmp = this.sounds[sound.name].volume + this.volumeStep;
          if (tmp <= 1) {
            this.sounds[sound.name].volume = tmp;
          } else {
            tmp = 1;
            this.sounds[sound.name].volume = tmp;
          }
        }
        document.querySelector('#sound-effect').innerHTML = Math.floor(tmp * 100);
        _results.push(document.querySelector('#sound-mute-effect').className = 'un-muted');
      }
      return _results;
    };

    ContentLoader.prototype.addVolumeMusic = function() {
      var sound, tmp, _i, _len, _ref;
      _ref = this.soundsToLoad;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'music') {
          tmp = this.sounds[sound.name].volume + this.volumeStep;
          if (tmp <= 1) {
            this.sounds[sound.name].volume = tmp;
          } else {
            tmp = 1;
            this.sounds[sound.name].volume = tmp;
          }
        }
      }
      document.querySelector('#sound-music').innerHTML = Math.floor(tmp * 100);
      return document.querySelector('#sound-mute-music').className = 'un-muted';
    };

    ContentLoader.prototype.lessVolumeEffect = function() {
      var sound, tmp, _i, _len, _ref, _results;
      _ref = this.soundsToLoad;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'effect') {
          tmp = this.sounds[sound.name].volume - this.volumeStep;
          if (tmp >= 0) {
            this.sounds[sound.name].volume = tmp;
          } else {
            tmp = 0;
            this.sounds[sound.name].volume = tmp;
            document.querySelector('#sound-mute-effect').className = 'muted';
          }
        }
        _results.push(document.querySelector('#sound-effect').innerHTML = Math.floor(tmp * 100));
      }
      return _results;
    };

    ContentLoader.prototype.lessVolumeMusic = function() {
      var sound, tmp, _i, _len, _ref;
      _ref = this.soundsToLoad;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'music') {
          tmp = this.sounds[sound.name].volume - this.volumeStep;
          if (tmp >= 0) {
            this.sounds[sound.name].volume = tmp;
          } else {
            tmp = 0;
            this.sounds[sound.name].volume = tmp;
            document.querySelector('#sound-mute-music').className = 'muted';
          }
        }
      }
      return document.querySelector('#sound-music').innerHTML = Math.floor(tmp * 100);
    };

    ContentLoader.prototype.play = function(sound) {
      this.sounds[sound].pause();
      this.sounds[sound].currentTime = 0;
      return this.sounds[sound].play();
    };

    ContentLoader.prototype.playMusic = function(sound) {
      this.sounds[sound].pause();
      this.sounds[sound].currentTime = 0;
      return this.sounds[sound].play();
    };

    ContentLoader.prototype.playSong = function() {
      var songNumber;
      songNumber = Math.floor((Math.random() * this.musics) + 1);
      this.currentSong = songNumber;
      return this.playMusic('music' + songNumber);
    };

    ContentLoader.prototype.nextSong = function() {
      this.sounds['music' + this.currentSong].pause();
      this.currentSong++;
      if (this.sounds['music' + this.currentSong] !== void 0) {
        return this.playMusic('music' + this.currentSong);
      } else {
        this.playMusic('music1');
        return this.currentSong = 1;
      }
    };

    ContentLoader.prototype.prevSong = function() {
      this.sounds['music' + this.currentSong].pause();
      this.currentSong--;
      if (this.sounds['music' + this.currentSong] !== void 0) {
        return this.playMusic('music' + this.currentSong);
      } else {
        this.currentSong = this.musics;
        return this.playMusic('music' + this.currentSong);
      }
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

    CollisionManager.prototype.isCubeGrabbable = function(cube, player) {
      if (player.getX() > cube.getX()) {
        if (this.checkPresence(cube.getX() + cube.getWidth() + 16, cube.getY() + 80)) {
          return false;
        }
      } else {
        if (this.checkPresence(cube.getX() - 16, cube.getY() + 80)) {
          return false;
        }
      }
      return true;
    };

    CollisionManager.prototype.getAllCollisions = function(shape) {
      return this.getStaticCollisions(shape).concat(this.getDynamicCollisions(shape));
    };

    CollisionManager.prototype.getStaticCollisions = function(shape) {
      var cubes, result, thisBoundBox;
      result = [];
      thisBoundBox = this.getBoundBox(shape);
      cubes = staticCubes.find('Sprite');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(thisBoundBox, cubeBoundBox)) {
          return result.push(cube);
        }
      });
      return result;
    };

    CollisionManager.prototype.getDynamicCollisions = function(shape) {
      var cubes, result, thisBoundBox;
      result = [];
      thisBoundBox = this.getBoundBox(shape);
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        var cubeBoundBox;
        cubeBoundBox = collisionManager.getBoundBox(cube);
        if (collisionManager.colliding(thisBoundBox, cubeBoundBox)) {
          return result.push(cube);
        }
      });
      return result;
    };

    CollisionManager.prototype.getCubeCollisions = function(shape) {
      var cubes, result, thisBoundBox;
      result = [];
      thisBoundBox = this.getBoundBox(shape);
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
      return result.concat(this.getStaticCollisions(shape));
    };

    CollisionManager.prototype.getPlayerSkin = function(shape) {
      return players.find('#skin-' + shape.getId())[0];
    };

    CollisionManager.prototype.getPlayerCollision = function() {
      var playerBoundBox, response;
      response = false;
      playerBoundBox = collisionManager.getBoundBox(player.shape);
      players.find('Rect').each(function(plr) {
        var otherPlayerBoundBox, skin;
        if (plr.getId() !== void 0) {
          skin = collisionManager.getPlayerSkin(plr);
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

    CollisionManager.prototype.getCornerCollisions = function() {
      var cubes, playerBoundBox, result;
      result = [];
      playerBoundBox = this.getBoundBox(player.shape);
      playerBoundBox.left -= 4;
      playerBoundBox.right += 4;
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        var cubeBoundBox;
        if (!cube.getName().falling && cube.getName().type === 'cube') {
          cubeBoundBox = collisionManager.getBoundBox(cube);
          if (collisionManager.colliding(playerBoundBox, cubeBoundBox) && ((cubeBoundBox.left < playerBoundBox.left && player.skin.getScaleX() === -1) || (cubeBoundBox.left > playerBoundBox.left && player.skin.getScaleX() === 1))) {
            if (collisionManager.collidingCorners(playerBoundBox, cubeBoundBox) && collisionManager.isCubeGrabbable(cube, player.shape)) {
              return result.push(cube);
            }
          }
        }
      });
      return result;
    };

    CollisionManager.prototype.checkPresence = function(x, y) {
      var tmp;
      tmp = staticCubes.getIntersection({
        x: x,
        y: y
      });
      if (tmp !== null && tmp.shape) {
        return tmp.shape;
      }
      tmp = dynamicEntities.getIntersection({
        x: x,
        y: y
      });
      if (tmp !== null && tmp.shape) {
        return tmp.shape;
      }
      return false;
    };

    return CollisionManager;

  })();

  playerAnimationIndexes = [
    {
      id: 1,
      name: 'idle'
    }, {
      id: 2,
      name: 'jump'
    }, {
      id: 3,
      name: 'fall'
    }, {
      id: 4,
      name: 'run'
    }, {
      id: 5,
      name: 'couch'
    }, {
      id: 6,
      name: 'couchMove'
    }, {
      id: 7,
      name: 'grabbing'
    }, {
      id: 8,
      name: 'dead'
    }
  ];

  Player = (function() {
    function Player(skin) {
      var callback, self;
      this.heightCouched = 30;
      this.height = 46;
      this.draw();
      self = this;
      callback = function(image) {
        self.skin.setImage(image);
        return self.fixSkinPos();
      };
      skinManager.createSkin(skin, callback, self.skin._id);
    }

    Player.prototype.draw = function() {
      this.shape = new Kinetic.Rect({
        width: 22,
        height: this.height
      });
      players.add(this.shape);
      this.skin = new Sprite(0, 0, SquareEnum.SMALL, 'playerSpirteSheet', 'fall').shape;
      players.add(this.skin);
      this.skin.start();
      return this.spawn();
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
      this.availableDoubleJump = 0;
      this.availableGrab = 0;
      this.grabbing = false;
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

    Player.prototype.changeAnimation = function(id) {
      var animation;
      animation = this.getAnimationByIndex(id);
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

    Player.prototype.getAnimationByIndex = function(index) {
      var anim, _i, _len;
      for (_i = 0, _len = playerAnimationIndexes.length; _i < _len; _i++) {
        anim = playerAnimationIndexes[_i];
        if (anim.id === index) {
          return anim.name;
        }
      }
    };

    Player.prototype.getIndexByAnimation = function(animation) {
      var anim, _i, _len;
      for (_i = 0, _len = playerAnimationIndexes.length; _i < _len; _i++) {
        anim = playerAnimationIndexes[_i];
        if (anim.name === animation) {
          return anim.id;
        }
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
      this.grabbed = false;
      this.coopJump = false;
      this.alive = true;
      this.stomped = false;
      this.actualCollisions = [];
      this.cached = {};
      this.availableDoubleJump = 0;
      this.availableGrab = 0;
    }

    ControllablePlayer.prototype.update = function(frameTime) {
      var collide, moveSide, moveSpeed;
      if (!(!this.alive && this.shape.getY() > stage.getY() * -1 + stage.getHeight())) {
        this.sliding = false;
        this.slowed = false;
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
        if (this.slowed) {
          moveSpeed = moveSpeed / 2;
          this.canJump = false;
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
            }
            if (moveSide !== -1) {
              moveSide = -1;
            }
          } else if (keyboard.keys.right) {
            collide = this.testMove(this.shape.getX() + moveSpeed, 0);
            if (collide) {
              this.shape.setX(collide.getX() - this.shape.getWidth());
            }
            if (moveSide !== 1) {
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
      if (!this.couched && this.jumpCount === 0 || (this.jumpCount < this.jumpMax && this.availableDoubleJump > 0)) {
        if (this.jumpCount > 0) {
          this.availableDoubleJump--;
        }
        if (collisionManager.getPlayerCollision()) {
          this.coopJump = true;
          this.oldStats = {
            jumpHeight: this.jumpHeight,
            jumpMinAcceleration: this.jumpMinAcceleration,
            jumpMaxAcceleration: this.jumpMaxAcceleration,
            jumpDeceleration: this.jumpDeceleration
          };
          this.jumpHeight += 40;
          this.jumpMinAcceleration = 0.1;
          this.jumpMaxAcceleration = 0.7;
          this.jumpDeceleration = 0.92;
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
      if (this.stomped || this.coopJump) {
        return this.reinitJump();
      }
    };

    ControllablePlayer.prototype.reinitJump = function() {
      this.jumpHeight = this.oldStats.jumpHeight;
      this.jumpMinAcceleration = this.oldStats.jumpMinAcceleration;
      this.jumpMaxAcceleration = this.oldStats.jumpMaxAcceleration;
      this.jumpDeceleration = this.oldStats.jumpDeceleration;
      this.stomped = false;
      return this.coopJump = false;
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

    ControllablePlayer.prototype.testMove = function(x, y) {
      var collision, collisions, _i, _len;
      if (x !== 0) {
        this.shape.setX(x);
      }
      if (y !== 0) {
        this.shape.setY(y);
      }
      collisions = collisionManager.getAllCollisions(this.shape);
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
      bonusManager.getBonus(bonus.getName().name);
      bonus.destroy();
      dynamicEntities.draw();
      return networkManager.sendBonusTaken(bonus.getId());
    };

    ControllablePlayer.prototype.changeAnimation = function(animation) {
      if (this.skin.getAnimation() !== animation) {
        this.skin.setAnimation(animation);
        return networkManager.sendAnimation(this.getIndexByAnimation(animation));
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
        this.sliding = true;
      }
      if (effect.getName().name === 'slow') {
        return this.slowed = true;
      }
    };

    ControllablePlayer.prototype.getCornerCollisions = function() {
      var collision, collisions, grab, playerCollision, _i, _len;
      grab = false;
      collisions = collisionManager.getCornerCollisions();
      playerCollision = collisionManager.getPlayerCollision();
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        if (playerCollision) {
          this.grab(collision, false);
          grab = true;
          break;
        } else if (this.availableGrab > 0) {
          this.grab(collision, true);
          grab = true;
          break;
        }
      }
      if (!grab) {
        this.grabbing = false;
        return this.stopGrab();
      }
    };

    ControllablePlayer.prototype.grab = function(cube, bonusGrab) {
      if (!this.grabbing) {
        this.stopJump();
        this.grabbing = true;
        this.jumpCount = 0;
        this.shape.setY(cube.getY());
        if (bonusGrab) {
          return this.grabbed = true;
        }
      }
    };

    ControllablePlayer.prototype.stopGrab = function() {
      if (this.grabbed) {
        this.availableGrab--;
        return this.grabbed = false;
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
      this.skin.setOpacity(0.5);
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
    },
    BONUS: {
      x: 20,
      y: 20
    }
  };

  spriteAnimations = {
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
    ],
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
    'brokenCube': [
      {
        x: 224,
        y: 96,
        width: 32,
        height: 32
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
    'stompblock': [
      {
        x: 128,
        y: 0,
        width: 64,
        height: 64
      }
    ],
    'swapblock': [
      {
        x: 64,
        y: 64,
        width: 64,
        height: 64
      }
    ],
    'tpblock': [
      {
        x: 128,
        y: 64,
        width: 64,
        height: 64
      }
    ],
    'randblock': [
      {
        x: 0,
        y: 128,
        width: 64,
        height: 64
      }
    ],
    'randomEvent': [
      {
        x: 64,
        y: 128,
        width: 64,
        height: 64
      }
    ],
    'slowblock': [
      {
        x: 0,
        y: 64,
        width: 64,
        height: 64
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
    'slow': [
      {
        x: 32,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    'bioExplosion': [
      {
        x: 0,
        y: 834,
        width: 128,
        height: 128
      }, {
        x: 128,
        y: 834,
        width: 128,
        height: 128
      }, {
        x: 256,
        y: 834,
        width: 128,
        height: 128
      }, {
        x: 384,
        y: 834,
        width: 128,
        height: 128
      }, {
        x: 512,
        y: 834,
        width: 128,
        height: 128
      }, {
        x: 640,
        y: 834,
        width: 128,
        height: 128
      }
    ],
    'missileEffect': [
      {
        x: 0,
        y: 32,
        width: 32,
        height: 32
      }, {
        x: 32,
        y: 32,
        width: 32,
        height: 32
      }, {
        x: 64,
        y: 32,
        width: 32,
        height: 32
      }
    ],
    'smallExplosionEffect': [
      {
        x: 0,
        y: 960,
        width: 64,
        height: 64
      }, {
        x: 64,
        y: 960,
        width: 64,
        height: 64
      }, {
        x: 128,
        y: 960,
        width: 64,
        height: 64
      }, {
        x: 192,
        y: 960,
        width: 64,
        height: 64
      }, {
        x: 0,
        y: 1024,
        width: 64,
        height: 64
      }, {
        x: 64,
        y: 1024,
        width: 64,
        height: 64
      }, {
        x: 128,
        y: 1024,
        width: 64,
        height: 64
      }, {
        x: 192,
        y: 1024,
        width: 64,
        height: 64
      }, {
        x: 0,
        y: 1088,
        width: 64,
        height: 64
      }, {
        x: 64,
        y: 1088,
        width: 64,
        height: 64
      }
    ],
    speedBonus: [
      {
        x: 102,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    jumpHeightBonus: [
      {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    doubleJumpBonus: [
      {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    grabbingBonus: [
      {
        x: 34,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    resurectionBonus: [
      {
        x: 68,
        y: 0,
        width: 32,
        height: 32
      }
    ],
    tp: [
      {
        x: 0,
        y: 34,
        width: 32,
        height: 32
      }
    ],
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
        y: 65,
        width: 544,
        height: 30
      }
    ],
    poingman: [
      {
        x: 256,
        y: 0,
        width: 64,
        height: 64
      }
    ],
    labiman: [
      {
        x: 192,
        y: 0,
        width: 64,
        height: 64
      }
    ],
    sparkman: [
      {
        x: 0,
        y: 128,
        width: 64,
        height: 64
      }, {
        x: 64,
        y: 128,
        width: 64,
        height: 64
      }, {
        x: 128,
        y: 128,
        width: 64,
        height: 64
      }
    ],
    spark: [
      {
        x: 0,
        y: 96,
        width: 32,
        height: 32
      }, {
        x: 32,
        y: 96,
        width: 32,
        height: 32
      }, {
        x: 64,
        y: 96,
        width: 32,
        height: 32
      }
    ],
    homingman: [
      {
        x: 192,
        y: 96,
        width: 64,
        height: 64
      }
    ],
    missileman: [
      {
        x: 448,
        y: 0,
        width: 32,
        height: 64
      }
    ],
    powerSpark: [
      {
        x: 96,
        y: 96,
        width: 32,
        height: 32
      }, {
        x: 128,
        y: 96,
        width: 32,
        height: 32
      }
    ],
    phantom: [
      {
        x: 160,
        y: 96,
        width: 32,
        height: 32
      }
    ],
    fly: [
      {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      }, {
        x: 32,
        y: 0,
        width: 32,
        height: 32
      }, {
        x: 64,
        y: 0,
        width: 32,
        height: 32
      }
    ]
  };

  Sprite = (function() {
    function Sprite(x, y, size, spriteSheet, animation) {
      this.shape = new Kinetic.Sprite({
        x: x,
        y: y,
        width: size.x,
        height: size.y,
        image: contentLoader.images[spriteSheet],
        animation: animation,
        animations: spriteAnimations,
        frameRate: 7,
        index: 0,
        transformsEnabled: 'position'
      });
    }

    Sprite.prototype.getSpriteSheet = function() {
      var sheets;
      sheets = ["cubes_red", "cubes_green", "cubes_blue"];
      return sheets[Math.floor(Math.random() * sheets.length)];
    };

    return Sprite;

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

    return FallingCube;

  })(Sprite);

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

  })(Sprite);

  SpecialCubes = ['iceExplosion', 'explosion', 'slowblock', 'stompblock', 'swapblock', 'tpblock', 'randblock'];

  SpecialCube = (function(_super) {
    __extends(SpecialCube, _super);

    function SpecialCube(col, size, type, randType) {
      var rType, x, y;
      x = col * 32 + 160;
      y = stage.getY() * -1;
      this.type = SpecialCubes[type];
      SpecialCube.__super__.constructor.call(this, x, y, size, 'cubes_special', this.type);
      dynamicEntities.add(this.shape);
      if (randType !== void 0) {
        rType = SpecialCubes[randType];
        this.shape.setName({
          type: 'special',
          falling: true,
          randType: rType
        });
      } else {
        this.shape.setName({
          type: 'special',
          falling: true
        });
      }
      this.shape.setId(this.type);
      this.shape.draw();
    }

    return SpecialCube;

  })(Sprite);

  randomEvents = ['resurection', 'bonuses', 'tp'];

  RandomEvent = (function(_super) {
    __extends(RandomEvent, _super);

    function RandomEvent(type) {
      var self, tween, x, y;
      x = stage.getWidth() / 2 - 32;
      y = stage.getY() * -1 - 64;
      this.type = randomEvents[type];
      RandomEvent.__super__.constructor.call(this, x, y, SquareEnum.MEDIUM, 'cubes_special', 'randomEvent');
      dynamicEntities.add(this.shape);
      this.shape.setName({
        type: 'event',
        randType: this.type
      });
      this.shape.draw();
      self = this;
      tween = new Kinetic.Tween({
        node: this.shape,
        duration: 1,
        y: arena.y - levelManager.levelHeight - 640,
        onFinish: function() {
          return self.doEvent();
        }
      });
      tween.play();
      cubeManager.tweens.push(tween);
    }

    RandomEvent.prototype.doEvent = function() {
      var event, i, rand, randType, _i;
      contentLoader.play('explosion');
      event = this.shape.getName().randType;
      if (event === 'resurection') {
        player.resurection();
        new Effect(this.shape.getX(), this.shape.getY(), SquareEnum.SMALL, 'resurectionBonus', null, true);
      } else if (event === 'bonuses') {
        new Effect(this.shape.getX(), this.shape.getY(), SquareEnum.SMALL, 'speedBonus', null, true);
        for (i = _i = 1; _i <= 4; i = ++_i) {
          rand = Math.floor(Math.random() * 12);
          randType = Math.floor(Math.random() * (bonusTypesId.length - 1)) + 1;
          new Bonus(rand, randType, null);
        }
      } else if (event === 'tp') {
        player.shape.setX(this.shape.getX() + 16);
        player.shape.setY(this.shape.getY() + 64);
        new Effect(this.shape.getX(), this.shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      }
      return this.shape.destroy();
    };

    return RandomEvent;

  })(Sprite);

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

    return CubeFragment;

  })(Sprite);

  bonusTypesId = [
    {
      id: 1,
      name: 'speedBonus'
    }, {
      id: 2,
      name: 'jumpHeightBonus'
    }, {
      id: 3,
      name: 'doubleJumpBonus'
    }, {
      id: 4,
      name: 'grabbingBonus'
    }, {
      id: 5,
      name: 'resurectionBonus'
    }
  ];

  Bonus = (function(_super) {
    __extends(Bonus, _super);

    function Bonus(col, typeId, id) {
      var animation, type, x, y, _i, _len;
      animation = '';
      for (_i = 0, _len = bonusTypesId.length; _i < _len; _i++) {
        type = bonusTypesId[_i];
        if (typeId === type.id) {
          animation = type.name;
        }
      }
      x = col * 32 + 160 + 6;
      y = stage.getY() * -1;
      Bonus.__super__.constructor.call(this, x, y, SquareEnum.BONUS, 'bonus', animation);
      dynamicEntities.add(this.shape);
      this.shape.setId('bonus' + id);
      this.shape.setName({
        type: 'bonus',
        name: animation,
        falling: true
      });
      this.shape.setOffsetX(6);
      this.shape.setOffsetY(12);
      this.shape.draw();
    }

    return Bonus;

  })(Sprite);

  BonusManager = (function() {
    function BonusManager() {
      this.bonuses = [
        {
          name: 'doubleJumpBonus',
          attribute: 'jumpCount',
          value: 1
        }, {
          name: 'grabbingBonus',
          attribute: 'grab',
          value: 2
        }, {
          name: 'resurectionBonus',
          attribute: 'resurection'
        }, {
          name: 'speedBonus',
          attribute: 'speed',
          value: 0.015
        }, {
          name: 'jumpHeightBonus',
          attribute: 'jumpHeight',
          value: 3
        }
      ];
      this.timers = [];
    }

    BonusManager.prototype.getBonus = function(bonusName) {
      var bonus, _i, _len, _ref, _results;
      contentLoader.play('pickup');
      _ref = this.bonuses;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bonus = _ref[_i];
        if (bonusName === bonus.name) {
          _results.push(this.addBonus(bonus));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    BonusManager.prototype.addBonus = function(bonus) {
      switch (bonus.attribute) {
        case "speed":
          return player.speed += bonus.value;
        case "jumpHeight":
          return player.jumpHeight += bonus.value;
        case "jumpCount":
          return player.availableDoubleJump += bonus.value;
        case "grab":
          return player.availableGrab += bonus.value;
        case "resurection":
          networkManager.sendResurection();
          return player.resurection();
      }
    };

    BonusManager.prototype.remove = function(id) {
      var bonus;
      bonus = dynamicEntities.find('#' + id);
      return bonus.destroy();
    };

    return BonusManager;

  })();

  LevelManager = (function() {
    function LevelManager() {
      this.tweens = [];
      this.level = 0;
      this.levelHeight = 0;
      this.ground = 0;
    }

    LevelManager.prototype.reset = function() {
      var tween, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.tweens;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        if (tween !== void 0) {
          tween.destroy();
        }
      }
      _ref1 = cubeManager.tweens;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tween = _ref1[_j];
        if (tween !== void 0) {
          tween.destroy();
        }
      }
      stage.setY(0);
      staticBg.setY(0);
      hudLayer.setY(0);
      arena.reset();
      bossManager.reset();
      dynamicEntities.destroyChildren();
      stage.draw();
      this.level = 0;
      this.levelHeight = 0;
      return this.ground = 0;
    };

    LevelManager.prototype.moveLevel = function(height) {
      arena.add(height / 32);
      this.levelHeight += height;
      this.ground = arena.y - this.levelHeight;
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
      bossManager.reset();
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight() || cube.getName().type !== 'cube') {
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
      this.tweens = [];
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
        if (cube.getName().type === 'cube' && cube.getY() < oldCube.getY() && cube.getX() >= oldCube.getX() && cube.getX() <= oldCube.getX() + oldCube.getWidth()) {
          obj = cube.getName();
          if (obj === null || obj === void 0) {
            obj = {};
          }
          obj.falling = true;
          return cube.setName(obj);
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

    CubeManager.prototype.testMove = function(shape, y) {
      var collisions;
      shape.setY(y);
      collisions = collisionManager.getCubeCollisions(shape);
      if (collisions.length > 0) {
        return collisions[0];
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
        this.explosionEffet(shape);
      }
      if (type === 'slowblock') {
        this.slowExplosionEffet(shape);
      }
      if (type === 'stompblock') {
        this.stompEffet(shape);
      }
      if (type === 'swapblock') {
        this.swapEffet(shape);
      }
      if (type === 'tpblock') {
        this.tpEffet(shape);
      }
      if (type === 'randblock') {
        return this.doEffect(shape, shape.getName().randType);
      }
    };

    CubeManager.prototype.destroyEffects = function() {
      var effects;
      effects = dynamicEntities.find('Sprite');
      return effects.each(function(effect) {
        if (effect.getName().type === 'effect') {
          return effect.destroy();
        }
      });
    };

    CubeManager.prototype.iceExplosionEffect = function(shape) {
      contentLoader.play('explosion');
      new Effect(shape.getX() - shape.getWidth() / 2 - 16, shape.getY() - shape.getHeight() / 2 - 32, SquareEnum.SMALL, 'iceExplosionEffect', true);
      staticCubes.find('Sprite').each(function(cube) {
        var i, _i, _ref, _results;
        if (cube.getX() < shape.getX() + 128 && cube.getX() > shape.getX() - 96 && cube.getY() < shape.getY() + 128 && cube.getY() > shape.getY() - 96) {
          _results = [];
          for (i = _i = 0, _ref = (cube.getWidth() / 32) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'ice'));
          }
          return _results;
        }
      });
      dynamicEntities.find('Sprite').each(function(cube) {
        var i, _i, _ref, _results;
        if (!cube.getName().falling && cube.getName().type === 'cube') {
          if (cube.getX() < shape.getX() + 128 && cube.getX() > shape.getX() - 96 && cube.getY() < shape.getY() + 128 && cube.getY() > shape.getY() - 96) {
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

    CubeManager.prototype.slowExplosionEffet = function(shape) {
      contentLoader.play('death');
      new Effect(shape.getX() - shape.getWidth() / 2, shape.getY() - shape.getHeight() / 2, SquareEnum.SMALL, 'bioExplosion', true);
      staticCubes.find('Sprite').each(function(cube) {
        var i, _i, _ref, _results;
        if (cube.getX() < shape.getX() + 96 && cube.getX() > shape.getX() - 64 && cube.getY() < shape.getY() + 128 && cube.getY() > shape.getY() - 64) {
          _results = [];
          for (i = _i = 0, _ref = (cube.getWidth() / 32) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'slow'));
          }
          return _results;
        }
      });
      dynamicEntities.find('Sprite').each(function(cube) {
        var i, _i, _ref, _results;
        if (!cube.getName().falling && cube.getName().type === 'cube') {
          if (cube.getX() < shape.getX() + 96 && cube.getX() > shape.getX() - 64 && cube.getY() < shape.getY() + 128 && cube.getY() > shape.getY() - 64) {
            _results = [];
            for (i = _i = 0, _ref = (cube.getWidth() / 32) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
              _results.push(new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'slow'));
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
          if (cube.getX() >= shape.getX() + i * 32 && cube.getX() <= shape.getX() + i * 32 + 32 && cube.getY() < shape.getY() - (-5 + Math.abs(j)) * 32 && cube.getY() > shape.getY() + (-5 + Math.abs(j)) * 32) {
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
      this.reinitAllPhys();
      return this.destroyEffects();
    };

    CubeManager.prototype.stompEffet = function(shape) {
      contentLoader.play('explosion');
      new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      if (!player.jump && !player.falling) {
        player.oldStats = {
          jumpHeight: player.jumpHeight,
          jumpMinAcceleration: player.jumpMinAcceleration,
          jumpMaxAcceleration: player.jumpMaxAcceleration,
          jumpDeceleration: player.jumpDeceleration
        };
        player.jumpStart = player.shape.getY();
        player.jumpHeight = 300;
        player.jumpMinAcceleration = 0.1;
        player.jumpMaxAcceleration = 1.5;
        player.jumpCurrentAcceleration = player.jumpMaxAcceleration;
        player.jumpDeceleration = 0.92;
        player.jumpCount = player.jumpMax;
        player.stomped = true;
        player.jump = true;
      }
      return shape.destroy();
    };

    CubeManager.prototype.swapEffet = function(shape) {
      var positions, rand;
      contentLoader.play('explosion');
      new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      positions = [];
      players.find('Rect').each(function(plr) {
        var skin;
        if (plr._id !== player.shape._id) {
          skin = players.find('#skin-' + plr.getId())[0];
          if (skin.getAnimation() !== 'dead') {
            return positions.push({
              x: plr.getX(),
              y: plr.getY()
            });
          }
        }
      });
      if (positions.length > 0) {
        rand = Math.floor(Math.random() * positions.length);
        player.shape.setX(positions[rand].x);
        player.shape.setY(positions[rand].y);
        player.jump = false;
      }
      return shape.destroy();
    };

    CubeManager.prototype.tpEffet = function(shape) {
      var pos;
      contentLoader.play('explosion');
      new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      pos = {
        x: shape.getX() + 16,
        y: shape.getY()
      };
      shape.destroy();
      player.shape.setX(pos.x);
      player.shape.setY(pos.y);
      return player.jump = false;
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
      this.socket.on('connect', function() {
        return game.start();
      });
      this.socket.on('fallingCube', function(data) {
        return new FallingCube(data[0], data[1]);
      });
      this.socket.on('fallingBonus', function(data) {
        return new Bonus(data[0], data[1], data[2]);
      });
      this.socket.on('fallingSpecial', function(data) {
        return new SpecialCube(data[0], data[1], data[2]);
      });
      this.socket.on('fallingRandSpecial', function(data) {
        return new SpecialCube(data[0], data[1], 6, data[2]);
      });
      this.socket.on('randomEvent', function(data) {
        return new RandomEvent(data);
      });
      this.socket.on('resetLevel', function() {
        levelManager.reset();
        return player.reset();
      });
      this.socket.on('clearLevel', function(level) {
        levelManager.clearLevel();
        return levelManager.level = level;
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
        var name;
        if (arr[0] === null) {
          name = 'Server';
        } else {
          name = self.players[arr[0]].name.getText();
        }
        return game.addMessage(name, arr[1]);
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
      var image, self, shape, _i, _len;
      self = this;
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        shape = new Kinetic.Image({
          image: image
        });
        tmpLayer.add(shape);
      }
      tmpLayer.draw();
      tmpLayer.toImage({
        callback: function(image) {
          self.callback[id](image);
          return delete self.callback[id];
        }
      });
      tmpLayer.destroyChildren();
      return tmpLayer.draw();
    };

    SkinManager.prototype.setSkin = function(part, value) {
      var elm;
      elm = document.querySelector('#skin-preview .' + part);
      elm.style.background = 'url("assets/player/' + part + '/' + value + '.png") 140px 0';
      skin[part] = value;
      return document.querySelector('#skin-control .' + part + ' .number').innerHTML = value;
    };

    SkinManager.prototype.getSkin = function(part) {
      return document.querySelector('#skin-control .' + part + ' .number').innerHTML;
    };

    return SkinManager;

  })();

  SaveManager = (function() {
    function SaveManager() {}

    SaveManager.prototype.saveOptions = function() {
      localStorage.setItem('player_name', document.querySelector('#name').value);
      localStorage.setItem('player_skin', skinManager.getSkin('skin'));
      localStorage.setItem('player_hair', skinManager.getSkin('hair'));
      localStorage.setItem('player_head', skinManager.getSkin('head'));
      localStorage.setItem('player_body', skinManager.getSkin('body'));
      localStorage.setItem('player_leg', skinManager.getSkin('leg'));
      return localStorage.setItem('player_shoes', skinManager.getSkin('shoes'));
    };

    SaveManager.prototype.loadOptions = function() {
      document.querySelector('#name').value = localStorage.getItem('player_name');
      skinManager.setSkin('skin', localStorage.getItem('player_skin') || 1);
      skinManager.setSkin('hair', localStorage.getItem('player_hair') || 1);
      skinManager.setSkin('head', localStorage.getItem('player_head') || 1);
      skinManager.setSkin('body', localStorage.getItem('player_body') || 1);
      skinManager.setSkin('leg', localStorage.getItem('player_leg') || 1);
      return skinManager.setSkin('shoes', localStorage.getItem('player_shoes') || 1);
    };

    return SaveManager;

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
        return shape.destroy();
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
      this.buffs = [];
      this.drawHUD();
    }

    HUD.prototype.update = function(frameTime) {
      var text;
      text = 'Level : ' + levelManager.level;
      if (text !== this.level.getText()) {
        this.level.setText(text);
      }
      text = 'Jump : ' + Math.floor(player.jumpHeight / 32 * 100) / 100;
      if (text !== this.jump.getText()) {
        this.jump.setText(text);
      }
      text = 'Speed : ' + Math.floor(player.speed / config.playerSpeed * 100) + "%";
      if (text !== this.speed.getText()) {
        this.speed.setText(text);
      }
      text = 'Double Jumps : ' + player.availableDoubleJump;
      if (text !== this.doubleJump.getText()) {
        this.doubleJump.setText(text);
      }
      text = 'Hook time : ' + player.availableGrab;
      if (text !== this.grabbing.getText()) {
        this.grabbing.setText(text);
      }
      return hudLayer.draw();
    };

    HUD.prototype.drawHUD = function() {
      this.level = new Kinetic.Text({
        y: arena.y,
        fill: 'black',
        fontFamily: 'Calibri',
        fontSize: 18
      });
      hudLayer.add(this.level);
      this.jump = new Kinetic.Text({
        y: arena.y,
        x: stage.getWidth() - 128,
        fill: 'black',
        fontFamily: 'Calibri',
        fontSize: 18
      });
      hudLayer.add(this.jump);
      this.speed = new Kinetic.Text({
        y: arena.y - 20,
        x: stage.getWidth() - 128,
        fill: 'black',
        fontFamily: 'Calibri',
        fontSize: 18
      });
      hudLayer.add(this.speed);
      this.doubleJump = new Kinetic.Text({
        y: arena.y - 40,
        x: stage.getWidth() - 128,
        fill: 'black',
        fontFamily: 'Calibri',
        fontSize: 18
      });
      hudLayer.add(this.doubleJump);
      this.grabbing = new Kinetic.Text({
        y: arena.y - 60,
        x: stage.getWidth() - 128,
        fill: 'black',
        fontFamily: 'Calibri',
        fontSize: 18
      });
      return hudLayer.add(this.grabbing);
    };

    return HUD;

  })();

  Effect = (function(_super) {
    __extends(Effect, _super);

    function Effect(x, y, size, anim, hasCycle, engineAnimation) {
      var len, self, shape, tween;
      if (engineAnimation !== void 0) {
        Effect.__super__.constructor.call(this, x, y, size, 'bonus', anim);
        dynamicEntities.add(this.shape);
        this.shape.setName({
          type: 'effect',
          name: anim
        });
        this.shape.draw();
        this.shape.setX(this.shape.getX() + 16);
        this.shape.setY(this.shape.getY() + 16);
        shape = this.shape;
        tween = new Kinetic.Tween({
          node: this.shape,
          duration: 0.3,
          scaleX: 2,
          scaleY: 2,
          x: x,
          y: y,
          onFinish: function() {
            return shape.destroy();
          }
        });
        tween.play();
        cubeManager.tweens.push(tween);
      } else {
        Effect.__super__.constructor.call(this, x, y, size, 'effects', anim);
        dynamicEntities.add(this.shape);
        this.shape.setName({
          type: 'effect',
          name: anim
        });
        this.shape.draw();
        if (anim === 'explosionEffect' || anim === 'iceExplosionEffect' || anim === 'smallExplosionEffect') {
          this.shape.setFrameRate(20);
        } else if (anim === 'blood' || anim === 'bioExplosion') {
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
    }

    return Effect;

  })(Sprite);

  Pidgeon = (function(_super) {
    __extends(Pidgeon, _super);

    function Pidgeon() {
      Pidgeon.__super__.constructor.call(this, -32, this.getY(), SquareEnum.SMALL, 'pidgeon', 'fly');
      staticBg.add(this.shape);
      this.shape.setFrameRate(8);
      this.shape.start();
      this.speed = 0.05;
      this.side = 1;
    }

    Pidgeon.prototype.update = function(frametime) {
      var moveSpeed, tmp;
      moveSpeed = this.speed * frametime;
      tmp = this.shape.getX() + moveSpeed * this.side;
      if (tmp > 1000 || tmp < -256) {
        this.side *= -1;
        this.shape.setScaleX(this.side);
        this.shape.setY(this.getY());
      }
      return this.shape.setX(tmp);
    };

    Pidgeon.prototype.getY = function() {
      return arena.y - Math.floor((Math.random() * 12) + 12) * 32;
    };

    return Pidgeon;

  })(Sprite);

  Boss = (function(_super) {
    __extends(Boss, _super);

    function Boss(type, x, y, w, h) {
      this.origin = {
        x: x,
        y: y
      };
      this.speed = 0.2;
      Boss.__super__.constructor.call(this, x, y, {
        x: w,
        y: h
      }, 'boss', type);
      dynamicEntities.add(this.shape);
      this.shape.setName({
        type: 'boss',
        name: type
      });
      this.shape.setFrameRate(10);
      this.shape.start();
    }

    Boss.prototype.finish = function() {
      bossManager.stopUpdate();
      this.shape.destroy();
      return networkManager.sendBossBeaten();
    };

    Boss.prototype.reset = function() {
      return this.shape.destroy();
    };

    Boss.prototype.move = function(frameTime, x, y) {
      var speed, tmp;
      speed = this.speed * frameTime;
      if (this.origin.x > x) {
        tmp = this.shape.getX() - speed;
        if (tmp > x) {
          this.shape.setX(tmp);
        } else {
          this.shape.setX(x);
          this.origin.x = x;
        }
      } else if (this.origin.x < x) {
        tmp = this.shape.getX() + speed;
        if (tmp < x) {
          this.shape.setX(tmp);
        } else {
          this.shape.setX(x);
          this.origin.x = x;
        }
      }
      if (this.origin.y > y) {
        tmp = this.shape.getY() - speed;
        if (tmp > y) {
          this.shape.setY(tmp);
        } else {
          this.shape.setY(y);
          this.origin.y = y;
        }
      } else if (this.origin.y < y) {
        tmp = this.shape.getY() + speed;
        if (tmp < y) {
          this.shape.setY(tmp);
        } else {
          this.shape.setY(y);
          this.origin.y = y;
        }
      }
      if (this.shape.getX() === x && this.shape.getY() === y) {
        return true;
      } else {
        return false;
      }
    };

    Boss.prototype.vectorMove = function(frameTime, vX, vY, mX, pX, mY, pY) {
      var collisions, tmpX, tmpY;
      tmpX = this.shape.getX() + vX;
      tmpY = this.shape.getY() + vY;
      collisions = {
        mX: false,
        mY: false,
        pX: false,
        pY: false
      };
      if (tmpX <= mX) {
        this.shape.setX(mX);
        collisions.mX = true;
      } else {
        this.shape.setX(tmpX);
      }
      if (tmpY <= mY) {
        this.shape.setY(mY);
        collisions.mY = true;
      } else {
        this.shape.setY(tmpY);
      }
      if (tmpX >= pX) {
        this.shape.setX(pX);
        collisions.pX = true;
      } else {
        this.shape.setX(tmpX);
      }
      if (tmpY >= pY) {
        this.shape.setY(pY);
        collisions.pY = true;
      } else {
        this.shape.setY(tmpY);
      }
      return collisions;
    };

    return Boss;

  })(Sprite);

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
      if (boss === 1) {
        this.currentBoss = new RoueMan(options);
      }
      if (boss === 2) {
        this.currentBoss = new FreezeMan(options);
      }
      if (boss === 3) {
        this.currentBoss = new PoingMan(options);
      }
      if (boss === 4) {
        this.currentBoss = new LabiMan(options);
      }
      if (boss === 5) {
        this.currentBoss = new SparkMan(options);
      }
      if (boss === 6) {
        this.currentBoss = new HomingMan(options);
      }
      if (boss === 7) {
        return this.currentBoss = new MissileMan(options);
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
      var x, y;
      x = stage.getWidth() / 2 - 32;
      y = levelManager.ground - 1024;
      RoueMan.__super__.constructor.call(this, 'roueman', x, y, 64, 64);
      this.attacks = pattern[1];
      this.attackIndex = 0;
      this.speed = pattern[0];
      this.start();
    }

    RoueMan.prototype.start = function() {
      var self;
      this.next();
      self = this;
      return bossManager.update = function(frameTime) {
        if (self.move(frameTime, self.attack.x, self.attack.y)) {
          return self.next();
        }
      };
    };

    RoueMan.prototype.next = function() {
      var tmp;
      tmp = this.attacks[this.attackIndex];
      if (tmp !== void 0) {
        this.attack = {
          x: this.shape.getX() + tmp[0] * 32,
          y: this.shape.getY() + tmp[1] * 32
        };
        return this.attackIndex++;
      } else {
        return this.finish();
      }
    };

    return RoueMan;

  })(Boss);

  FreezeMan = (function() {
    function FreezeMan(pattern) {
      this.speed = pattern[0][0];
      this.counter = 0;
      this.interval = pattern[0][1];
      this.attacks = pattern[1];
      this.attackIndex = 0;
      this.count = 0;
      this.parts = [];
      this.start();
      this.next();
    }

    FreezeMan.prototype.start = function() {
      var i, self, _i;
      for (i = _i = 5; _i <= 16; i = ++_i) {
        new Effect(i * 32, levelManager.ground - 4, SquareEnum.SMALL, 'ice');
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
            if (tmp < levelManager.ground) {
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
      this.waiting = false;
      this.time = 0;
      this.speed = pattern[0][0];
      this.attackSpeed = pattern[0][1];
      this.waitTime = pattern[0][2];
      this.attacks = pattern[1];
      this.originSpeed = this.speed;
      this.index = 0;
      this.start();
    }

    PoingMan.prototype.start = function() {
      var self;
      self = this;
      return bossManager.update = function(frameTime) {
        if (self.attacking && !self.finishing && !self.starting && !self.waiting) {
          if (!self.comeBack && self.move(frameTime, self.shape.getX(), self.levelHeight - 62)) {
            return self.destroyBlocks();
          } else if (self.move(frameTime, self.shape.getX(), self.y)) {
            return self.finishAttack();
          }
        } else if (!self.finishing && !self.starting && !self.waiting) {
          if (self.move(frameTime, self.attacks[self.index] * 32 + 160, self.shape.getY())) {
            self.attacking = true;
            self.waiting = true;
            return self.speed = self.attackSpeed;
          }
        } else if (!self.starting && !self.waiting) {
          if (self.move(frameTime, 800, self.shape.getY())) {
            return self.finish();
          }
        } else if (!self.waiting) {
          if (self.move(frameTime, 0, self.shape.getY())) {
            return self.starting = false;
          }
        } else {
          return self.wait(frameTime);
        }
      };
    };

    PoingMan.prototype.finishAttack = function() {
      this.index++;
      this.attacking = false;
      this.comeBack = false;
      this.speed = this.originSpeed;
      if (this.attacks[this.index] === void 0) {
        this.finishing = true;
        return this.regenMap();
      }
    };

    PoingMan.prototype.destroyBlocks = function() {
      var collision, collisions, cube, i, _i, _j, _len, _ref;
      contentLoader.play('explosion');
      this.comeBack = true;
      collisions = collisionManager.getStaticCollisions(this.shape);
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        if (collision.getName() === void 0 || collision.getName().broken !== true) {
          for (i = _j = 0, _ref = (collision.getWidth() / 32) - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
            cube = new Sprite(collision.getX() + i * 32, collision.getY(), SquareEnum.SMALL, 'cubes', 'brokenCube');
            cube.shape.setName({
              type: 'cube',
              broken: true
            });
            staticCubes.add(cube.shape);
          }
        }
        collision.destroy();
      }
      return staticCubes.draw();
    };

    PoingMan.prototype.regenMap = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 12; i = ++_i) {
        _results.push(new StaticCube(i * 32 + 128, this.levelHeight, SquareEnum.SMALL));
      }
      return _results;
    };

    PoingMan.prototype.wait = function(frameTime) {
      this.time += frameTime;
      if (this.time >= this.waitTime) {
        this.time = 0;
        return this.waiting = false;
      }
    };

    return PoingMan;

  })(Boss);

  LabiMan = (function(_super) {
    __extends(LabiMan, _super);

    function LabiMan(pattern) {
      var x, y;
      x = 256;
      y = stage.getY() * -1;
      this.oldPos = {
        x: x,
        y: y
      };
      LabiMan.__super__.constructor.call(this, 'labiman', x, y, 64, 64);
      this.attacks = pattern[1];
      this.speed = pattern[0][0];
      this.attackSpeed = pattern[0][1];
      this.wait = pattern[0][2];
      this.maxHeight = this.getMaxHeight();
      this.waiting = false;
      this.attacking = false;
      this.index = 0;
      this.waitTime = 0;
      this.start();
    }

    LabiMan.prototype.getMaxHeight = function() {
      var attack, max, _i, _len, _ref;
      max = 0;
      _ref = this.attacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attack = _ref[_i];
        if (attack[1] > max) {
          max = attack[1];
        }
      }
      return max;
    };

    LabiMan.prototype.start = function() {
      var self;
      self = this;
      this.parts.push(new LabiManPart());
      return bossManager.update = function(frameTime) {
        if (!self.waiting) {
          if (self.move(frameTime, self.attacks[self.index][0] * 32 + 160, levelManager.ground - self.attacks[self.index][1] * 32)) {
            self.index++;
            self.placeBlock();
            if (self.attacks[self.index] === void 0) {
              self.waiting = true;
            }
          }
        } else {
          self.bossEscape(frameTime);
        }
        if (self.attacking) {
          self.attack(frameTime);
        }
        self.waitTime += frameTime;
        if (!self.attacking && self.waitTime >= self.wait) {
          return self.attacking = true;
        }
      };
    };

    LabiMan.prototype.attack = function(frameTime) {
      var maxH, tmp;
      tmp = this.parts[0].shape.getY() - this.attackSpeed * frameTime;
      maxH = levelManager.ground - this.maxHeight * 32 + 8;
      if (tmp > maxH) {
        return this.parts[0].shape.setY(tmp);
      } else {
        this.parts[0].shape.setY(maxH);
        return this.finish();
      }
    };

    LabiMan.prototype.placeBlock = function() {
      return new CubeFragment(this.shape.getX(), this.shape.getY(), SquareEnum.SMALL);
    };

    LabiMan.prototype.bossEscape = function(frameTime) {
      var tmp;
      tmp = this.shape.getX() + this.speed * frameTime;
      if (tmp < 800) {
        return this.shape.setX(tmp);
      }
    };

    LabiMan.prototype.finish = function() {
      LabiMan.__super__.finish.call(this);
      return dynamicEntities.find('Sprite').each(function(cube) {
        return cube.destroy();
      });
    };

    return LabiMan;

  })(MultiPartBoss);

  LabiManPart = (function(_super) {
    __extends(LabiManPart, _super);

    function LabiManPart() {
      var y;
      y = arena.y - levelManager.levelHeight + 32;
      LabiManPart.__super__.constructor.call(this, 'freezeman', 80, y, 544, 32);
    }

    return LabiManPart;

  })(Boss);

  SparkMan = (function(_super) {
    __extends(SparkMan, _super);

    function SparkMan(pattern) {
      var x, y;
      x = stage.getWidth() / 2 - 32;
      y = stage.getY() * -1 - 64;
      SparkMan.__super__.constructor.call(this, 'sparkman', x, y, 64, 64);
      this.speed = pattern[0][0];
      this.attackSpeed = pattern[0][1];
      this.interval = pattern[0][2];
      this.attacks = pattern[1];
      this.position = levelManager.ground - 512;
      this.time = 0;
      this.attackCount = 0;
      this.attackFinished = 0;
      this.attackIndex = 0;
      this.inPosition = false;
      this.start();
    }

    SparkMan.prototype.start = function() {
      var self;
      self = this;
      return bossManager.update = function(frameTime) {
        if (!self.inPosition) {
          if (self.move(frameTime, self.shape.getX(), self.position)) {
            self.inPosition = true;
            self.time = self.interval * 0.75;
          }
        } else if (self.time >= self.interval) {
          self.time = 0;
          self.attack();
        } else if (self.attackCount < self.attacks.length) {
          self.time += frameTime;
        }
        return self.updateParts(frameTime);
      };
    };

    SparkMan.prototype.attack = function() {
      this.parts.push(new SparkManPart(this.shape.getX(), this.shape.getY() + 64, this.attacks[this.attackIndex]));
      this.parts.push(new SparkManPart(this.shape.getX(), this.shape.getY() + 64, this.attacks[this.attackIndex + 1]));
      this.attackCount += 2;
      return this.attackIndex += 2;
    };

    SparkMan.prototype.updateParts = function(frameTime) {
      var collisions, part, vX, vY, _i, _len, _ref;
      _ref = this.parts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        vX = this.attackSpeed * frameTime * part.sideX;
        vY = part.ySpeed * frameTime * part.sideY;
        collisions = part.vectorMove(frameTime, vX, vY, 160, stage.getWidth() - 192, this.position - 96, levelManager.ground - 32);
        if (collisions.mX || collisions.pX) {
          part.changeSide('x');
        }
        if (collisions.mY || collisions.pY) {
          part.changeSide('y');
        }
        if (part.alive) {
          part.life += frameTime;
          if (part.life > this.interval * 2) {
            part.reset();
          }
        }
      }
      if (this.attackFinished === this.attacks.length) {
        return this.quitScreen(frameTime);
      }
    };

    SparkMan.prototype.quitScreen = function(frameTime) {
      if (this.move(frameTime, 800, this.shape.getY())) {
        return this.finish();
      }
    };

    return SparkMan;

  })(MultiPartBoss);

  SparkManPart = (function(_super) {
    __extends(SparkManPart, _super);

    function SparkManPart(x, y, attack) {
      SparkManPart.__super__.constructor.call(this, 'powerSpark', x, y, 32, 32);
      this.sideX = attack[0];
      this.sideY = attack[1];
      this.ySpeed = attack[2];
      this.life = 0;
      this.alive = true;
    }

    SparkManPart.prototype.changeSide = function(side) {
      if (side === 'x') {
        return this.sideX *= -1;
      } else {
        return this.sideY *= -1;
      }
    };

    SparkManPart.prototype.reset = function() {
      SparkManPart.__super__.reset.call(this);
      bossManager.currentBoss.attackFinished++;
      return this.alive = false;
    };

    return SparkManPart;

  })(Boss);

  HomingMan = (function(_super) {
    __extends(HomingMan, _super);

    function HomingMan(pattern) {
      var x, y;
      x = stage.getWidth() / 2 - 32;
      y = stage.getY() * -1 - 64;
      HomingMan.__super__.constructor.call(this, 'homingman', x, y, 64, 64);
      this.speed = pattern[0][0];
      this.attackSpeed = pattern[0][1];
      this.interval = pattern[0][2];
      this.attacks = pattern[1];
      this.partLife = pattern[0][2];
      this.position = levelManager.ground - 384;
      this.time = 0;
      this.attackCount = 0;
      this.attackFinished = 0;
      this.attackIndex = 0;
      this.inPosition = false;
      this.start();
    }

    HomingMan.prototype.start = function() {
      var self;
      self = this;
      return bossManager.update = function(frameTime) {
        if (!self.inPosition) {
          self.moveToPosition(frameTime);
        } else if (self.time >= self.interval) {
          self.time = 0;
          self.attack();
        } else if (self.attackCount < self.attacks) {
          self.time += frameTime;
        }
        return self.updateParts(frameTime);
      };
    };

    HomingMan.prototype.moveToPosition = function(frameTime) {
      var tmp;
      tmp = this.shape.getY() + this.speed * frameTime;
      if (tmp < this.position) {
        return this.shape.setY(tmp);
      } else {
        this.shape.setY(this.position);
        this.inPosition = true;
        return this.time = this.interval * 0.75;
      }
    };

    HomingMan.prototype.attack = function() {
      var i, id, _i, _len, _ref;
      _ref = networkManager.playersId;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        id = _ref[i];
        if (networkManager.players[id] !== void 0) {
          this.parts.push(new HomingManPart(this.shape.getX(), this.shape.getY() + 64, this.partLife, networkManager.players[id]));
          this.attackCount++;
        }
      }
      this.parts.push(new HomingManPart(this.shape.getX(), this.shape.getY() + 64, this.partLife, player));
      return this.attackCount++;
    };

    HomingMan.prototype.updateParts = function(frameTime) {
      var part, ratioX, ratioY, speedX, speedY, tmp, _i, _len, _ref;
      _ref = this.parts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        ratioX = part.ratioX;
        ratioY = 1;
        speedX = this.attackSpeed * ratioX * frameTime;
        speedY = this.attackSpeed * ratioY * frameTime;
        tmp = part.shape.getX() + speedX;
        if (tmp > part.target.shape.getX()) {
          part.shape.setX(part.shape.getX() - speedX);
        } else {
          part.shape.setX(part.shape.getX() + speedX);
        }
        part.shape.setY(part.shape.getY() + speedY);
        if (part.ratioX - 0.015 > 0.1) {
          part.ratioX -= 0.015;
        } else {
          part.ratioX = 0.1;
        }
        if (part.shape.getY() > levelManager.ground) {
          part.reset();
        }
      }
      if (this.attackFinished === this.attacks) {
        return this.quitScreen(frameTime);
      }
    };

    HomingMan.prototype.quitScreen = function(frameTime) {
      var tmp;
      tmp = this.shape.getX() + this.speed * frameTime;
      if (tmp < 800) {
        return this.shape.setX(tmp);
      } else {
        return this.finish();
      }
    };

    return HomingMan;

  })(MultiPartBoss);

  HomingManPart = (function(_super) {
    __extends(HomingManPart, _super);

    function HomingManPart(x, y, life, target) {
      var fn, self;
      HomingManPart.__super__.constructor.call(this, 'phantom', x, y, 32, 32);
      this.target = target;
      this.alive = true;
      this.ratioX = 1;
      self = this;
      fn = function() {
        return self.reset();
      };
      setTimeout(fn, life);
    }

    HomingManPart.prototype.reset = function() {
      if (this.alive) {
        this.alive = false;
        bossManager.currentBoss.attackFinished++;
        return HomingManPart.__super__.reset.call(this);
      }
    };

    return HomingManPart;

  })(Boss);

  MissileMan = (function(_super) {
    __extends(MissileMan, _super);

    function MissileMan(pattern) {
      MissileMan.__super__.constructor.call(this, 'missileman', -512, 0, 0, 0);
      this.speed = pattern[0][0];
      this.interval = pattern[0][1];
      this.attacks = pattern[1];
      this.time = 0;
      this.attackCount = 0;
      this.attackFinished = 0;
      this.attackIndex = 0;
      this.start();
    }

    MissileMan.prototype.start = function() {
      var self;
      self = this;
      return bossManager.update = function(frameTime) {
        if (self.time >= self.interval) {
          self.time = 0;
          self.attack();
        } else if (self.attackCount < self.attacks.length) {
          self.time += frameTime;
        }
        return self.updateParts(frameTime);
      };
    };

    MissileMan.prototype.attack = function() {
      this.parts.push(new MissileManPart(this.attacks[this.attackIndex][0], levelManager.ground, this.attacks[this.attackIndex][1]));
      this.attackCount++;
      return this.attackIndex++;
    };

    MissileMan.prototype.updateParts = function(frameTime) {
      var part, sky, speed, _i, _len, _ref;
      _ref = this.parts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        speed = frameTime * this.speed;
        if (part.launching) {
          part.shape.setY(part.shape.getY() - speed);
          part.effect.shape.setY(part.effect.shape.getY() - speed);
          sky = levelManager.ground - 1024;
          if (part.shape.getY() < sky) {
            part.launching = false;
            part.shape.setY(sky);
            part.changeSide(-1);
            part.shape.setX(part.destination);
            part.effect.shape.setX(part.destination);
          }
        } else {
          part.shape.setY(part.shape.getY() + speed);
          part.effect.shape.setY(part.effect.shape.getY() + speed);
          if (part.shape.getY() >= levelManager.ground) {
            part.reset();
          }
        }
      }
      if (this.attackFinished === this.attacks.length) {
        return this.finish();
      }
    };

    return MissileMan;

  })(MultiPartBoss);

  MissileManPart = (function(_super) {
    __extends(MissileManPart, _super);

    function MissileManPart(x, y, destination) {
      var side;
      MissileManPart.__super__.constructor.call(this, 'missileman', x, y, 32, 32);
      this.launching = true;
      this.alive = true;
      side = 1;
      this.effect = new Effect(x, y, SquareEnum.SMALL, 'missileEffect');
      this.destination = destination;
      this.changeSide(side);
    }

    MissileManPart.prototype.changeSide = function(side) {
      if (side === 1) {
        this.effect.shape.setScaleY(-1);
        return this.effect.shape.setY(this.shape.getY() + 95);
      } else {
        this.shape.setScaleY(-1);
        this.effect.shape.setScaleY(1);
        return this.effect.shape.setY(this.shape.getY() - 95);
      }
    };

    MissileManPart.prototype.reset = function() {
      var effect, effectBoundBox, playerBoundBox;
      if (this.alive) {
        MissileManPart.__super__.reset.call(this);
        this.effect.shape.destroy();
        this.alive = false;
        bossManager.currentBoss.attackFinished++;
        contentLoader.play('explosion');
        effect = new Effect(this.shape.getX() - 16, this.shape.getY() - 64, SquareEnum.MEDIUM, 'smallExplosionEffect', true);
        playerBoundBox = collisionManager.getBoundBox(player.shape);
        effectBoundBox = collisionManager.getBoundBox(effect.shape);
        if (collisionManager.colliding(playerBoundBox, effectBoundBox)) {
          return player.kill();
        }
      }
    };

    return MissileManPart;

  })(Boss);

  stage = new Kinetic.Stage({
    container: 'container',
    width: config.levelWidth,
    height: config.levelHeight
  });

  dynamicEntities = new Kinetic.Layer({
    hitGraphEnabled: false
  });

  players = new Kinetic.Layer({
    hitGraphEnabled: false
  });

  staticCubes = new Kinetic.Layer({
    hitGraphEnabled: false
  });

  staticBg = new Kinetic.Layer({
    hitGraphEnabled: false
  });

  hudLayer = new Kinetic.Layer({
    hitGraphEnabled: false
  });

  tmpLayer = new Kinetic.Layer({
    hitGraphEnabled: false
  });

  stage.add(staticBg);

  stage.add(players);

  stage.add(staticCubes);

  stage.add(dynamicEntities);

  stage.add(hudLayer);

  stage.add(tmpLayer);

  networkManager = new NetworkManager();

  contentLoader = new ContentLoader();

  collisionManager = new CollisionManager();

  keyboard = new Keyboard();

  levelManager = new LevelManager();

  bonusManager = new BonusManager();

  bossManager = new BossManager();

  cubeManager = new CubeManager();

  skinManager = new SkinManager();

  saveManager = new SaveManager();

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
  }

  contentLoader.contentsLoaded = function() {
    var launchGame;
    document.querySelector('#login-form').style.display = 'block';
    document.querySelector('#login-loading').style.display = 'none';
    document.querySelector('#ip').value = window.location.host;
    saveManager.loadOptions();
    contentLoader.playSong();
    launchGame = function(ip, name) {
      var bg, pidgeon;
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
      pidgeon = new Pidgeon();
      game.update = function(frameTime) {
        game.draw();
        player.update(frameTime);
        bossManager.update(frameTime);
        hud.update(frameTime);
        cubeManager.update(frameTime);
        return pidgeon.update(frameTime);
      };
      return game.draw = function() {
        players.draw();
        return dynamicEntities.draw();
      };
    };
    return document.querySelector('#play').onclick = function() {
      var ip, name;
      ip = document.querySelector('#ip').value.replace(" ", "");
      name = document.querySelector('#name').value;
      document.querySelector('#login-form').style.display = 'none';
      document.querySelector('#login-loading').style.display = 'block';
      document.querySelector('#login-loading').innerHTML = 'Waiting for ' + ip + '...';
      launchGame(ip, name);
      contentLoader.play('beep');
      return saveManager.saveOptions();
    };
  };

  window.onresize = function() {
    return game.resize();
  };

  document.querySelector('#sound-mute-effect').onclick = function() {
    this.className = 'muted';
    return contentLoader.muteEffect();
  };

  document.querySelector('#sound-mute-music').onclick = function() {
    this.className = 'muted';
    return contentLoader.muteMusic();
  };

  document.querySelector('#sound-add-effect').onclick = function() {
    return contentLoader.addVolumeEffect();
  };

  document.querySelector('#sound-add-music').onclick = function() {
    return contentLoader.addVolumeMusic();
  };

  document.querySelector('#sound-sub-effect').onclick = function() {
    return contentLoader.lessVolumeEffect();
  };

  document.querySelector('#sound-sub-music').onclick = function() {
    return contentLoader.lessVolumeMusic();
  };

  document.querySelector('#music-prev').onclick = function() {
    return contentLoader.prevSong();
  };

  document.querySelector('#music-next').onclick = function() {
    return contentLoader.nextSong();
  };

  divs = document.querySelectorAll('#skin-control div a');

  for (_i = 0, _len = divs.length; _i < _len; _i++) {
    div = divs[_i];
    div.onclick = function(e) {
      var elm, num, tmp;
      contentLoader.play('beep');
      e.preventDefault();
      elm = document.querySelector('#skin-preview .' + this.getAttribute("data-type"));
      tmp = elm.style.background.split('/');
      num = parseInt(tmp[tmp.length - 1].split('.png')[0]) + parseInt(this.getAttribute("data-add"));
      if (num < 1) {
        num = config.skins[this.getAttribute("data-type")];
      } else if (num > config.skins[this.getAttribute("data-type")]) {
        num = 1;
      }
      elm.style.background = 'url("assets/player/' + this.getAttribute("data-type") + '/' + num + '.png") 140px 0';
      skin[this.getAttribute("data-type")] = num;
      return document.querySelector('#skin-control .' + this.getAttribute("data-type") + ' .number').innerHTML = num;
    };
  }

}).call(this);
