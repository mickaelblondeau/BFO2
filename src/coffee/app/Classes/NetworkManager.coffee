class NetworkManager
  constructor: ->
    @players = []
    @playersId = []

  connect: (ip, name, skin) ->
    @socket = io.connect('//'+ip)
    @socket.emit 'login', [name, skin]
    @listener()

  listener: ->
    self = @
    @socket.on 'connect', ->
      document.querySelector('#login-loading').innerHTML = 'Connected ! Waiting for the server to join...'

    @socket.on 'join', ->
      game.start()

    @socket.on 'fallingCube', (data) ->
      new FallingCube(data[0], data[1])

    @socket.on 'fallingBonus', (data) ->
      new Bonus(data[0], data[1], data[2])

    @socket.on 'fallingSpecial', (data) ->
      new SpecialCube(data[0], data[1], data[2])

    @socket.on 'fallingRandSpecial', (data) ->
      new SpecialCube(data[0], data[1], 5, data[2])

    @socket.on 'randomEvent', (data) ->
      new RandomEvent(data)

    @socket.on 'resetLevel', ->
      levelManager.reset()
      player.reset()

    @socket.on 'clearLevel', (level) ->
      levelManager.clearLevel()
      levelManager.level = level

    @socket.on 'moveLevel', (height) ->
      levelManager.moveLevel(height)

    @socket.on 'bonusTaken', (id) ->
      bonusManager.remove(id)

    @socket.on 'connection', (arr) ->
      self.players[arr[0]] = new VirtualPlayer(arr[0], arr[1], arr[2])
      self.playersId.push arr[0]

    @socket.on 'disconnect', (id) ->
      if self.players[id] isnt undefined
        self.players[id].destroy()

    @socket.on 'move', (arr) ->
      if self.players[arr[0]] isnt undefined
        self.players[arr[0]].move(arr[1], arr[2])

    @socket.on 'changeAnimation', (arr) ->
      if self.players[arr[0]] isnt undefined
        self.players[arr[0]].changeAnimation(arr[1])

    @socket.on 'changeAnimationSide', (arr) ->
      if self.players[arr[0]] isnt undefined
        self.players[arr[0]].changeSide(arr[1])

    @socket.on 'kill', (id) ->
      if self.players[id] isnt undefined
        self.players[id].kill()

    @socket.on 'spawnBoss', (arr) ->
      bossManager.spawn(arr[0], arr[1])

    @socket.on 'resurection', ->
      player.resurection()

    @socket.on 'debugMap', (map) ->
      if config.debug
        debugMap(map)

    @socket.on 'playerList', (arr) ->
      for id, i in self.playersId
        if arr.indexOf(id) is -1
          if self.players[id] isnt undefined
            self.players[id].destroy()
          self.playersId.splice(i, 1)

    @socket.on 'message', (arr) ->
      game.addMessage(arr[0], arr[1])

    @socket.on 'tpBonus', (id) ->
      if self.players[id] isnt undefined
        vPlayer = self.players[id]
        if vPlayer.shape.getY() + 64 < player.shape.getY()
          player.shape.setX(vPlayer.shape.getX())
          player.shape.setY(vPlayer.shape.getY())
          player.grabbing = false
          if vPlayer.skin.getAnimation() is 'couch' or vPlayer.skin.getAnimation() is 'couchMove'
            player.startCouch()
          player.jump = false
          new Effect(vPlayer.shape.getX() - 24, vPlayer.shape.getY(), SquareEnum.SMALL, 'tp', null, true)

    @socket.on 'sendJumpBlock', (coords) ->
      cubeManager.sendJumpBlock(coords[0], coords[1])

    @socket.on 'sendLootBonus', (coords) ->
      cubeManager.sendLootBonus(coords[0], coords[1], coords[2])

    @socket.on 'sendDeployedJumpBonus', (col) ->
      x = col * 32 + 160
      y = stage.getY() * -1
      cubeManager.sendJumpBlock(x, y)

  sendLaunch: ->
    @socket.emit 'launch'

  sendReset: ->
    @socket.emit 'reset'

  sendMove: (x, y) ->
    @socket.emit 'move', [parseInt(x), parseInt(y)]

  sendDie: ->
    @socket.emit 'die'

  sendRez: ->
    @socket.emit 'rez'

  sendMoveLevelOk: ->
    @socket.emit 'moveLevelOk'

  sendBonusTaken: (id) ->
    @socket.emit 'bonusTaken', id

  sendAnimation: (animation) ->
    @socket.emit 'changeAnimation', animation

  sendAnimationSide: (side) ->
    @socket.emit 'changeAnimationSide', side

  sendBossBeaten: ->
    @socket.emit 'bossBeaten'

  sendResurection: ->
    @socket.emit 'resurection'

  sendMessage: (message) ->
    @socket.emit 'message', message

  sendTp: ->
    @socket.emit 'tpBonus'

  sendJumpBlock: (x, y) ->
    cubeManager.sendJumpBlock(x, y)
    @socket.emit 'sendJumpBlock', [x, y]

  sendLootBonus: (x, y, id) ->
    cubeManager.sendLootBonus(x, y, id)
    @socket.emit 'sendLootBonus', [x, y, id]