(function() {
  var CubeManager, Game, LevelManager, NetworkManager, SquareEnum, config, cubeManager, game, levelManager, networkManager;

  config = {
    FPS: 60,
    levelSpeed: 1000
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

  CubeManager = (function() {
    function CubeManager() {
      this.map = [];
      this.resetMap();
      this.updateRate = 0;
      this.current = 0;
      this.levelHeight = 0;
      this.running = false;
      this.waiting = false;
      this.bonusId = 0;
      this.types = [
        {
          proba: 5,
          size: SquareEnum.SMALL,
          width: SquareEnum.SMALL.x / 32,
          height: SquareEnum.SMALL.y / 32,
          bonus: 'doubleJump'
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
        this.updateRate = rate;
        this.current = 0;
        this.levelHeight += level;
        return this.running = true;
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
        if (type.bonus !== void 0) {
          networkManager.sendBonus(choice.column, type.bonus, choice.height, this.bonusId);
          this.bonusId++;
        } else {
          networkManager.sendCube(choice.column, type.size, choice.height);
          for (columnPosition = _i = 1, _ref = type.width; 1 <= _ref ? _i <= _ref : _i >= _ref; columnPosition = 1 <= _ref ? ++_i : --_i) {
            this.map[choice.column + columnPosition - 1] = choice.height + type.height;
          }
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
      rand = Math.floor(Math.random() * randomCount) + 1;
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
      this.level = 0;
      return this.speed = config.levelSpeed;
    };

    LevelManager.prototype.moveStage = function() {
      var height;
      height = this.lastHeight * 32;
      return networkManager.moveLevel(height);
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
      if (!cubeManager.running) {
        this.clearLevel();
        this.lastHeight = this.randomizeHeight();
        return cubeManager.start(this.lastHeight, this.speed);
      }
    };

    LevelManager.prototype.clearLevel = function() {
      return networkManager.sendClearLevel();
    };

    return LevelManager;

  })();

  NetworkManager = (function() {
    function NetworkManager() {
      this.io = require('socket.io').listen(8080);
      this.players = [];
      this.playersCached = [];
      this.playersIds = [];
      this.currentId = 0;
      this.listener();
    }

    NetworkManager.prototype.listener = function() {
      var self;
      self = this;
      return this.io.sockets.on('connection', function(socket) {
        var id, removeList, _i, _j, _len, _len1, _ref;
        removeList = [];
        _ref = self.playersIds;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          id = _ref[_i];
          if (self.players[id] !== void 0) {
            socket.emit('connection', [id, self.players[id].name]);
            socket.emit('move', [id, self.players[id].x, self.players[id].y]);
          } else {
            removeList.push(id);
          }
        }
        for (_j = 0, _len1 = removeList.length; _j < _len1; _j++) {
          id = removeList[_j];
          delete self.playersIds[id];
        }
        id = self.currentId.toString(32);
        self.currentId++;
        self.playersIds.push(id);
        self.players[id] = {
          name: "Chy"
        };
        socket.broadcast.emit('connection', [id, self.players[id].name]);
        socket.on('launch', function() {
          return game.launch();
        });
        socket.on('reset', function() {
          game.reset();
          return self.sendResetLevel();
        });
        socket.on('move', function(arr) {
          self.players[id].x = parseInt(arr[0]);
          return self.players[id].y = parseInt(arr[1]);
        });
        socket.on('die', function() {
          return socket.broadcast.emit('kill', id);
        });
        socket.on('changeAnimation', function(animation) {
          return socket.broadcast.emit('changeAnimation', [id, animation]);
        });
        socket.on('changeAnimationSide', function(side) {
          return socket.broadcast.emit('changeAnimationSide', [id, side]);
        });
        socket.on('moveLevelOk', function() {
          cubeManager.waiting = false;
          return levelManager.nextLevel();
        });
        socket.on('bonusTaken', function(bonusId) {
          return socket.broadcast.emit('bonusTaken', bonusId);
        });
        return socket.on('disconnect', function() {
          socket.broadcast.emit('disconnect', id);
          return delete self.players[id];
        });
      });
    };

    NetworkManager.prototype.sendCube = function(col, size, dest) {
      return this.io.sockets.emit('fallingCube', [col, size, dest]);
    };

    NetworkManager.prototype.sendBonus = function(col, bonus, dest, id) {
      return this.io.sockets.emit('fallingBonus', [col, dest, bonus, id]);
    };

    NetworkManager.prototype.sendResetLevel = function() {
      return this.io.sockets.emit('resetLevel');
    };

    NetworkManager.prototype.sendClearLevel = function() {
      return this.io.sockets.emit('clearLevel');
    };

    NetworkManager.prototype.moveLevel = function(height) {
      return this.io.sockets.emit('moveLevel', height);
    };

    NetworkManager.prototype.sendPositions = function() {
      var id, _i, _len, _ref, _results;
      _ref = this.playersIds;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        if (this.players[id] !== void 0 && (this.playersCached[id] === void 0 || (this.playersCached[id].x !== this.players[id].x || this.playersCached[id].y !== this.players[id].y))) {
          this.io.sockets.emit('move', [id, this.players[id].x, this.players[id].y]);
          _results.push(this.playersCached[id] = {
            x: this.players[id].x,
            y: this.players[id].y
          });
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return NetworkManager;

  })();

  networkManager = new NetworkManager();

  game = new Game();

  cubeManager = new CubeManager();

  levelManager = new LevelManager();

  setInterval(function() {
    return game.loop();
  }, 1000 / config.FPS);

  game.update = function(frameTime) {
    cubeManager.update(frameTime);
    return networkManager.sendPositions();
  };

}).call(this);
