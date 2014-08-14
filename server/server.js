(function() {
  var Block, Bonus, Bonuses, Boss, BossManager, CommandManager, CubeManager, Event, FreezeMan, Game, HomingMan, LabiMan, LevelManager, MissileMan, NetworkManager, PoingMan, RoueMan, SparkMan, Special, SpecialCubes, SquareEnum, bonusEvents, bossManager, commandManager, config, cubeManager, game, levelManager, nconf, networkManager, pjson, request, slowLoop, version,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = {
    debug: false,
    FPS: 60,
    lowFPS: 0.1,
    levelSpeed: 1000,
    fastLevelSpeed: 500,
    speedPerLevel: 35,
    maxLevelSpeed: 500,
    timeout: 5000,
    randomEventProb: 0.6,
    checkpoints: [4, 8, 12, 16],
    minLevel: 6,
    maxLevel: 10,
    bossDifficulty: 1,
    timeBeforeReset: 2000,
    timeBeforeStart: 2000
  };

  Game = (function() {
    function Game() {
      this.lastFrame = Date.now();
      this.running = false;
      this.players = 0;
      this.timer = 0;
      this.restartTimer = null;
    }

    Game.prototype.loop = function() {
      var frameTime, thisFrame;
      thisFrame = Date.now();
      frameTime = thisFrame - this.lastFrame;
      this.lastFrame = thisFrame;
      return this.update(frameTime);
    };

    Game.prototype.reset = function() {
      levelManager.reset();
      networkManager.joinPlayer();
      this.running = false;
      return this.restartTimer = null;
    };

    Game.prototype.restart = function() {
      levelManager.restart();
      return this.reset();
    };

    Game.prototype.launch = function() {
      levelManager.launch();
      this.running = true;
      return this.timer = config.timeBeforeStart;
    };

    Game.prototype.autoLaunch = function(frameTime) {
      if (this.players > 0) {
        if (this.timer > 0) {
          return this.timer -= frameTime;
        } else {
          return this.launch();
        }
      }
    };

    return Game;

  })();

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

  SpecialCubes = ['iceExplosion', 'slowblock', 'stompblock', 'swapblock', 'tpblock'];

  CubeManager = (function() {
    function CubeManager() {
      this.map = [];
      this.cubeMap = [];
      this.resetMap();
      this.updateRate = 0;
      this.current = 0;
      this.levelHeight = 0;
      this.running = false;
      this.waiting = false;
      this.bonusId = 0;
      this.cubes = [];
      this.types = [];
      this.initTypes();
    }

    CubeManager.prototype.initTypes = function() {
      this.addBlock(5, SquareEnum.LARGE);
      this.addBlock(20, SquareEnum.MEDIUM);
      this.addBlock(15, SquareEnum.SMALL);
      this.addBlock(10, SquareEnum.MEDIUM_RECT);
      this.addBlock(5, SquareEnum.LARGE_RECT);
      this.addBlock(5, SquareEnum.LONG_RECT);
      this.addSpecialBlock(1, SquareEnum.MEDIUM, 'iceExplosion', 0);
      this.addSpecialBlock(1, SquareEnum.MEDIUM, 'slowblock', 1);
      this.addSpecialBlock(1, SquareEnum.MEDIUM, 'stompblock', 2);
      this.addSpecialBlock(1, SquareEnum.MEDIUM, 'swapblock', 3);
      this.addSpecialBlock(1, SquareEnum.MEDIUM, 'tpblock', 4);
      this.addSpecialBlock(1, SquareEnum.MEDIUM, 'randblock', 5);
      this.addBonus(2, SquareEnum.SMALL, 'speed', 1);
      this.addBonus(2, SquareEnum.SMALL, 'jumpHeight', 2);
      this.addBonus(2, SquareEnum.SMALL, 'doubleJump', 3);
      this.addBonus(2, SquareEnum.SMALL, 'grabbing', 4);
      this.addBonus(2, SquareEnum.SMALL, 'autoRezBonus', 6);
      this.addBonus(2, SquareEnum.SMALL, 'tpBonus', 7);
      this.addBonus(2, SquareEnum.SMALL, 'jumpBlockBonus', 8);
      return this.addBonus(2, SquareEnum.SMALL, 'deployedJumpBlockBonus', 0);
    };

    CubeManager.prototype.addBlock = function(proba, size) {
      var obj;
      obj = {
        proba: proba,
        size: size,
        width: size.x / 32,
        height: size.y / 32
      };
      return this.types.push(obj);
    };

    CubeManager.prototype.addSpecialBlock = function(proba, size, name, id) {
      var obj;
      obj = {
        proba: proba,
        size: size,
        width: size.x / 32,
        height: size.y / 32,
        special: name,
        id: id
      };
      return this.types.push(obj);
    };

    CubeManager.prototype.addBonus = function(proba, size, name, id) {
      var obj;
      obj = {
        proba: proba,
        size: size,
        width: size.x / 32,
        height: size.y / 32,
        bonus: name,
        id: id
      };
      return this.types.push(obj);
    };

    CubeManager.prototype.start = function(level, rate) {
      if (!this.running && !this.waiting) {
        if (levelManager.level !== 0) {
          networkManager.sendBonus(4, 5, this.map[4], this.bonusId);
          this.bonusId++;
        }
        this.updateRate = rate;
        this.current = 0;
        this.levelHeight = level;
        this.resetCubes();
        if (config.debug) {
          return this.debug();
        } else {
          return this.running = true;
        }
      }
    };

    CubeManager.prototype.reset = function() {
      this.levelHeight = 0;
      this.stop();
      this.waiting = false;
      this.bonusId = 0;
      this.resetCubes();
      return this.resetMap();
    };

    CubeManager.prototype.resetCubes = function() {
      return this.cubes = [];
    };

    CubeManager.prototype.stop = function() {
      return this.running = false;
    };

    CubeManager.prototype.wait = function() {
      this.stop();
      this.waiting = true;
      levelManager.update();
      return this.fillMap();
    };

    CubeManager.prototype.resetMap = function() {
      var i, _i, _j, _results;
      for (i = _i = 0; _i <= 11; i = ++_i) {
        this.map[i] = 0;
      }
      _results = [];
      for (i = _j = 0; _j <= 11; i = ++_j) {
        _results.push(this.cubeMap[i] = []);
      }
      return _results;
    };

    CubeManager.prototype.sendCube = function() {
      var choice, choices, count, rand, tmp, type, typeIndex;
      choices = this.checkCols();
      if (choices.length > 0) {
        tmp = this.randomizeType(choices);
        type = tmp.type;
        typeIndex = tmp.index;
        count = choices[typeIndex].length;
        rand = Math.floor(Math.random() * count);
        choice = choices[typeIndex][rand];
        if (type.bonus !== void 0) {
          new Bonus(choice.column, choice.height, type);
        } else if (type.special !== void 0) {
          new Special(choice.column, choice.height, type);
        } else {
          new Block(choice.column, choice.height, type, true);
        }
        networkManager.sendMap(this.cubeMap);
        return true;
      } else {
        return false;
      }
    };

    CubeManager.prototype.addCubeToMap = function(col, line, type) {
      var columnPosition, h, _i, _ref, _results;
      _results = [];
      for (columnPosition = _i = 1, _ref = type.width; 1 <= _ref ? _i <= _ref : _i >= _ref; columnPosition = 1 <= _ref ? ++_i : --_i) {
        this.map[col + columnPosition - 1] = line + type.height;
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (h = _j = 0, _ref1 = type.height - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; h = 0 <= _ref1 ? ++_j : --_j) {
            _results1.push(this.cubeMap[col + columnPosition - 1][line + h] = 1);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    CubeManager.prototype.randomizeType = function(choices) {
      var biggest, index, item, possibleType, possibleTypes, rand, randomCount, randomMap, ratio, type, typeIndex, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
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
      biggest = {
        width: 0,
        height: 0
      };
      for (index = _k = 0, _len2 = possibleTypes.length; _k < _len2; index = ++_k) {
        possibleType = possibleTypes[index];
        if (possibleType.type.width > biggest.width || possibleType.type.height > biggest.height) {
          biggest.width = possibleType.type.width;
          biggest.height = possibleType.type.height;
        }
        randomCount += possibleType.proba;
        randomMap.push({
          index: index,
          percent: randomCount,
          type: possibleType.type
        });
      }
      rand = Math.floor(Math.random() * randomCount) + 1;
      if (biggest.width === 1 || biggest.height === 1) {
        this.updateRate = config.fastLevelSpeed;
        return possibleTypes[0];
      }
      for (_l = 0, _len3 = randomMap.length; _l < _len3; _l++) {
        item = randomMap[_l];
        if (!(biggest.width === 1 && biggest.height === 1 && item.type.bonus !== void 0)) {
          if (rand <= item.percent) {
            return possibleTypes[item.index];
          }
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
            return this.wait();
          }
        }
      }
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

    CubeManager.prototype.explodeMap = function(col, line) {
      var cube, i, map, pos, _i, _j, _len, _len1, _ref;
      map = this.createExplosionMap(col, line);
      _ref = this.cubes;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        cube = _ref[i];
        if (cube !== null) {
          for (_j = 0, _len1 = map.length; _j < _len1; _j++) {
            pos = map[_j];
            if (cube.intersect(pos[0], pos[1])) {
              this.cubes[i] = null;
            }
          }
        }
      }
      this.cubes = this.cubes.filter(function(val) {
        return val !== null;
      });
      return this.applyGravity();
    };

    CubeManager.prototype.createExplosionMap = function(col, line) {
      var i, j, map, _i, _j;
      map = [];
      for (i = _i = -1; _i <= 2; i = ++_i) {
        for (j = _j = -1; _j <= 2; j = ++_j) {
          map.push([col + i, line + j]);
        }
      }
      return map;
    };

    CubeManager.prototype.applyGravity = function() {
      var canFall, cube, i, _i, _j, _len, _ref, _ref1, _results;
      this.rebuildMap();
      _ref = this.cubes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cube = _ref[_i];
        if (cube !== null) {
          canFall = true;
          while (canFall) {
            for (i = _j = 0, _ref1 = cube.type.width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
              if (this.cubeMap[cube.col + i][cube.line - 1] === 1) {
                canFall = false;
                break;
              }
            }
            if (canFall) {
              if (cube.line === 0) {
                canFall = false;
              } else {
                cube.line -= 1;
              }
            }
          }
        }
        _results.push(this.rebuildMap());
      }
      return _results;
    };

    CubeManager.prototype.rebuildMap = function() {
      var columnPosition, cube, h, _i, _len, _ref, _results;
      this.resetMap();
      _ref = this.cubes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cube = _ref[_i];
        if (cube !== null) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (columnPosition = _j = 1, _ref1 = cube.type.width; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; columnPosition = 1 <= _ref1 ? ++_j : --_j) {
              this.map[cube.col + columnPosition - 1] = cube.line + cube.type.height;
              _results1.push((function() {
                var _k, _ref2, _results2;
                _results2 = [];
                for (h = _k = 0, _ref2 = cube.type.height - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; h = 0 <= _ref2 ? ++_k : --_k) {
                  _results2.push(this.cubeMap[cube.col + columnPosition - 1][cube.line + h] = 1);
                }
                return _results2;
              }).call(this));
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    CubeManager.prototype.fillMap = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 11; i = ++_i) {
        this.map[i] = 0;
        _results.push(this.cubeMap[i] = []);
      }
      return _results;
    };

    CubeManager.prototype.debug = function() {
      var b1, b2, b3, fn, interval, self;
      b1 = {
        proba: 20,
        size: SquareEnum.MEDIUM,
        width: SquareEnum.MEDIUM.x / 32,
        height: SquareEnum.MEDIUM.y / 32
      };
      b2 = {
        proba: 5,
        size: SquareEnum.LARGE,
        width: SquareEnum.LARGE.x / 32,
        height: SquareEnum.LARGE.y / 32
      };
      b3 = {
        proba: 5,
        size: SquareEnum.MEDIUM,
        width: SquareEnum.MEDIUM.x / 32,
        height: SquareEnum.MEDIUM.y / 32,
        special: 'explosion',
        id: 1
      };
      new Block(0, 0, b2, true);
      networkManager.sendMap(this.cubeMap);
      self = this;
      interval = config.levelSpeed;
      fn = function() {
        new Block(1, 4, b1, true);
        return networkManager.sendMap(self.cubeMap);
      };
      setTimeout(fn, interval * 1);
      fn = function() {
        new Block(2, 6, b1, true);
        return networkManager.sendMap(self.cubeMap);
      };
      setTimeout(fn, interval * 2);
      fn = function() {
        new Block(0, 8, b2, true);
        return networkManager.sendMap(self.cubeMap);
      };
      setTimeout(fn, interval * 3);
      fn = function() {
        new Special(4, 0, b3);
        return networkManager.sendMap(self.cubeMap);
      };
      return setTimeout(fn, interval * 4);
    };

    return CubeManager;

  })();

  LevelManager = (function() {
    function LevelManager() {
      this.level = 0;
      this.speed = config.levelSpeed;
      this.tweens = [];
      this.lastHeight = 0;
      this.savedLevel = 0;
    }

    LevelManager.prototype.launch = function() {
      return this.nextLevel();
    };

    LevelManager.prototype.reset = function() {
      networkManager.sendResetLevel();
      cubeManager.reset();
      bossManager.reset();
      clearTimeout(networkManager.timeout);
      this.level = this.savedLevel;
      return this.speed = config.levelSpeed;
    };

    LevelManager.prototype.moveStage = function() {
      var height;
      height = this.lastHeight * 32;
      return networkManager.moveLevel(height);
    };

    LevelManager.prototype.update = function() {
      var speed;
      this.level++;
      speed = config.levelSpeed - config.speedPerLevel * this.level;
      if (speed < config.maxLevelSpeed) {
        this.speed = config.levelSpeed - config.speedPerLevel * this.level;
      } else {
        this.speed = config.maxLevelSpeed;
      }
      return this.moveStage();
    };

    LevelManager.prototype.randomizeHeight = function() {
      var max, min;
      min = Math.round(config.minLevel + this.level / 2);
      max = Math.round(config.maxLevel + this.level / 2);
      return Math.floor((Math.random() * (max - min)) + min);
    };

    LevelManager.prototype.nextLevel = function() {
      if (!cubeManager.running) {
        clearTimeout(networkManager.timeout);
        this.clearLevel();
        this.lastHeight = this.randomizeHeight();
        return cubeManager.start(this.lastHeight, this.speed);
      }
    };

    LevelManager.prototype.clearLevel = function() {
      return networkManager.sendClearLevel();
    };

    LevelManager.prototype.nextBoss = function() {
      if (!bossManager.launched) {
        clearTimeout(networkManager.timeout);
        return bossManager.launch();
      }
    };

    LevelManager.prototype.passNextLevel = function() {
      var _ref;
      if (_ref = this.level, __indexOf.call(config.checkpoints, _ref) >= 0) {
        this.savedLevel = this.level;
        bossManager.saveBosses();
        networkManager.sendMessage('Checkpoint !');
      }
      cubeManager.waiting = false;
      bossManager.launched = false;
      return levelManager.nextLevel();
    };

    LevelManager.prototype.setDifficulty = function(level) {
      if (level === 'hell') {
        networkManager.sendMessage('Difficulty changed to hell.');
        networkManager.sendMessage('You shall not pass.');
        this.difficultyHell();
        return false;
      } else if (level === 'hard') {
        networkManager.sendMessage('Difficulty changed to hard.');
        this.difficultyHard();
        return false;
      } else if (level === 'medium') {
        networkManager.sendMessage('Difficulty changed to medium.');
        this.difficultyMedium();
        return false;
      } else if (level === 'easy') {
        networkManager.sendMessage('Difficulty changed to easy.');
        this.difficultyEasy();
        return false;
      } else {
        return 'Difficulty not changed, invalid option.';
      }
    };

    LevelManager.prototype.difficultyHell = function() {
      config.levelSpeed = 600;
      config.fastLevelSpeed = 300;
      config.speedPerLevel = 40;
      config.randomEventProb = 0.8;
      config.minLevel = 6;
      config.maxLevel = 12;
      config.bossDifficulty = 3;
      return this.restart();
    };

    LevelManager.prototype.difficultyHard = function() {
      config.levelSpeed = 800;
      config.fastLevelSpeed = 400;
      config.speedPerLevel = 35;
      config.randomEventProb = 0.7;
      config.minLevel = 6;
      config.maxLevel = 12;
      config.bossDifficulty = 2;
      return this.restart();
    };

    LevelManager.prototype.difficultyMedium = function() {
      config.levelSpeed = 1000;
      config.fastLevelSpeed = 500;
      config.speedPerLevel = 35;
      config.randomEventProb = 0.6;
      config.minLevel = 6;
      config.maxLevel = 10;
      config.bossDifficulty = 1;
      return this.restart();
    };

    LevelManager.prototype.difficultyEasy = function() {
      config.levelSpeed = 1200;
      config.fastLevelSpeed = 600;
      config.speedPerLevel = 30;
      config.randomEventProb = 0.5;
      config.minLevel = 4;
      config.maxLevel = 8;
      config.bossDifficulty = 0;
      return this.restart();
    };

    LevelManager.prototype.restart = function() {
      this.savedLevel = 0;
      bossManager.restart();
      return this.reset();
    };

    return LevelManager;

  })();

  NetworkManager = (function() {
    function NetworkManager(port) {
      var http, server;
      this.express = require('express');
      this.app = this.express();
      http = require('http');
      server = http.createServer(this.app);
      this.io = require('socket.io').listen(server);
      this.io.enable('browser client minification');
      this.io.enable('browser client etag');
      this.io.enable('browser client gzip');
      this.io.set('log level', 1);
      this.waitingFor = 0;
      this.responseOk = 0;
      server.listen(port);
      this.listener();
    }

    NetworkManager.prototype.listener = function() {
      var self;
      self = this;
      this.app.use(this.express["static"](__dirname + '/../app'));
      return this.io.sockets.on('connection', function(socket) {
        socket.on('login', function(arr) {
          socket.set('name', arr[0]);
          socket.set('skin', arr[1]);
          socket.set('inGame', false);
          socket.set('dead', false);
          networkManager.updatePlayerList();
          if (!cubeManager.running && !bossManager.launched) {
            self.joinGame(socket);
          } else {
            socket.broadcast.emit('message', [null, arr[0] + ' is waiting to join !']);
            socket.set('dead', true);
          }
          return networkManager.updatePlayerList();
        });
        socket.on('launch', function() {
          if (socket.id === self.io.sockets.clients()[0].id) {
            return game.launch();
          }
        });
        socket.on('reset', function() {
          if (socket.id === self.io.sockets.clients()[0].id) {
            game.reset();
            return self.sendResetLevel();
          }
        });
        socket.on('die', function() {
          socket.broadcast.emit('kill', socket.id);
          return socket.set('dead', true);
        });
        socket.on('rez', function() {
          return socket.set('dead', false);
        });
        socket.on('move', function(arr) {
          return socket.set('position', {
            x: parseInt(arr[0]),
            y: parseInt(arr[1])
          });
        });
        socket.on('changeAnimation', function(animation) {
          return socket.set('animation', animation);
        });
        socket.on('changeAnimationSide', function(side) {
          return socket.set('animationSide', side);
        });
        socket.on('moveLevelOk', function() {
          self.responseOk++;
          if (self.responseOk >= self.waitingFor) {
            return levelManager.nextBoss();
          }
        });
        socket.on('bonusTaken', function(bonusId) {
          return socket.broadcast.emit('bonusTaken', bonusId);
        });
        socket.on('bossBeaten', function() {
          self.responseOk++;
          if (self.responseOk >= self.waitingFor) {
            return levelManager.passNextLevel();
          }
        });
        socket.on('resurection', function() {
          return socket.broadcast.emit('resurection');
        });
        socket.on('message', function(message) {
          if (message[0] === '/') {
            return commandManager.exec(socket, message);
          } else {
            return socket.broadcast.emit('message', [socket.id, message]);
          }
        });
        socket.on('tpBonus', function(message) {
          return socket.broadcast.emit('tpBonus', socket.id);
        });
        socket.on('sendJumpBlock', function(coords) {
          return socket.broadcast.emit('sendJumpBlock', coords);
        });
        socket.on('sendLootBonus', function(coords) {
          return socket.broadcast.emit('sendLootBonus', coords);
        });
        return socket.on('disconnect', function() {
          socket.broadcast.emit('disconnect', socket.id);
          return socket.get('name', function(error, name) {
            return socket.broadcast.emit('message', [null, name + ' has left the game !']);
          });
        });
      });
    };

    NetworkManager.prototype.sendCube = function(col, size) {
      return this.io.sockets.emit('fallingCube', [col, size]);
    };

    NetworkManager.prototype.sendBonus = function(col, bonus, id) {
      return this.io.sockets.emit('fallingBonus', [col, bonus, id]);
    };

    NetworkManager.prototype.sendSpecial = function(col, size, type) {
      return this.io.sockets.emit('fallingSpecial', [col, size, type]);
    };

    NetworkManager.prototype.sendRanSpecial = function(col, size, type) {
      return this.io.sockets.emit('fallingRandSpecial', [col, size, type]);
    };

    NetworkManager.prototype.sendRandomEvent = function(type) {
      return this.io.sockets.emit('randomEvent', type);
    };

    NetworkManager.prototype.sendResetLevel = function() {
      return this.io.sockets.emit('resetLevel');
    };

    NetworkManager.prototype.sendClearLevel = function() {
      return this.io.sockets.emit('clearLevel', levelManager.level);
    };

    NetworkManager.prototype.moveLevel = function(height) {
      var callback;
      callback = function() {
        return levelManager.nextBoss();
      };
      this.waitForAll(callback, config.timeout);
      return this.io.sockets.emit('moveLevel', height);
    };

    NetworkManager.prototype.sendBoss = function(boss, options, timeout) {
      var callback;
      callback = function() {
        return levelManager.passNextLevel();
      };
      this.waitForAll(callback, config.timeout + timeout);
      this.sendClearLevel();
      return this.io.sockets.emit('spawnBoss', [boss, options]);
    };

    NetworkManager.prototype.sendPositions = function() {
      var player, players, self, _i, _len, _results;
      self = this;
      players = this.io.sockets.clients();
      _results = [];
      for (_i = 0, _len = players.length; _i < _len; _i++) {
        player = players[_i];
        _results.push(player.get('cachedData', function(error, cachedData) {
          player.get('position', function(error, position) {
            if (cachedData === null) {
              cachedData = {};
            }
            if (position !== null && cachedData.position !== position) {
              self.io.sockets.emit('move', [player.id, position.x, position.y]);
              return cachedData.position = position;
            }
          });
          player.get('animation', function(error, animation) {
            if (animation !== null && cachedData.animation !== animation) {
              self.io.sockets.emit('changeAnimation', [player.id, animation]);
              return cachedData.animation = animation;
            }
          });
          player.get('animationSide', function(error, animationSide) {
            if (animationSide !== null && cachedData.animationSide !== animationSide) {
              self.io.sockets.emit('changeAnimationSide', [player.id, animationSide]);
              return cachedData.animationSide = animationSide;
            }
          });
          return player.set('cachedData', cachedData);
        }));
      }
      return _results;
    };

    NetworkManager.prototype.waitForAll = function(callback, time) {
      this.waitingFor = this.io.sockets.clients().length;
      this.responseOk = 0;
      return this.timeout = setTimeout(callback, time);
    };

    NetworkManager.prototype.sendPlayerList = function() {
      return this.io.sockets.emit('playerList', this.updatePlayerList());
    };

    NetworkManager.prototype.updatePlayerList = function() {
      var deads, list, player, players, _i, _len;
      list = [];
      deads = [];
      players = this.io.sockets.clients();
      for (_i = 0, _len = players.length; _i < _len; _i++) {
        player = players[_i];
        player.get('inGame', function(error, isInGame) {
          if (isInGame) {
            list.push(player.id);
            return player.get('dead', function(error, isDead) {
              if (isDead) {
                return deads.push(player.id);
              }
            });
          }
        });
      }
      if (game.running && list.length === 0) {
        game.restart();
      }
      game.players = list.length;
      game.deadPlayers = deads.length;
      return list;
    };

    NetworkManager.prototype.sendMap = function(map) {
      return this.io.sockets.emit('debugMap', map);
    };

    NetworkManager.prototype.sendMessage = function(message) {
      return this.io.sockets.emit('message', [null, message]);
    };

    NetworkManager.prototype.joinPlayer = function() {
      var player, players, _i, _len, _results;
      players = this.io.sockets.clients();
      _results = [];
      for (_i = 0, _len = players.length; _i < _len; _i++) {
        player = players[_i];
        _results.push(this.joinGame(player));
      }
      return _results;
    };

    NetworkManager.prototype.joinGame = function(socket) {
      var self;
      self = this;
      return socket.get('inGame', function(error, ig) {
        var player, players, _i, _len, _results;
        if (ig === false) {
          socket.set('inGame', true);
          socket.emit('join');
          socket.get('name', function(error, name) {
            return socket.get('skin', function(error, skin) {
              socket.broadcast.emit('connection', [socket.id, name, skin]);
              socket.broadcast.emit('message', [null, name + ' has joined the game !']);
              return socket.emit('message', [null, 'Welcome !']);
            });
          });
          players = self.io.sockets.clients();
          _results = [];
          for (_i = 0, _len = players.length; _i < _len; _i++) {
            player = players[_i];
            if (player.id !== socket.id) {
              player.get('name', function(error, name) {
                return player.get('skin', function(error, skin) {
                  return socket.emit('connection', [player.id, name, skin]);
                });
              });
              player.get('position', function(error, position) {
                if (position !== null) {
                  return socket.emit('move', [player.id, position.x, position.y]);
                }
              });
              player.get('animation', function(error, animation) {
                if (animation !== null) {
                  return socket.emit('changeAnimation', [player.id, animation]);
                }
              });
              _results.push(player.get('animationSide', function(error, animationSide) {
                if (animationSide !== null) {
                  return socket.emit('changeAnimationSide', [player.id, animationSide]);
                }
              }));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      });
    };

    NetworkManager.prototype.sendJumpBlock = function(col) {
      return this.io.sockets.emit('sendDeployedJumpBonus', col);
    };

    return NetworkManager;

  })();

  CommandManager = (function() {
    function CommandManager() {
      this.allowedCommands = [
        {
          cmd: ['difficulty', 'diff'],
          params: 0,
          exec: 'commandManager.help("difficulty")'
        }, {
          cmd: ['difficulty', 'diff'],
          params: 1,
          type: 'str',
          exec: 'levelManager.setDifficulty'
        }
      ];
    }

    CommandManager.prototype.exec = function(socket, cmd) {
      var msg, obj;
      cmd = cmd.split('/')[1];
      obj = this.exist(cmd);
      if (obj && this.isAdmin(socket)) {
        msg = this.execFunction(obj, cmd);
        if (msg) {
          return socket.emit('message', [null, msg]);
        }
      } else {
        return socket.emit('message', [null, 'Command not found !']);
      }
    };

    CommandManager.prototype.exist = function(cmd) {
      var alias, command, params, tmp, _i, _j, _len, _len1, _ref, _ref1;
      tmp = cmd.split(' ');
      cmd = tmp[0];
      params = tmp.length - 1;
      _ref = this.allowedCommands;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _ref1 = command.cmd;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          alias = _ref1[_j];
          if (alias === cmd && command.params === params) {
            return command;
          }
        }
      }
      return false;
    };

    CommandManager.prototype.isAdmin = function(socket) {
      return socket.id === networkManager.io.sockets.clients()[0].id;
    };

    CommandManager.prototype.execFunction = function(cmd, params) {
      var i, p, _i, _ref;
      params = params.split(' ');
      if (cmd.params === 0 && cmd.exec !== void 0) {
        return eval(cmd.exec);
      } else if (cmd.exec !== void 0) {
        p = '';
        for (i = _i = 1, _ref = cmd.params; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          p += this.sanitizeParameter(params[i], cmd.type) + ',';
        }
        p = p.substr(0, p.length - 1);
        return eval(cmd.exec + '(' + p + ')');
      } else {
        return 'Command unknown';
      }
    };

    CommandManager.prototype.sanitizeParameter = function(param, rule) {
      if (rule === 'bool') {
        return param === 'true';
      } else if (rule === 'int') {
        return parseInt(param);
      } else {
        return '"' + param + '"';
      }
    };

    CommandManager.prototype.help = function(cmd) {
      if (cmd === 'difficulty') {
        return 'Command usage : /difficulty easy|medium|hard|hell';
      } else {
        return 'Command unknown';
      }
    };

    return CommandManager;

  })();

  Block = (function() {
    function Block(col, line, type, solid) {
      this.col = col;
      this.line = line;
      this.type = type;
      this.solid = solid;
      if (this.solid) {
        cubeManager.cubes.push(this);
      }
      this.send();
    }

    Block.prototype.intersect = function(col, line) {
      return col >= this.col && col < this.col + this.type.width && line >= this.line && line < this.line + this.type.height;
    };

    Block.prototype.send = function() {
      networkManager.sendCube(this.col, this.type.size);
      return cubeManager.addCubeToMap(this.col, this.line, this.type);
    };

    return Block;

  })();

  Bonus = (function(_super) {
    __extends(Bonus, _super);

    function Bonus(col, line, type) {
      Bonus.__super__.constructor.call(this, col, line, type, false);
    }

    Bonus.prototype.send = function() {
      if (this.type.bonus === 'deployedJumpBlockBonus') {
        return networkManager.sendJumpBlock(this.col);
      } else {
        networkManager.sendBonus(this.col, this.type.id, cubeManager.bonusId);
        return cubeManager.bonusId++;
      }
    };

    return Bonus;

  })(Block);

  Special = (function(_super) {
    __extends(Special, _super);

    function Special(col, line, type) {
      var solid;
      solid = true;
      Special.__super__.constructor.call(this, col, line, type, solid);
    }

    Special.prototype.send = function() {
      var id;
      if (this.type.special === 'randblock') {
        id = Math.floor(Math.random() * (SpecialCubes.length - 1));
        cubeManager.addCubeToMap(this.col, this.line, this.type);
        return networkManager.sendRanSpecial(this.col, this.type.size, id);
      } else {
        cubeManager.addCubeToMap(this.col, this.line, this.type);
        return networkManager.sendSpecial(this.col, this.type.size, this.type.id);
      }
    };

    return Special;

  })(Block);

  bonusEvents = ['resurection', 'bonuses', 'tp'];

  Bonuses = [1, 2, 3, 4, 6, 7, 8];

  Event = (function() {
    function Event() {
      this.id = Math.floor(Math.random() * bonusEvents.length);
      this.send();
      if (this.id === 1) {
        this.spawnBonuses();
      }
    }

    Event.prototype.send = function() {
      networkManager.sendRandomEvent(this.id);
      if (this.id === 0 && game.restartTimer !== null) {
        return clearTimeout(game.restartTimer);
      }
    };

    Event.prototype.spawnBonuses = function() {
      var i, rand, randType, _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 4; i = ++_i) {
        rand = Math.floor(Math.random() * 12);
        randType = Math.floor(Math.random() * Bonuses.length);
        _results.push(new Bonus(rand, 0, {
          id: Bonuses[randType]
        }));
      }
      return _results;
    };

    return Event;

  })();

  Boss = (function() {
    function Boss(name, timeout, options) {
      this.timeout = timeout;
      this.name = name;
      this.options = options;
    }

    Boss.prototype.getLevel = function(level, ratio) {
      if (levelManager.level > level) {
        return level + levelManager.level / ratio;
      } else {
        return levelManager.level;
      }
    };

    return Boss;

  })();

  BossManager = (function() {
    function BossManager() {
      this.launched = false;
      this.initBosses = ['roueman', 'freezeman', 'poingman', 'labiman', 'sparkman', 'homingman', 'missileman'];
      this.boss = this.initBosses;
      this.tmpBeatenBosses = [];
      this.beatenBosses = [];
    }

    BossManager.prototype.launch = function() {
      var boss;
      boss = this.getBoss();
      if (boss) {
        networkManager.sendBoss(boss.id, boss.options, boss.timeout);
        this.launched = true;
        return this.updateBosses(boss.name);
      } else {
        this.restart();
        return this.launch();
      }
    };

    BossManager.prototype.reset = function() {
      this.launched = false;
      return this.resetBosses();
    };

    BossManager.prototype.getBoss = function() {
      var boss;
      boss = this.boss[Math.floor(Math.random() * this.boss.length)];
      if (boss === 'roueman') {
        return new RoueMan();
      } else if (boss === 'freezeman') {
        return new FreezeMan();
      } else if (boss === 'poingman') {
        return new PoingMan();
      } else if (boss === 'labiman') {
        return new LabiMan();
      } else if (boss === 'sparkman') {
        return new SparkMan();
      } else if (boss === 'homingman') {
        return new HomingMan();
      } else if (boss === 'missileman') {
        return new MissileMan();
      } else {
        return false;
      }
    };

    BossManager.prototype.updateBosses = function(boss) {
      var index;
      this.tmpBeatenBosses.push(boss);
      index = this.boss.indexOf(boss);
      return this.boss.splice(index, 1);
    };

    BossManager.prototype.resetBosses = function() {
      this.boss = this.boss.concat(this.tmpBeatenBosses);
      return this.tmpBeatenBosses = [];
    };

    BossManager.prototype.saveBosses = function() {
      return this.tmpBeatenBosses = [];
    };

    BossManager.prototype.restart = function() {
      this.beatenBosses = [];
      this.tmpBeatenBosses = [];
      return this.boss = this.initBosses;
    };

    return BossManager;

  })();

  RoueMan = (function(_super) {
    __extends(RoueMan, _super);

    function RoueMan() {
      RoueMan.__super__.constructor.call(this, 'roueman', 15000, this.getPattern());
      this.id = 1;
    }

    RoueMan.prototype.getPattern = function() {
      var attacks, options, speed, speedPerLevel;
      speedPerLevel = 0.02;
      speed = Math.round((0.6 + speedPerLevel * (levelManager.level + config.bossDifficulty)) * 100) / 100;
      options = speed;
      attacks = this.generateAttacks();
      return [options, attacks];
    };

    RoueMan.prototype.generateAttacks = function() {
      var attack, attacks, i, side, _i;
      attacks = [];
      attacks.push([0, 25]);
      for (i = _i = 0; _i <= 6; i = ++_i) {
        if (Math.random() > 0.5) {
          side = 1;
        } else {
          side = -1;
        }
        if (Math.random() > 0.5) {
          attack = 6;
        } else {
          attack = 4;
        }
        attacks.push([10 * side, 0]);
        attacks.push([0, attack]);
        attacks.push([-20 * side, 0]);
        attacks.push([0, -attack]);
        attacks.push([10 * side, 0]);
      }
      return attacks;
    };

    return RoueMan;

  })(Boss);

  FreezeMan = (function(_super) {
    __extends(FreezeMan, _super);

    function FreezeMan() {
      FreezeMan.__super__.constructor.call(this, 'freezeman', 15000, this.getPattern());
      this.id = 2;
    }

    FreezeMan.prototype.getPattern = function() {
      var attack, attacks, i, interval, level, options, speed, speedPerLevel, _i;
      speedPerLevel = 0.015;
      level = this.getLevel(6, 3);
      speed = Math.round((0.5 + speedPerLevel * (level + config.bossDifficulty)) * 100) / 100;
      interval = 1500 - 50 * (levelManager.level + config.bossDifficulty);
      options = [speed, interval];
      attacks = [];
      for (i = _i = 0; _i <= 5; i = ++_i) {
        attack = Math.floor((Math.random() * 10) + 1);
        attacks.push([4 + attack, 4 + attack - 20]);
      }
      return [options, attacks];
    };

    return FreezeMan;

  })(Boss);

  PoingMan = (function(_super) {
    __extends(PoingMan, _super);

    function PoingMan() {
      PoingMan.__super__.constructor.call(this, 'poingman', 15000, this.getPattern());
      this.id = 3;
    }

    PoingMan.prototype.getPattern = function() {
      var attack, attackSpeed, attacks, i, level, options, speed, waitTime, _i;
      level = this.getLevel(6, 2);
      speed = Math.round((0.4 + 0.035 * (level + config.bossDifficulty)) * 100) / 100;
      attackSpeed = Math.round((0.6 + 0.04 * (level + config.bossDifficulty)) * 100) / 100;
      waitTime = 600 - 15 * (level + config.bossDifficulty);
      options = [speed, attackSpeed, waitTime];
      attacks = [];
      for (i = _i = 0; _i <= 5; i = ++_i) {
        attack = Math.floor((Math.random() * 12) - 1);
        if (attack === -1) {
          attack = 0;
        } else if (attack === 11) {
          attack = 10;
        }
        attacks.push(attack);
      }
      return [options, attacks];
    };

    return PoingMan;

  })(Boss);

  LabiMan = (function(_super) {
    __extends(LabiMan, _super);

    function LabiMan() {
      LabiMan.__super__.constructor.call(this, 'labiman', 15000, this.getPattern());
      this.id = 4;
    }

    LabiMan.prototype.getPattern = function() {
      var attackSpeed, attacks, level, options, speed, wait;
      speed = 0.4;
      level = this.getLevel(6, 3);
      attackSpeed = Math.round((0.075 + 0.0075 * ((level + config.bossDifficulty) - 1)) * 100) / 100;
      wait = 4000 - 50 * (levelManager.level + config.bossDifficulty);
      options = [speed, attackSpeed, wait];
      attacks = this.makeLevel();
      return [options, attacks];
    };

    LabiMan.prototype.makeLevel = function() {
      var i, level, tmp, _i;
      level = [];
      level.push([Math.floor(Math.random() * 10), 2]);
      for (i = _i = 0; _i <= 10; i = ++_i) {
        tmp = this.nextPossibility(level);
        if (tmp[1] < 20) {
          level.push(tmp);
        }
      }
      return level;
    };

    LabiMan.prototype.nextPossibility = function(level) {
      var lastLevel, next, nextIndex, possibilities, postLastLevel;
      lastLevel = level[level.length - 1];
      postLastLevel = level[level.length - 2];
      possibilities = [];
      if (level.length === 1) {
        possibilities = [[2, 2], [-2, 2]];
      } else {
        if (lastLevel[1] === postLastLevel[1] + 1) {
          if (lastLevel[0] >= postLastLevel[0]) {
            possibilities.push([1, 2], [2, 2], [-2, 2]);
          } else {
            possibilities.push([-1, 2], [-2, 2], [2, 2]);
          }
        } else {
          if (lastLevel[0] >= postLastLevel[0]) {
            possibilities.push([1, 2], [2, 2], [-2, 2]);
          } else {
            possibilities.push([-1, 2], [-2, 2], [2, 2]);
          }
        }
      }
      while (true) {
        nextIndex = Math.floor(Math.random() * possibilities.length);
        next = [lastLevel[0] + possibilities[nextIndex][0], lastLevel[1] + possibilities[nextIndex][1]];
        if (next[0] >= 0 && next[0] <= 10) {
          break;
        }
      }
      return next;
    };

    return LabiMan;

  })(Boss);

  SparkMan = (function(_super) {
    __extends(SparkMan, _super);

    function SparkMan() {
      SparkMan.__super__.constructor.call(this, 'sparkman', 30000, this.getPattern());
      this.id = 5;
    }

    SparkMan.prototype.getPattern = function() {
      var attackSpeed, attacks, interval, options, speed;
      speed = Math.round((0.5 + 0.03 * (levelManager.level + config.bossDifficulty)) * 100) / 100;
      attackSpeed = Math.round((0.2 + 0.005 * ((levelManager.level + config.bossDifficulty) - 1)) * 100) / 100;
      interval = 4000 - 20 * (levelManager.level + config.bossDifficulty);
      options = [speed, attackSpeed, interval];
      attacks = this.makeLevel(attackSpeed);
      return [options, attacks];
    };

    SparkMan.prototype.makeLevel = function(xSpeed) {
      var attacks, i, xSide, ySide, ySpeed, _i;
      attacks = [];
      for (i = _i = 0; _i <= 7; i = ++_i) {
        ySpeed = (Math.round(Math.random() * (xSpeed * 100 - 10) + 10)) / 100;
        xSide = Math.round(Math.random() * 2 - 1);
        ySide = 1;
        if (xSide === 0) {
          xSide = 1;
        }
        attacks.push([xSide, ySide, ySpeed]);
      }
      return attacks;
    };

    return SparkMan;

  })(Boss);

  HomingMan = (function(_super) {
    __extends(HomingMan, _super);

    function HomingMan() {
      HomingMan.__super__.constructor.call(this, 'homingman', 20000, this.getPattern());
      this.id = 6;
    }

    HomingMan.prototype.getPattern = function() {
      var attackSpeed, attacks, options, secondWait, speed, speedPerLevel, wait;
      speed = 0.5;
      speedPerLevel = 0.3;
      attackSpeed = Math.round((0.4 + speedPerLevel * (levelManager.level + config.bossDifficulty)) * 100) / 100;
      wait = 500 - (levelManager.level + config.bossDifficulty) * 25;
      secondWait = 2000 - (levelManager.level + config.bossDifficulty) * 50;
      options = [speed, attackSpeed];
      attacks = this.getLevel(wait, secondWait);
      return [options, attacks];
    };

    HomingMan.prototype.getLevel = function(wait, secondWait) {
      var attacks, i, j, patterns, randPat, tmp, _i, _j, _k, _l, _m;
      attacks = [];
      patterns = [[1, 1, 0], [0, 1, 1], [0, 0, 1], [1, 0, 0]];
      randPat = [];
      for (i = _i = 1; _i <= 2; i = ++_i) {
        randPat.push(Math.floor(Math.random() * (patterns.length - 1)));
      }
      for (i = _j = 1; _j <= 3; i = ++_j) {
        tmp = [[0, i]];
        for (j = _k = 1; _k <= 2; j = ++_k) {
          if (j % 2 === 0) {
            tmp.push([0, wait + patterns[randPat[j - 1]][i - 1] * secondWait]);
          } else {
            tmp.push([1, wait + patterns[randPat[j - 1]][i - 1] * secondWait]);
          }
        }
        attacks.push(tmp);
      }
      for (i = _l = 1; _l <= 3; i = ++_l) {
        tmp = [[1, i]];
        for (j = _m = 1; _m <= 2; j = ++_m) {
          if (j % 2 === 0) {
            tmp.push([1, secondWait + patterns[randPat[j - 1]][i - 1] * secondWait]);
          } else {
            tmp.push([0, secondWait + patterns[randPat[j - 1]][i - 1] * secondWait]);
          }
        }
        attacks.push(tmp);
      }
      return attacks;
    };

    return HomingMan;

  })(Boss);

  MissileMan = (function(_super) {
    __extends(MissileMan, _super);

    function MissileMan() {
      MissileMan.__super__.constructor.call(this, 'missileman', 15000, this.getPattern());
      this.id = 7;
    }

    MissileMan.prototype.getPattern = function() {
      var attacks, interval, level, options, speed;
      level = this.getLevel(5, 3);
      speed = Math.round((0.5 + 0.025 * (level + config.bossDifficulty)) * 100) / 100;
      interval = 500 - (level + config.bossDifficulty) * 30;
      options = [speed, interval];
      attacks = this.genAttacks();
      return [options, attacks];
    };

    MissileMan.prototype.genAttacks = function() {
      var attacks, i, rand, spawn, _i;
      attacks = [];
      for (i = _i = 0; _i <= 20; i = ++_i) {
        rand = Math.random();
        if (rand < 0.25) {
          spawn = 32;
        } else if (rand > 0.25 && rand < 0.5) {
          spawn = 64;
        } else if (rand > 0.5 && rand < 0.74) {
          spawn = 608;
        } else {
          spawn = 640;
        }
        attacks.push([spawn, (Math.floor((Math.random() * 12) + 1)) * 32 + 128]);
      }
      return attacks;
    };

    return MissileMan;

  })(Boss);

  nconf = require('nconf');

  nconf.argv().env();

  nconf.file({
    file: __dirname + '/../config.json'
  });

  nconf.defaults({
    port: 80
  });

  request = require("request");

  pjson = require('./../package.json');

  version = pjson.version;

  networkManager = new NetworkManager(nconf.get('port'));

  game = new Game();

  cubeManager = new CubeManager();

  levelManager = new LevelManager();

  bossManager = new BossManager();

  commandManager = new CommandManager();

  setInterval(function() {
    return game.loop();
  }, 1000 / config.FPS);

  setInterval(function() {
    return networkManager.updatePlayerList();
  }, 500);

  setInterval(function() {
    return slowLoop();
  }, 1000 / config.lowFPS);

  game.update = function(frameTime) {
    var fn;
    if (game.running) {
      cubeManager.update(frameTime);
      networkManager.sendPositions();
      if (game.players === game.deadPlayers && game.restartTimer === null) {
        fn = function() {
          return game.reset();
        };
        return game.restartTimer = setTimeout(fn, config.timeBeforeReset);
      }
    } else {
      return game.autoLaunch(frameTime);
    }
  };

  slowLoop = function() {
    networkManager.sendPlayerList();
    if ((cubeManager.running || bossManager.launched) && Math.random() > config.randomEventProb) {
      new Event();
    }
    return request(nconf.get('masterServer') + '/add.php?host=' + nconf.get('host') + '&port=' + nconf.get('port') + '&server=' + nconf.get('server') + '&players=' + game.players + '&version=' + version);
  };

}).call(this);
