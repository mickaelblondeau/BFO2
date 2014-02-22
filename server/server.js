(function() {
  var Boss, BossManager, CubeManager, FreezeMan, Game, HomingMan, LabiMan, LevelManager, NetworkManager, PoingMan, RoueMan, SparkMan, SpecialCubes, SquareEnum, bossManager, config, cubeManager, game, levelManager, networkManager, slowLoop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = {
    FPS: 60,
    lowFPS: 0.1,
    levelSpeed: 1000,
    fastLevelSpeed: 500,
    speedPerLevel: 50,
    timeout: 5000,
    debug: false,
    debugMap: false
  };

  Game = (function() {
    function Game() {
      this.lastFrame = Date.now();
    }

    Game.prototype.loop = function() {
      var frameTime, thisFrame;
      thisFrame = Date.now();
      frameTime = thisFrame - this.lastFrame;
      this.lastFrame = thisFrame;
      return this.update(frameTime);
    };

    Game.prototype.reset = function() {
      return levelManager.reset();
    };

    Game.prototype.launch = function() {
      return levelManager.launch();
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

  SpecialCubes = ['iceExplosion', 'explosion', 'slowblock', 'stompblock', 'swapblock', 'tpblock'];

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
      this.types = [
        {
          proba: 2,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32,
          special: 'iceExplosion',
          id: 0
        }, {
          proba: 2,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32,
          special: 'explosion',
          id: 1
        }, {
          proba: 2,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32,
          special: 'slowblock',
          id: 2
        }, {
          proba: 2,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32,
          special: 'stompblock',
          id: 3
        }, {
          proba: 2,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32,
          special: 'swapblock',
          id: 4
        }, {
          proba: 2,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32,
          special: 'tpblock',
          id: 5
        }, {
          proba: 2,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32,
          special: 'randblock',
          id: 6
        }, {
          proba: 2,
          size: SquareEnum.SMALL,
          width: SquareEnum.SMALL.x / 32,
          height: SquareEnum.SMALL.y / 32,
          bonus: 'speed',
          id: 1
        }, {
          proba: 2,
          size: SquareEnum.SMALL,
          width: SquareEnum.SMALL.x / 32,
          height: SquareEnum.SMALL.y / 32,
          bonus: 'jumpHeight',
          id: 2
        }, {
          proba: 2,
          size: SquareEnum.SMALL,
          width: SquareEnum.SMALL.x / 32,
          height: SquareEnum.SMALL.y / 32,
          bonus: 'doubleJump',
          id: 3
        }, {
          proba: 2,
          size: SquareEnum.SMALL,
          width: SquareEnum.SMALL.x / 32,
          height: SquareEnum.SMALL.y / 32,
          bonus: 'grabbing',
          id: 4
        }, {
          proba: 5,
          size: SquareEnum.LARGE,
          width: SquareEnum.LARGE.x / 32,
          height: SquareEnum.LARGE.y / 32
        }, {
          proba: 20,
          size: SquareEnum.MEDIUM,
          width: SquareEnum.MEDIUM.x / 32,
          height: SquareEnum.MEDIUM.y / 32
        }, {
          proba: 15,
          size: SquareEnum.SMALL,
          width: SquareEnum.SMALL.x / 32,
          height: SquareEnum.SMALL.y / 32
        }, {
          proba: 10,
          size: SquareEnum.MEDIUM_RECT,
          width: SquareEnum.MEDIUM_RECT.x / 32,
          height: SquareEnum.MEDIUM_RECT.y / 32
        }, {
          proba: 5,
          size: SquareEnum.LARGE_RECT,
          width: SquareEnum.LARGE_RECT.x / 32,
          height: SquareEnum.LARGE_RECT.y / 32
        }, {
          proba: 5,
          size: SquareEnum.LONG_RECT,
          width: SquareEnum.LONG_RECT.x / 32,
          height: SquareEnum.LONG_RECT.y / 32
        }
      ];
    }

    CubeManager.prototype.start = function(level, rate) {
      if (!this.running && !this.waiting) {
        if (levelManager.level !== 0) {
          networkManager.sendBonus(4, 5, this.map[4], this.bonusId);
          this.bonusId++;
        }
        this.updateRate = rate;
        this.current = 0;
        this.levelHeight = level;
        this.running = true;
        if (config.debugMap) {
          return this.debug();
        }
      }
    };

    CubeManager.prototype.reset = function() {
      this.levelHeight = 0;
      this.stop();
      this.waiting = false;
      this.bonusId = 0;
      return this.resetMap();
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
      var choice, choices, columnPosition, count, h, id, rand, randType, tmp, type, typeIndex, _i, _j, _ref, _ref1;
      choices = this.checkCols();
      if (choices.length > 0) {
        tmp = this.randomizeType(choices);
        type = tmp.type;
        typeIndex = tmp.index;
        count = choices[typeIndex].length;
        rand = Math.floor(Math.random() * count);
        choice = choices[typeIndex][rand];
        if (type.bonus !== void 0) {
          networkManager.sendBonus(choice.column, type.id, this.bonusId);
          this.bonusId++;
        } else if (type.special !== void 0) {
          if (type.special === 'explosion') {
            this.explodeMap(choice.column, choice.height);
          }
          if (type.special === 'randblock') {
            id = Math.floor(Math.random() * (SpecialCubes.length - 1));
            randType = SpecialCubes[id];
            if (randType === 'explosion') {
              this.explodeMap(choice.column, choice.height);
            }
            networkManager.sendRanSpecial(choice.column, type.size, id);
          } else {
            networkManager.sendSpecial(choice.column, type.size, type.id);
          }
        } else {
          networkManager.sendCube(choice.column, type.size);
          for (columnPosition = _i = 1, _ref = type.width; 1 <= _ref ? _i <= _ref : _i >= _ref; columnPosition = 1 <= _ref ? ++_i : --_i) {
            this.map[choice.column + columnPosition - 1] = choice.height + type.height;
            for (h = _j = 0, _ref1 = type.height - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; h = 0 <= _ref1 ? ++_j : --_j) {
              this.cubeMap[choice.column + columnPosition - 1][choice.height + h] = 1;
            }
          }
        }
        if (config.debug) {
          networkManager.sendMap(this.cubeMap);
        }
        return true;
      } else {
        return false;
      }
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
      if (biggest.width === 1 && biggest.height === 1) {
        this.updateRate = config.fastLevelSpeed;
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
          if (!config.debugMap) {
            if (!this.sendCube()) {
              return this.wait();
            }
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

    CubeManager.prototype.explodeMap = function(col, height) {
      var colHeight, deep, i, j, k, newCol, newColHeight, newColMaxHeight, val, _i, _j, _len, _ref;
      for (i = _i = -4; _i <= 5; i = ++_i) {
        if (i > 0) {
          j = i - 1;
        } else {
          j = i;
        }
        newCol = col + i;
        if (newCol >= 0 && newCol <= 11) {
          deep = -5 + Math.abs(j);
          colHeight = 0;
          if (this.cubeMap[newCol] !== void 0 && this.cubeMap[newCol] !== null) {
            colHeight = this.cubeMap[newCol].length;
          }
          newColHeight = height + deep + 1;
          newColMaxHeight = height - deep + 1;
          if (this.cubeMap[newCol] !== void 0 && this.cubeMap[newCol] !== null) {
            _ref = this.cubeMap[newCol];
            for (k = _j = 0, _len = _ref.length; _j < _len; k = ++_j) {
              val = _ref[k];
              if (k > newColHeight && k < newColMaxHeight) {
                this.cubeMap[newCol][k] = null;
              }
            }
          }
        }
      }
      return this.syncMap();
    };

    CubeManager.prototype.syncMap = function() {
      var i, len, subMap, tmp, _i, _len, _ref, _results;
      _ref = this.cubeMap;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        subMap = _ref[i];
        this.cubeMap[i] = this.cubeMap[i].filter(function(e) {
          return e;
        });
        tmp = this.cubeMap[i].lastIndexOf(1);
        if (tmp === -1) {
          this.cubeMap[i] = [];
        } else {
          this.cubeMap[i] = this.cubeMap[i].slice(0, tmp + 1);
        }
        len = 0;
        if (this.cubeMap[i] !== void 0 && this.cubeMap[i] !== null) {
          len = this.cubeMap[i].length;
        }
        _results.push(this.map[i] = len);
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
      var fn, self;
      self = this;
      fn = function() {
        var i, j;
        i = 0;
        j = 0;
        networkManager.sendCube(i, SquareEnum.MEDIUM);
        self.cubeMap[i][j] = 1;
        self.cubeMap[i + 1][j] = 1;
        self.cubeMap[i][j + 1] = 1;
        self.cubeMap[i + 1][j + 1] = 1;
        return networkManager.sendMap(self.cubeMap);
      };
      setTimeout(fn, 200);
      fn = function() {
        var i, j;
        i = 1;
        j = 2;
        networkManager.sendCube(i, SquareEnum.MEDIUM);
        self.cubeMap[i][j] = 1;
        self.cubeMap[i + 1][j] = 1;
        self.cubeMap[i][j + 1] = 1;
        self.cubeMap[i + 1][j + 1] = 1;
        return networkManager.sendMap(self.cubeMap);
      };
      setTimeout(fn, 400);
      fn = function() {
        var i, j;
        i = 0;
        j = 4;
        networkManager.sendCube(i, SquareEnum.MEDIUM);
        self.cubeMap[i][j] = 1;
        self.cubeMap[i + 1][j] = 1;
        self.cubeMap[i][j + 1] = 1;
        self.cubeMap[i + 1][j + 1] = 1;
        return networkManager.sendMap(self.cubeMap);
      };
      setTimeout(fn, 600);
      fn = function() {
        var i, j;
        i = 2;
        j = 4;
        networkManager.sendCube(i, SquareEnum.MEDIUM);
        self.cubeMap[i][j] = 1;
        self.cubeMap[i + 1][j] = 1;
        self.cubeMap[i][j + 1] = 1;
        self.cubeMap[i + 1][j + 1] = 1;
        return networkManager.sendMap(self.cubeMap);
      };
      setTimeout(fn, 600);
      fn = function() {
        var col, row;
        col = 5;
        row = 0;
        networkManager.sendSpecial(col, SquareEnum.MEDIUM, 'explosion');
        self.explodeMap(col, row);
        return networkManager.sendMap(self.cubeMap);
      };
      return setTimeout(fn, 3000);
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
      networkManager.sendResetLevel();
      cubeManager.reset();
      bossManager.reset();
      clearTimeout(networkManager.timeout);
      this.level = 0;
      this.speed = config.levelSpeed;
      return this.bossRound = false;
    };

    LevelManager.prototype.moveStage = function() {
      var height;
      height = this.lastHeight * 32;
      return networkManager.moveLevel(height);
    };

    LevelManager.prototype.update = function() {
      this.level++;
      this.speed = config.levelSpeed - config.speedPerLevel * this.level;
      return this.moveStage();
    };

    LevelManager.prototype.randomizeHeight = function() {
      var max, min;
      min = Math.round(4 + this.level / 2);
      max = Math.round(8 + this.level / 2);
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
      cubeManager.waiting = false;
      bossManager.launched = false;
      return levelManager.nextLevel();
    };

    return LevelManager;

  })();

  NetworkManager = (function() {
    function NetworkManager() {
      this.io = require('socket.io').listen(8080);
      this.waitingFor = 0;
      this.responseOk = 0;
      this.listener();
      this.io.enable('browser client minification');
      this.io.enable('browser client etag');
      this.io.enable('browser client gzip');
      this.io.set('log level', 1);
    }

    NetworkManager.prototype.listener = function() {
      var self;
      self = this;
      return this.io.sockets.on('connection', function(socket) {
        var player, players, _i, _len;
        players = self.io.sockets.clients();
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
            player.get('animationSide', function(error, animationSide) {
              if (animationSide !== null) {
                return socket.emit('changeAnimationSide', [player.id, animationSide]);
              }
            });
          }
        }
        socket.on('login', function(arr) {
          socket.set('name', arr[0]);
          socket.set('skin', arr[1]);
          return socket.broadcast.emit('connection', [socket.id, arr[0], arr[1]]);
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
          return socket.broadcast.emit('kill', socket.id);
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
          return socket.broadcast.emit('message', [socket.id, message]);
        });
        return socket.on('disconnect', function() {
          return socket.broadcast.emit('disconnect', socket.id);
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

    NetworkManager.prototype.sendResetLevel = function() {
      return this.io.sockets.emit('resetLevel');
    };

    NetworkManager.prototype.sendClearLevel = function() {
      return this.io.sockets.emit('clearLevel');
    };

    NetworkManager.prototype.moveLevel = function(height) {
      this.waitForAll(levelManager.nextBoss, config.timeout);
      return this.io.sockets.emit('moveLevel', height);
    };

    NetworkManager.prototype.sendBoss = function(boss, options, timeout) {
      this.waitForAll(levelManager.passNextLevel, config.timeout + timeout);
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
      var list, player, players, _i, _len;
      list = [];
      players = this.io.sockets.clients();
      for (_i = 0, _len = players.length; _i < _len; _i++) {
        player = players[_i];
        list.push(player.id);
      }
      this.io.sockets.emit('playerList', list);
      if (players.length === 0) {
        return game.reset();
      }
    };

    NetworkManager.prototype.sendMap = function(map) {
      return this.io.sockets.emit('debugMap', map);
    };

    return NetworkManager;

  })();

  Boss = (function() {
    function Boss(name, timeout, options) {
      this.timeout = timeout;
      this.name = name;
      this.options = options;
    }

    return Boss;

  })();

  BossManager = (function() {
    function BossManager() {
      this.launched = false;
      this.boss = ['roueman', 'freezeman', 'poingman', 'labiman', 'sparkman', 'homingman'];
    }

    BossManager.prototype.launch = function() {
      var boss;
      boss = this.getBoss();
      networkManager.sendBoss(boss.id, boss.options, boss.timeout);
      return this.launched = true;
    };

    BossManager.prototype.reset = function() {
      return this.launched = false;
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
      }
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
      speedPerLevel = 0.05;
      speed = Math.round((0.6 + speedPerLevel * levelManager.level) * 100) / 100;
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
      var attack, attacks, i, interval, options, speed, _i;
      speed = Math.round((0.4 + 0.075 * levelManager.level) * 100) / 100;
      interval = 1500 - 50 * levelManager.level;
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
      var attack, attackSpeed, attacks, i, options, speed, waitTime, _i;
      speed = Math.round((0.4 + 0.05 * levelManager.level) * 100) / 100;
      attackSpeed = Math.round((0.6 + 0.05 * levelManager.level) * 100) / 100;
      waitTime = 300 - 15 * levelManager.level;
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
      var attackSpeed, attacks, options, speed, wait;
      speed = 0.4;
      attackSpeed = Math.round((0.075 + 0.0075 * (levelManager.level - 1)) * 100) / 100;
      wait = 4000 - 50 * levelManager.level;
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
      speed = Math.round((0.5 + 0.03 * levelManager.level) * 100) / 100;
      attackSpeed = Math.round((0.2 + 0.005 * (levelManager.level - 1)) * 100) / 100;
      interval = 4000 - 20 * levelManager.level;
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
      var attackSpeed, attacks, interval, options, speed;
      speed = Math.round((0.5 + 0.03 * levelManager.level) * 100) / 100;
      attackSpeed = Math.round((0.05 + 0.005 * (levelManager.level - 1)) * 100) / 100;
      interval = 8000;
      options = [speed, attackSpeed, interval];
      attacks = 2;
      return [options, attacks];
    };

    return HomingMan;

  })(Boss);

  networkManager = new NetworkManager();

  game = new Game();

  cubeManager = new CubeManager();

  levelManager = new LevelManager();

  bossManager = new BossManager();

  setInterval(function() {
    return game.loop();
  }, 1000 / config.FPS);

  setInterval(function() {
    return slowLoop();
  }, 1000 / config.lowFPS);

  game.update = function(frameTime) {
    cubeManager.update(frameTime);
    return networkManager.sendPositions();
  };

  slowLoop = function() {
    return networkManager.sendPlayerList();
  };

}).call(this);
