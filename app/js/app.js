(function() {
  var Arena, Bonus, BonusManager, Boss, BossManager, CollisionManager, ContentLoader, ControllablePlayer, CubeFragment, CubeManager, Effect, FallingCube, FreezeMan, FreezeManPart, Game, HUD, HomingMan, HomingManPart, Keyboard, LabiMan, LabiManPart, LevelManager, MissileMan, MissileManPart, MultiPartBoss, NetworkManager, Pidgeon, Player, PoingMan, RandomEvent, RoueMan, SaveManager, SkinManager, SparkMan, SparkManPart, SpecialCube, SpecialCubes, Sprite, SquareEnum, StaticCube, VirtualPlayer, animFrame, arena, bonusManager, bonusTypesId, bossManager, collisionManager, config, contentLoader, cubeManager, debugLayer, debugMap, div, divs, dynamicEntities, game, hud, hudLayer, keyboard, levelManager, networkManager, player, playerAnimationIndexes, players, randomEvents, saveManager, skin, skinManager, spriteAnimations, stage, staticBg, staticCubes, tmpLayer, _i, _len,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = {
    debug: false,
    levelHeight: 976,
    levelWidth: 704,
    levelSpeed: 1000,
    skins: {
      body: 5,
      hair: 5,
      head: 3,
      leg: 4,
      shoes: 5,
      skin: 4,
      hat: 4,
      beard: 4
    },
    player: {
      jumpMax: 2,
      jumpHeight: 82,
      speed: 0.17,
      couchedSpeedRation: 0.5,
      fallMinAcceleration: 0.1,
      fallMaxAcceleration: 0.6,
      fallAcceleration: 1.10,
      jumpMinAcceleration: 0.2,
      jumpMaxAcceleration: 0.6,
      jumpDeceleration: 0.90,
      jumpCurrentAcceleration: 0
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
        }, {
          keys: "t",
          on_keydown: function() {
            if (!game.writting) {
              if (player !== null) {
                return player.useTp();
              }
            }
          }
        }, {
          keys: "y",
          on_keydown: function() {
            if (!game.writting) {
              if (player !== null) {
                return player.useJumpBlock();
              }
            }
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
      var frameTime, thisFrame;
      this.stats.begin();
      thisFrame = Date.now();
      frameTime = thisFrame - this.lastFrame;
      animFrame(Game.prototype.loop.bind(this));
      this.lastFrame = thisFrame;
      game.update(frameTime);
      return this.stats.end();
    };

    Game.prototype.update = function(frameTime) {};

    Game.prototype.draw = function() {};

    Game.prototype.start = function() {
      document.querySelector('#login').style.display = 'none';
      document.querySelector('#container').style.display = 'block';
      document.querySelector('#container').style.bottom = 0;
      document.querySelector('#container').style.position = 'absolute';
      this.lastFrame = Date.now();
      this.resize();
      return this.loop();
    };

    Game.prototype.resize = function() {
      document.querySelector('#container').style.left = (window.innerWidth / 2 - config.levelWidth / 2) + 'px';
      return document.querySelector('#container').style.width = config.levelWidth;
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
        url: '../assets/bg_grasslands.png'
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
        type: 'music',
        title: 'Rolemusic - Savage Steel Fun Club'
      });
      contentLoader.loadSound({
        name: 'music2',
        url: '../assets/sounds/music/music2.ogg',
        type: 'music',
        title: 'Rolemusic - L3GO'
      });
      contentLoader.loadSound({
        name: 'music3',
        url: '../assets/sounds/music/music3.ogg',
        type: 'music',
        title: 'Rolemusic - Another beek beep beer please'
      });
      contentLoader.loadSound({
        name: 'music4',
        url: '../assets/sounds/music/music4.ogg',
        type: 'music',
        title: 'VVVVVV - Predestined Fate'
      });
      contentLoader.loadSound({
        name: 'music5',
        url: '../assets/sounds/music/music5.ogg',
        type: 'music',
        title: 'VVVVVV - Positive Force'
      });
      return contentLoader.load();
    };

    Game.prototype.chat = function() {
      if (document.activeElement.id === 'chatMessage') {
        this.writting = false;
        if (document.activeElement.value !== void 0 && document.activeElement.value.trim() !== '') {
          networkManager.sendMessage(document.getElementById('chatMessage').value);
          if (document.getElementById('chatMessage').value[0] !== '/') {
            this.addMessage(-1, document.getElementById('chatMessage').value);
          }
        }
        document.getElementById('chatMessage').blur();
        document.getElementById('chatMessage').value = null;
        return this.openHist(3000);
      } else {
        this.writting = true;
        this.openHist(100000);
        return document.getElementById('chatMessage').focus();
      }
    };

    Game.prototype.addMessage = function(id, message) {
      var name, timeout;
      contentLoader.play('beep');
      if (id === null) {
        name = 'Server';
      } else if (id === -1) {
        name = 'You';
      } else {
        name = networkManager.players[id].name.getText();
      }
      this.chatHist.push([name, message]);
      if (this.chatHist.length > this.chatHistLen) {
        this.chatHist.shift();
      }
      this.composeHistoric();
      if (id !== -1) {
        timeout = 5000 + message.length * 30;
        return this.openHist(timeout);
      }
    };

    Game.prototype.composeHistoric = function() {
      var hist, i, message, name, type, _i, _len, _ref, _results;
      document.getElementById('chatHistoric').innerHTML = "";
      _ref = this.chatHist;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        hist = _ref[i];
        name = this.escapeHtml(hist[0]);
        if (name === 'Server') {
          type = 'server';
        } else if (name === 'You') {
          type = 'you';
        } else {
          type = 'other';
        }
        message = this.escapeHtml(hist[1]);
        _results.push(document.getElementById('chatHistoric').innerHTML += '<div class="message ' + type + '"><span class="from">' + name + ':</span><span class="content">' + message + '</span></div>');
      }
      return _results;
    };

    Game.prototype.escapeHtml = function(str) {
      var entityMap;
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      };
      return str.replace(/[&<>"'\/]/g, function(s) {
        return entityMap[s];
      });
    };

    Game.prototype.openHist = function(time) {
      if (this.closeTime !== void 0) {
        clearInterval(this.closeTime);
      }
      this.closeTime = setTimeout(this.closeHist, time);
      return document.querySelector('#chatHistoric').style.display = 'block';
    };

    Game.prototype.closeHist = function() {
      return document.querySelector('#chatHistoric').style.display = 'none';
    };

    Game.prototype.config = function() {
      document.querySelector('#login-loading').style.display = 'none';
      return document.querySelector('#config').style.display = 'block';
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
          return self.updateLoader(this.src);
        };
      }
      _ref1 = this.soundsToLoad;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        sound = _ref1[_j];
        audioObj = new Audio();
        audioObj.src = sound.url;
        audioObj.volume = 0.1;
        if (sound.title !== void 0) {
          audioObj.title = sound.title;
        }
        this.sounds[sound.name] = audioObj;
        audioObj.oncanplaythrough = function() {
          return self.updateLoader(this.src);
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

    ContentLoader.prototype.updateLoader = function(name) {
      var file, tmp;
      if (this.count < this.total) {
        this.count++;
        tmp = name.split('/');
        file = tmp[tmp.length - 1];
        document.querySelector('#login-loading').innerHTML = 'Loading ... <br> ' + file + '<br>' + Math.round((this.count / this.total) * 100) + '%';
        if (this.count === this.total) {
          this.contentsLoaded();
          return document.querySelector('#login-loading').innerHTML = '';
        }
      }
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
      this.sounds[sound].play();
      return document.querySelector('#current-music').innerHTML = this.sounds[sound].title;
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

    ContentLoader.prototype.setEffectVolume = function(vol) {
      var sound, _i, _len, _ref;
      _ref = this.soundsToLoad;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'effect') {
          this.sounds[sound.name].volume = vol / 100;
        }
      }
      return document.querySelector('#sound-effect').innerHTML = localStorage.getItem('volume_effect') || 10;
    };

    ContentLoader.prototype.setMusicVolume = function(vol) {
      var sound, _i, _len, _ref;
      _ref = this.soundsToLoad;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sound = _ref[_i];
        if (sound.type === 'music') {
          this.sounds[sound.name].volume = vol / 100;
        }
      }
      return document.querySelector('#sound-music').innerHTML = localStorage.getItem('volume_music') || 10;
    };

    ContentLoader.prototype.setBG = function(color) {
      if (color === "White") {
        document.querySelector('body').style.background = "White";
        document.querySelector('#sound-controller').style.color = "Black";
        return document.querySelector('#color-switch a').innerHTML = "White";
      } else {
        document.querySelector('body').style.background = "Black";
        document.querySelector('#sound-controller').style.color = "White";
        return document.querySelector('#color-switch a').innerHTML = "Black";
      }
    };

    ContentLoader.prototype.changeBG = function() {
      var color;
      color = document.querySelector('#color-switch a').innerHTML;
      if (color === "White") {
        document.querySelector('body').style.background = "Black";
        document.querySelector('#sound-controller').style.color = "White";
        return document.querySelector('#color-switch a').innerHTML = "Black";
      } else {
        document.querySelector('body').style.background = "White";
        document.querySelector('#sound-controller').style.color = "Black";
        return document.querySelector('#color-switch a').innerHTML = "White";
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
        if (this.pointInCube(player, {
          x: cube.getX() + 16,
          y: cube.getY() + 80
        })) {
          return false;
        }
      } else {
        if (this.pointInCube(player, {
          x: cube.getX() - 16,
          y: cube.getY() + 80
        })) {
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
        if (shape._id !== cube._id && cube.getName() !== void 0 && cube.getName() !== null && cube.getName().type === 'cube' && !cube.getName().falling) {
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
          if (skin !== void 0 && plr.getName() === 'otherPlayer' && skin.getAnimation() === 'couch') {
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

    CollisionManager.prototype.pointInCube = function(shape, point) {
      return point[0] >= shape.getX() && point[0] < shape.getX() + shape.getWidth() && point[1] >= shape.getY() && point[1] < shape.getY() + shape.getHeight();
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
      this.height = 62;
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
        height: 62
      });
      players.add(this.shape);
      this.skin = new Sprite(0, 0, SquareEnum.SMALL, 'playerSpirteSheet', 'fall').shape;
      players.add(this.skin);
      this.skin.start();
      return this.spawn();
    };

    Player.prototype.spawn = function() {
      this.shape.setX(336);
      this.shape.setY(stage.getY() * -1 - 224);
      return this.shape.setHeight(this.height);
    };

    Player.prototype.reset = function() {
      this.spawn();
      return bonusManager.resetBonuses();
    };

    Player.prototype.resurection = function() {
      if (!this.alive) {
        return this.reset();
      }
    };

    Player.prototype.fixSkinPos = function() {
      if (this.skin.getScale().x === -1) {
        this.skin.setX(this.shape.getX() - 12 + 48);
      } else {
        this.skin.setX(this.shape.getX() - 12);
      }
      if (this.skin.getAnimation() === 'couch' || this.skin.getAnimation() === 'couchMove') {
        return this.skin.setY(this.shape.getY() - 34);
      } else {
        return this.skin.setY(this.shape.getY() - 2);
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
        this.skin.setScale({
          x: -1,
          y: 1
        });
        return this.skin.setX(this.skin.getX() + 48);
      } else if (side === 1) {
        this.skin.setScale({
          x: 1,
          y: 1
        });
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
      this.initStats();
    }

    ControllablePlayer.prototype.initStats = function() {
      this.speed = config.player.speed + bonusManager.findBonus('speedBonus').value * bonusManager.playerBonuses.speedBonus;
      this.jumpHeight = config.player.jumpHeight + bonusManager.findBonus('jumpHeightBonus').value * bonusManager.playerBonuses.jumpHeightBonus;
      this.jumpMax = config.player.jumpMax;
      this.couchedSpeedRatio = config.player.couchedSpeedRation;
      this.fallMinAcceleration = config.player.fallMinAcceleration;
      this.fallMaxAcceleration = config.player.fallMaxAcceleration;
      this.fallAcceleration = config.player.fallAcceleration;
      this.jumpMinAcceleration = config.player.jumpMinAcceleration;
      this.jumpMaxAcceleration = config.player.jumpMaxAcceleration;
      this.jumpDeceleration = config.player.jumpDeceleration;
      this.jumpCurrentAcceleration = config.player.jumpCurrentAcceleration;
      this.fallCurrentAcceleration = this.fallMinAcceleration;
      this.actualCollisions = [];
      this.cached = {};
      return this.reinitStats();
    };

    ControllablePlayer.prototype.reinitStats = function() {
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
      this.forceJump = false;
      return this.setInvulnerable();
    };

    ControllablePlayer.prototype.reset = function() {
      bonusManager.resetBonuses();
      this.spawn();
      this.initStats();
      return networkManager.sendRez();
    };

    ControllablePlayer.prototype.resurect = function() {
      this.spawn();
      this.reinitStats();
      return networkManager.sendRez();
    };

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
          if (keyboard.keys.up || this.forceJump) {
            this.doJump(frameTime);
          } else {
            this.stopJump();
          }
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
      this.falling = false;
      return this.setVulnerable();
    };

    ControllablePlayer.prototype.startJump = function() {
      this.canJump = false;
      if (!this.couched && this.jumpCount === 0 || (this.jumpCount < this.jumpMax && bonusManager.playerBonuses.doubleJumpBonus > 0)) {
        if (this.jumpCount > 0) {
          bonusManager.playerBonuses.doubleJumpBonus--;
        }
        if (collisionManager.getPlayerCollision()) {
          this.coopJump = true;
          this.setTempJumpHeight(this.jumpHeight + 40);
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
      if (this.stomped || this.coopJump || this.forceJump) {
        this.forceJump = false;
        return this.reinitJump();
      }
    };

    ControllablePlayer.prototype.reinitJump = function() {
      this.jumpHeight = this.oldStats.jumpHeight;
      this.jumpMaxAcceleration = this.oldStats.jumpMaxAcceleration;
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
      if (bonusManager.getBonus(bonus.getName().name)) {
        bonus.destroy();
        return networkManager.sendBonusTaken(bonus.getId());
      }
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

    ControllablePlayer.prototype.collideBoss = function() {
      return this.kill();
    };

    ControllablePlayer.prototype.collideEffect = function(effect) {
      if (effect.getName().name === 'ice') {
        this.sliding = true;
      }
      if (effect.getName().name === 'slow') {
        this.slowed = true;
      }
      if (effect.getName().name === 'jumpBlock' && this.falling && !this.jump) {
        this.setTempJumpHeight(256);
        this.jumpStart = player.shape.getY();
        this.jumpCount = player.jumpMax;
        this.stomped = true;
        this.jump = true;
        return this.forceJump = true;
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
        } else if (bonusManager.playerBonuses.grabbingBonus > 0) {
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
        bonusManager.playerBonuses.grabbingBonus--;
        return this.grabbed = false;
      }
    };

    ControllablePlayer.prototype.kill = function() {
      if (!this.invulnerable && this.alive) {
        this.alive = false;
        contentLoader.play('death');
        new Effect(this.shape.getX() - 16, this.shape.getY(), SquareEnum.SMALL, 'blood', true);
        networkManager.sendDie();
        if (bonusManager.playerBonuses.autoRezBonus > 0) {
          bonusManager.playerBonuses.autoRezBonus--;
          return this.resurect();
        } else {
          this.lootBonus();
          return bonusManager.resetBonuses();
        }
      }
    };

    ControllablePlayer.prototype.lootBonus = function() {
      var id;
      id = bonusManager.getRandomBonus();
      if (id !== void 0) {
        return networkManager.sendLootBonus(Math.round(this.shape.getX() / 32) * 32, Math.floor((this.shape.getY() + this.shape.getHeight()) / 32) * 32 - 32, id);
      }
    };

    ControllablePlayer.prototype.addJumpHeight = function(height) {
      this.jumpHeight += height;
      return this.jumpMaxAcceleration += height / 200;
    };

    ControllablePlayer.prototype.setTempJumpHeight = function(height) {
      this.oldStats = {
        jumpHeight: this.jumpHeight,
        jumpMaxAcceleration: this.jumpMaxAcceleration
      };
      this.jumpHeight = height;
      this.jumpMaxAcceleration = height / 200;
      return this.jumpCurrentAcceleration = this.jumpMaxAcceleration;
    };

    ControllablePlayer.prototype.useTp = function() {
      if (bonusManager.playerBonuses.tpBonus > 0) {
        bonusManager.playerBonuses.tpBonus--;
        networkManager.sendTp();
        return new Effect(this.shape.getX() - 24, this.shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      }
    };

    ControllablePlayer.prototype.useJumpBlock = function() {
      if (bonusManager.playerBonuses.jumpBlockBonus > 0) {
        bonusManager.playerBonuses.jumpBlockBonus--;
        return networkManager.sendJumpBlock(Math.round(this.shape.getX() / 32) * 32, Math.floor((this.shape.getY() + this.shape.getHeight()) / 32) * 32 - 32);
      }
    };

    ControllablePlayer.prototype.setInvulnerable = function() {
      this.invulnerable = true;
      return this.skin.setOpacity(0.75);
    };

    ControllablePlayer.prototype.setVulnerable = function() {
      this.invulnerable = false;
      return this.skin.setOpacity(1);
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
    },
    EFFECT: {
      x: 32,
      y: 12
    },
    HALF_SMALL: {
      x: 32,
      y: 16
    }
  };

  spriteAnimations = {
    idle: [288, 0, 48, 64],
    jump: [336, 0, 48, 64],
    fall: [384, 0, 48, 64],
    run: [0, 0, 48, 64, 48, 0, 48, 64, 96, 0, 48, 64, 144, 0, 48, 64, 192, 0, 48, 64, 240, 0, 48, 64],
    couch: [0, 64, 48, 64],
    couchMove: [48, 64, 48, 64, 96, 64, 48, 64, 144, 64, 48, 64, 192, 64, 48, 64, 240, 64, 48, 64],
    grabbing: [0, 128, 48, 64],
    dead: [288, 64, 48, 64],
    '32-32': [192, 96, 32, 32],
    '64-64': [128, 64, 64, 64],
    '128-128': [0, 0, 128, 128],
    '64-32': [192, 64, 64, 32],
    '128-64': [128, 0, 128, 64],
    '32-128': [256, 0, 32, 128],
    brokenCube: [224, 96, 32, 32],
    iceExplosion: [0, 0, 64, 64],
    explosion: [64, 0, 64, 64],
    ice: [0, 0, 32, 12],
    stompblock: [128, 0, 64, 64],
    swapblock: [128, 64, 64, 64],
    tpblock: [64, 64, 64, 64],
    randblock: [0, 128, 64, 64],
    randomEvent: [64, 128, 64, 64],
    slowblock: [0, 64, 64, 64],
    jumpBlock: [64, 0, 32, 32],
    blood: [160, 0, 64, 64, 224, 0, 64, 64, 288, 0, 64, 64, 352, 0, 64, 64, 416, 0, 64, 64, 480, 0, 64, 64],
    explosionEffect: [0, 32, 160, 128, 160, 32, 160, 128, 320, 32, 160, 128, 480, 32, 160, 128, 0, 160, 160, 128, 160, 160, 160, 128, 320, 160, 160, 128, 480, 160, 160, 128, 0, 288, 160, 128, 160, 288, 160, 128],
    iceExplosionEffect: [0, 416, 160, 128, 160, 416, 160, 128, 320, 416, 160, 128, 480, 416, 160, 128, 0, 544, 160, 128, 160, 544, 160, 128, 320, 544, 160, 128, 480, 544, 160, 128, 0, 672, 160, 128, 160, 672, 160, 128],
    slow: [32, 0, 32, 12],
    bioExplosion: [0, 834, 128, 128, 128, 834, 128, 128, 256, 834, 128, 128, 384, 834, 128, 128, 512, 834, 128, 128, 640, 834, 128, 128],
    missileEffect: [0, 32, 32, 32, 32, 32, 32, 32, 64, 32, 32, 32],
    smallExplosionEffect: [0, 960, 64, 64, 64, 960, 64, 64, 128, 960, 64, 64, 192, 960, 64, 64, 0, 1024, 64, 64, 64, 1024, 64, 64, 128, 1024, 64, 64, 192, 1024, 64, 64, 0, 1088, 64, 64, 64, 1088, 64, 64],
    speedBonus: [64, 32, 32, 32],
    jumpHeightBonus: [32, 32, 32, 32],
    doubleJumpBonus: [0, 64, 32, 32],
    grabbingBonus: [0, 0, 32, 32],
    resurectionBonus: [96, 0, 32, 32],
    autoRezBonus: [96, 32, 32, 32],
    tpBonus: [64, 0, 32, 32],
    jumpBlockBonus: [0, 32, 32, 32],
    tp: [32, 0, 32, 32],
    roueman: [0, 0, 64, 64, 64, 0, 64, 64],
    freezeman: [0, 65, 544, 30],
    poingman: [192, 0, 64, 64],
    labiman: [128, 0, 64, 64],
    sparkman: [0, 96, 64, 64, 64, 96, 64, 64, 128, 96, 64, 64, 192, 96, 64, 64],
    spark: [0, 160, 32, 32, 32, 160, 32, 32, 64, 160, 32, 32, 96, 160, 32, 32],
    homingman: [256, 0, 64, 64],
    missileman: [320, 0, 32, 64],
    phantom: [128, 160, 32, 32],
    fly: [0, 0, 32, 32, 32, 0, 32, 32, 64, 0, 32, 32]
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
        index: 0
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

  SpecialCubes = ['iceExplosion', 'slowblock', 'stompblock', 'swapblock', 'tpblock', 'randblock'];

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
      var event;
      contentLoader.play('explosion');
      event = this.shape.getName().randType;
      if (event === 'resurection') {
        player.resurection();
        new Effect(this.shape.getX(), this.shape.getY(), SquareEnum.SMALL, 'resurectionBonus', null, true);
      } else if (event === 'bonuses') {
        new Effect(this.shape.getX(), this.shape.getY(), SquareEnum.SMALL, 'speedBonus', null, true);
      } else if (event === 'tp') {
        player.shape.setX(this.shape.getX() + 16);
        player.shape.setY(this.shape.getY() - 448);
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
    }, {
      id: 6,
      name: 'autoRezBonus'
    }, {
      id: 7,
      name: 'tpBonus'
    }, {
      id: 8,
      name: 'jumpBlockBonus'
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
          value: 0.03,
          max: 3
        }, {
          name: 'jumpHeightBonus',
          attribute: 'jumpHeight',
          value: 18,
          max: 3
        }, {
          name: 'autoRezBonus',
          attribute: 'rezBonus',
          value: 1,
          max: 1
        }, {
          name: 'tpBonus',
          attribute: 'tpBonus',
          value: 1,
          max: 2
        }, {
          name: 'jumpBlockBonus',
          attribute: 'jumpBlockBonus',
          value: 1,
          max: 1
        }
      ];
      this.playerBonuses = {};
      this.resetBonuses();
    }

    BonusManager.prototype.resetBonuses = function() {
      return this.playerBonuses = {
        jumpHeightBonus: 0,
        speedBonus: 0,
        autoRezBonus: 0,
        tpBonus: 0,
        jumpBlockBonus: 0,
        doubleJumpBonus: 0,
        grabbingBonus: 0
      };
    };

    BonusManager.prototype.getBonus = function(bonusName) {
      var bonus;
      bonus = this.findBonus(bonusName);
      if (this.canTake(bonus)) {
        contentLoader.play('pickup');
        this.addBonus(bonus);
        return true;
      } else {
        return false;
      }
    };

    BonusManager.prototype.canTake = function(bonus) {
      if (bonus.max !== void 0) {
        switch (bonus.attribute) {
          case "speed":
            return this.playerBonuses.speedBonus < bonus.max;
          case "jumpHeight":
            return this.playerBonuses.jumpHeightBonus < bonus.max;
          case "rezBonus":
            return this.playerBonuses.autoRezBonus < bonus.max;
          case "tpBonus":
            return this.playerBonuses.tpBonus < bonus.max;
          case "jumpBlockBonus":
            return this.playerBonuses.jumpBlockBonus < bonus.max;
          default:
            return false;
        }
      } else {
        return true;
      }
    };

    BonusManager.prototype.findBonus = function(bonusName) {
      var bonus, _i, _len, _ref;
      _ref = this.bonuses;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bonus = _ref[_i];
        if (bonusName === bonus.name) {
          return bonus;
        }
      }
    };

    BonusManager.prototype.addBonus = function(bonus) {
      switch (bonus.attribute) {
        case "speed":
          player.speed += bonus.value;
          return this.playerBonuses.speedBonus++;
        case "jumpHeight":
          player.addJumpHeight(bonus.value);
          return this.playerBonuses.jumpHeightBonus++;
        case "jumpCount":
          return this.playerBonuses.doubleJumpBonus += bonus.value;
        case "grab":
          return this.playerBonuses.grabbingBonus += bonus.value;
        case "resurection":
          networkManager.sendResurection();
          return player.resurection();
        case "rezBonus":
          return this.playerBonuses.autoRezBonus++;
        case "tpBonus":
          return this.playerBonuses.tpBonus++;
        case "jumpBlockBonus":
          return this.playerBonuses.jumpBlockBonus++;
      }
    };

    BonusManager.prototype.remove = function(id) {
      var bonus;
      bonus = dynamicEntities.find('#' + id);
      return bonus.destroy();
    };

    BonusManager.prototype.getRandomBonus = function() {
      var bonuses;
      bonuses = [];
      if (bonusManager.playerBonuses.speedBonus > 0) {
        bonuses.push(1);
      }
      if (bonusManager.playerBonuses.jumpHeightBonus > 0) {
        bonuses.push(2);
      }
      if (player.availableDoubleJump > 0) {
        bonuses.push(3);
      }
      if (player.availableGrab > 0) {
        bonuses.push(4);
      }
      if (bonusManager.playerBonuses.autoRezBonus > 0) {
        bonuses.push(6);
      }
      if (bonusManager.playerBonuses.tpBonus > 0) {
        bonuses.push(7);
      }
      if (bonusManager.playerBonuses.jumpBlockBonus > 0) {
        bonuses.push(8);
      }
      return bonuses[Math.floor(Math.random() * (bonuses.length - 1))];
    };

    return BonusManager;

  })();

  LevelManager = (function() {
    function LevelManager() {
      this.tweens = [];
      this.level = 0;
      this.levelHeight = 0;
      this.ground = stage.getHeight() - 32;
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
      return this.ground = stage.getHeight() - 32;
    };

    LevelManager.prototype.moveLevel = function(height) {
      var twin;
      arena.add(height / 32);
      this.levelHeight += height;
      this.ground = arena.y - this.levelHeight;
      twin = new Kinetic.Tween({
        node: stage,
        duration: 2,
        y: stage.getY() + height,
        onFinish: function() {
          return networkManager.sendMoveLevelOk();
        }
      });
      twin.play();
      this.tweens.push(twin);
      twin = new Kinetic.Tween({
        node: staticBg,
        duration: 2,
        y: staticBg.getY() - height
      });
      twin.play();
      this.tweens.push(twin);
      twin = new Kinetic.Tween({
        node: hudLayer,
        duration: 2,
        y: hudLayer.getY() - height
      });
      twin.play();
      this.tweens.push(twin);
      twin = new Kinetic.Tween({
        node: staticCubes,
        duration: 2,
        y: staticCubes.y()
      });
      twin.play();
      return this.tweens.push(twin);
    };

    LevelManager.prototype.clearLevel = function() {
      var cubes;
      bossManager.reset();
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        if (cube.getY() > stage.getY() * -1 + stage.getHeight() || (cube.getName().type !== 'cube' && cube.getY() > stage.getY() * -1 + stage.getHeight() - 32)) {
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
            obj.falling = false;
            cube.setName(obj);
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

    CubeManager.prototype.convertToCube = function(shape) {
      var obj;
      obj = shape.getName();
      obj.type = 'cube';
      return shape.setName(obj);
    };

    CubeManager.prototype.doEffect = function(shape, type) {
      if (type === 'iceExplosion') {
        this.iceExplosionEffect(shape);
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

    CubeManager.prototype.iceExplosionEffect = function(shape) {
      new Effect(shape.getX(), shape.getY() - 2, SquareEnum.EFFECT, 'ice');
      new Effect(shape.getX() + 32, shape.getY() - 2, SquareEnum.EFFECT, 'ice');
      return this.convertToCube(shape);
    };

    CubeManager.prototype.slowExplosionEffet = function(shape) {
      new Effect(shape.getX(), shape.getY() - 2, SquareEnum.EFFECT, 'slow');
      new Effect(shape.getX() + 32, shape.getY() - 2, SquareEnum.EFFECT, 'slow');
      return this.convertToCube(shape);
    };

    CubeManager.prototype.stompEffet = function(shape) {
      contentLoader.play('explosion');
      new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      if (!player.jump && !player.falling) {
        player.setTempJumpHeight(300);
        player.jumpStart = player.shape.getY();
        player.jumpCount = player.jumpMax;
        player.stomped = true;
        player.jump = true;
        player.forceJump = true;
      }
      return this.convertToCube(shape);
    };

    CubeManager.prototype.swapEffet = function(shape) {
      var positions, rand;
      contentLoader.play('explosion');
      new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      positions = [];
      players.find('Rect').each(function(plr) {
        var couched, skin;
        if (plr._id !== player.shape._id) {
          skin = players.find('#skin-' + plr.getId())[0];
          if (skin.getAnimation() !== 'dead') {
            couched = false;
            if (skin.getAnimation() === 'couch' || skin.getAnimation() === 'couchMove') {
              couched = true;
            }
            return positions.push({
              x: plr.getX(),
              y: plr.getY(),
              couched: couched
            });
          }
        }
      });
      if (positions.length > 0) {
        rand = Math.floor(Math.random() * positions.length);
        player.shape.setX(positions[rand].x);
        player.shape.setY(positions[rand].y);
        player.grabbing = false;
        if (positions[rand].couched) {
          player.startCouch();
        }
        player.jump = false;
      }
      return this.convertToCube(shape);
    };

    CubeManager.prototype.tpEffet = function(shape) {
      contentLoader.play('explosion');
      new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true);
      player.shape.setX(shape.getX() + 16);
      player.shape.setY(shape.getY() - 64);
      player.jump = false;
      return this.convertToCube(shape);
    };

    CubeManager.prototype.sendJumpBlock = function(x, y) {
      var obj;
      this.tmp = new Effect(x + 6, y, SquareEnum.BONUS, 'jumpBlock');
      obj = this.tmp.shape.getName();
      obj.falling = true;
      this.tmp.shape.setName(obj);
      this.tmp.shape.setOffsetX(6);
      return this.tmp.shape.setOffsetY(12);
    };

    CubeManager.prototype.sendLootBonus = function(x, y, id) {
      this.tmp = new Bonus(0, id, x + y);
      this.tmp.shape.setX(x + 6);
      return this.tmp.shape.setY(y);
    };

    return CubeManager;

  })();

  NetworkManager = (function() {
    function NetworkManager() {
      this.players = [];
      this.playersId = [];
    }

    NetworkManager.prototype.connect = function(ip, name, skin) {
      this.socket = io.connect('ws://' + ip);
      this.socket.emit('login', [name, skin]);
      return this.listener();
    };

    NetworkManager.prototype.listener = function() {
      var self;
      self = this;
      this.socket.on('connect', function() {
        return document.querySelector('#login-loading').innerHTML = 'Connected ! Waiting for the server to join...';
      });
      this.socket.on('join', function() {
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
        return new SpecialCube(data[0], data[1], 5, data[2]);
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
        if (self.players[id] !== void 0) {
          return self.players[id].destroy();
        }
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
        if (self.players[id] !== void 0) {
          return self.players[id].kill();
        }
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
              self.players[id].destroy();
            }
            _results.push(self.playersId.splice(i, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      this.socket.on('message', function(arr) {
        return game.addMessage(arr[0], arr[1]);
      });
      this.socket.on('tpBonus', function(id) {
        var vPlayer;
        if (self.players[id] !== void 0) {
          vPlayer = self.players[id];
          if (vPlayer.shape.getY() + 64 < player.shape.getY()) {
            player.shape.setX(vPlayer.shape.getX());
            player.shape.setY(vPlayer.shape.getY());
            player.grabbing = false;
            if (vPlayer.skin.getAnimation() === 'couch' || vPlayer.skin.getAnimation() === 'couchMove') {
              player.startCouch();
            }
            player.jump = false;
            return new Effect(vPlayer.shape.getX() - 24, vPlayer.shape.getY(), SquareEnum.SMALL, 'tp', null, true);
          }
        }
      });
      this.socket.on('sendJumpBlock', function(coords) {
        return cubeManager.sendJumpBlock(coords[0], coords[1]);
      });
      this.socket.on('sendLootBonus', function(coords) {
        return cubeManager.sendLootBonus(coords[0], coords[1], coords[2]);
      });
      return this.socket.on('sendDeployedJumpBonus', function(col) {
        var x, y;
        x = col * 32 + 160;
        y = stage.getY() * -1;
        return cubeManager.sendJumpBlock(x, y);
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

    NetworkManager.prototype.sendRez = function() {
      return this.socket.emit('rez');
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

    NetworkManager.prototype.sendTp = function() {
      return this.socket.emit('tpBonus');
    };

    NetworkManager.prototype.sendJumpBlock = function(x, y) {
      cubeManager.sendJumpBlock(x, y);
      return this.socket.emit('sendJumpBlock', [x, y]);
    };

    NetworkManager.prototype.sendLootBonus = function(x, y, id) {
      cubeManager.sendLootBonus(x, y, id);
      return this.socket.emit('sendLootBonus', [x, y, id]);
    };

    return NetworkManager;

  })();

  SkinManager = (function() {
    function SkinManager() {
      this.parts = ['skin', 'leg', 'hair', 'head', 'beard', 'body', 'shoes', 'hat'];
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

    SkinManager.prototype.randomizeSkin = function() {
      var elm, part, value, _i, _len, _ref, _results;
      _ref = this.parts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        value = Math.floor(Math.random() * config.skins[part]) + 1;
        elm = document.querySelector('#skin-preview .' + part);
        elm.style.background = 'url("assets/player/' + part + '/' + value + '.png") 140px 0';
        skin[part] = value;
        _results.push(document.querySelector('#skin-control .' + part + ' .number').innerHTML = value);
      }
      return _results;
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
      localStorage.setItem('player_shoes', skinManager.getSkin('shoes'));
      localStorage.setItem('player_hat', skinManager.getSkin('hat'));
      localStorage.setItem('player_beard', skinManager.getSkin('beard'));
      localStorage.setItem('volume_effect', document.querySelector('#sound-effect').innerHTML);
      localStorage.setItem('volume_music', document.querySelector('#sound-music').innerHTML);
      return localStorage.setItem('bg_color', document.querySelector('#color-switch a').innerHTML);
    };

    SaveManager.prototype.loadOptions = function() {
      document.querySelector('#name').value = localStorage.getItem('player_name');
      skinManager.setSkin('skin', localStorage.getItem('player_skin') || 1);
      skinManager.setSkin('hair', localStorage.getItem('player_hair') || 1);
      skinManager.setSkin('head', localStorage.getItem('player_head') || 1);
      skinManager.setSkin('body', localStorage.getItem('player_body') || 1);
      skinManager.setSkin('leg', localStorage.getItem('player_leg') || 1);
      skinManager.setSkin('shoes', localStorage.getItem('player_shoes') || 1);
      skinManager.setSkin('hat', localStorage.getItem('player_hat') || 1);
      skinManager.setSkin('beard', localStorage.getItem('player_beard') || 1);
      contentLoader.setEffectVolume(localStorage.getItem('volume_effect') || 10);
      contentLoader.setMusicVolume(localStorage.getItem('volume_music') || 10);
      return contentLoader.setBG(localStorage.getItem('bg_color') || "White");
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
      this.hud = {
        left: [{}],
        right: [
          {
            icon: 'jumpHeightBonus'
          }, {
            icon: 'speedBonus'
          }, {
            icon: 'autoRezBonus'
          }, {
            icon: 'tpBonus'
          }, {
            icon: 'doubleJumpBonus'
          }, {
            icon: 'grabbingBonus'
          }, {
            icon: 'jumpBlockBonus'
          }
        ]
      };
      this.elements = {
        left: [],
        right: []
      };
      this.drawHUD();
    }

    HUD.prototype.update = function(frameTime) {
      var elm, hud, i, _i, _j, _len, _len1, _ref, _ref1;
      hud = {
        left: [
          {
            text: 'Level : ' + levelManager.level
          }
        ],
        right: [
          {
            text: bonusManager.playerBonuses.jumpHeightBonus + '/' + bonusManager.bonuses[4].max
          }, {
            text: bonusManager.playerBonuses.speedBonus + '/' + bonusManager.bonuses[3].max
          }, {
            text: bonusManager.playerBonuses.autoRezBonus + '/' + bonusManager.bonuses[5].max
          }, {
            text: bonusManager.playerBonuses.tpBonus + '/' + bonusManager.bonuses[6].max + ' (T)'
          }, {
            text: bonusManager.playerBonuses.doubleJumpBonus
          }, {
            text: bonusManager.playerBonuses.grabbingBonus
          }, {
            text: bonusManager.playerBonuses.jumpBlockBonus + '/' + bonusManager.bonuses[7].max + ' (Y)'
          }
        ]
      };
      _ref = hud.left;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        elm = _ref[i];
        this.elements.left[i].setText(elm.text);
      }
      _ref1 = hud.right;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        elm = _ref1[i];
        this.elements.right[i].setText(elm.text);
      }
      return hudLayer.draw();
    };

    HUD.prototype.drawHUD = function() {
      var elm, i, icon, tmp, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.hud.left;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        elm = _ref[i];
        tmp = new Kinetic.Text({
          y: arena.y - this.elements.left.length * 32,
          fill: 'black',
          fontFamily: 'Calibri',
          fontSize: 18
        });
        hudLayer.add(tmp);
        this.elements.left[i] = tmp;
      }
      _ref1 = this.hud.right;
      _results = [];
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        elm = _ref1[i];
        if (elm.icon !== void 0) {
          icon = new Sprite(stage.getWidth() - 128 + 16, arena.y - this.elements.right.length * 36, SquareEnum.SMALL, 'bonus', elm.icon);
          icon = icon.shape;
          hudLayer.add(icon);
          tmp = new Kinetic.Text({
            y: arena.y - this.elements.right.length * 36 + 10,
            x: stage.getWidth() - 128 + 64,
            fill: 'black',
            fontFamily: 'Calibri',
            fontSize: 18
          });
          hudLayer.add(tmp);
          _results.push(this.elements.right[i] = tmp);
        } else {
          tmp = new Kinetic.Text({
            y: arena.y - this.elements.right.length * 36,
            x: stage.getWidth() - 128,
            fill: 'black',
            fontFamily: 'Calibri',
            fontSize: 18
          });
          hudLayer.add(tmp);
          _results.push(this.elements.right[i] = tmp);
        }
      }
      return _results;
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
          len = (this.shape.getAnimations()[this.shape.getAnimation()].length / 4) - 1;
          this.shape.on('frameIndexChange', function() {
            if (self.shape.frameIndex() === len) {
              return self.shape.destroy();
            }
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
      this.destroyGround();
      this.regenMap();
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

    PoingMan.prototype.destroyGround = function() {
      var cubes;
      cubes = dynamicEntities.find('Sprite');
      cubes.each(function(cube) {
        if (cube.getName().type !== 'boss') {
          return cube.destroy();
        }
      });
      cubes = staticCubes.find('Sprite');
      return cubes.each(function(cube) {
        if (cube.getX() > 128 && cube.getX() < 544) {
          return cube.destroy();
        }
      });
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
      this.parts.push(new SparkManPart(this.shape.getX() + 16, this.shape.getY() + 64, this.attacks[this.attackIndex]));
      this.parts.push(new SparkManPart(this.shape.getX() + 16, this.shape.getY() + 64, this.attacks[this.attackIndex + 1]));
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
        if (collisions.mX) {
          part.sideX = 1;
        }
        if (collisions.pX) {
          part.sideX = -1;
        }
        if (collisions.mY) {
          part.sideY = 1;
        }
        if (collisions.pY) {
          part.sideY = -1;
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
      SparkManPart.__super__.constructor.call(this, 'spark', x, y, 32, 32);
      this.sideX = attack[0];
      this.sideY = attack[1];
      this.ySpeed = attack[2];
      this.life = 0;
      this.alive = true;
    }

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
      this.attacks = pattern[1];
      this.inPosition = 0;
      this.attackCount = 1;
      this.position = levelManager.ground - 384;
      this.start();
    }

    HomingMan.prototype.start = function() {
      var self;
      self = this;
      return bossManager.update = function(frameTime) {
        if (self.move(frameTime, self.shape.getX(), self.position)) {
          self.attack();
          self.speed = self.attackSpeed;
          return bossManager.update = function(frameTime) {
            return self.updateParts(frameTime);
          };
        }
      };
    };

    HomingMan.prototype.attack = function() {
      var attack, _i, _len, _ref, _results;
      _ref = this.attacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attack = _ref[_i];
        _results.push(this.parts.push(new HomingManPart(this.shape.getX() + 16, this.shape.getY() + 64, attack)));
      }
      return _results;
    };

    HomingMan.prototype.updateParts = function(frameTime) {
      var part, pos, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.parts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        if (part.pattern[part.index] !== void 0) {
          pos = {
            x: parseInt(part.pattern[part.index][0]) * 352 + 160
          };
          if (part.index === 0) {
            pos.y = levelManager.ground - parseInt(part.pattern[0][1]) * 32;
          } else {
            pos.y = part.shape.getY();
          }
          if (part.ready && !part.position && part.move(frameTime, pos.x, pos.y)) {
            this.inPosition++;
            part.position = true;
            part.index++;
          }
        }
      }
      if (this.inPosition === 6) {
        if (this.attackCount === this.attacks[0].length) {
          return this.quitScreen(frameTime);
        } else {
          this.inPosition = 0;
          this.attackCount++;
          _ref1 = this.parts;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            part = _ref1[_j];
            part.position = false;
            part.ready = false;
            _results.push(part.wait());
          }
          return _results;
        }
      }
    };

    HomingMan.prototype.quitScreen = function(frameTime) {
      var part, _i, _len, _ref;
      _ref = this.parts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        part.move(frameTime, part.shape.getX(), part.shape.getY() + 100);
      }
      if (this.move(frameTime, 800, this.shape.getY())) {
        return this.finish();
      }
    };

    return HomingMan;

  })(MultiPartBoss);

  HomingManPart = (function(_super) {
    __extends(HomingManPart, _super);

    function HomingManPart(x, y, pattern) {
      HomingManPart.__super__.constructor.call(this, 'phantom', x, y, 32, 32);
      this.pattern = pattern;
      this.index = 0;
      this.position = false;
      this.ready = true;
    }

    HomingManPart.prototype.wait = function() {
      var fn, self;
      if (this.pattern[this.index] !== void 0) {
        self = this;
        fn = function() {
          return self.ready = true;
        };
        return setTimeout(fn, this.pattern[this.index][1]);
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

  hudLayer = new Kinetic.FastLayer({
    hitGraphEnabled: false
  });

  tmpLayer = new Kinetic.FastLayer({
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
    skin: 1,
    hat: 1,
    beard: 1
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
              y: levelManager.ground - y * 32 - 32,
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
    saveManager.loadOptions();
    contentLoader.playSong();
    launchGame = function(name) {
      var bg, pidgeon;
      bg = new Kinetic.Image({
        width: stage.getWidth(),
        height: stage.getHeight(),
        image: contentLoader.images['bg']
      });
      staticBg.add(bg);
      bg.setZIndex(-1);
      bg.draw();
      arena = new Arena();
      player = new ControllablePlayer(skin);
      hud = new HUD();
      networkManager.connect(window.location.host, name, skin);
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
        players.drawScene();
        return dynamicEntities.drawScene();
      };
    };
    return document.querySelector('#play').onclick = function() {
      var name;
      name = document.querySelector('#name').value;
      if (name) {
        document.querySelector('#login-form').style.display = 'none';
        document.querySelector('#login-loading').style.display = 'block';
        document.querySelector('#login-loading').innerHTML = 'Connecting...';
        launchGame(name);
        contentLoader.play('beep');
        return saveManager.saveOptions();
      } else {
        return alert('Name required');
      }
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

  document.querySelector('#color-switch').onclick = function() {
    return contentLoader.changeBG();
  };

  document.querySelector('#randomize').onclick = function() {
    return skinManager.randomizeSkin();
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
