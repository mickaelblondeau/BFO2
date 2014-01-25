class NetworkManager
  constructor: ->
    @players = []
    @playersId = []

  connect: (ip, name) ->
    @socket = io.connect('http://'+ip+':8080')
    @socket.emit 'login', name
    @listener()

  listener: ->
    self = @
    @socket.on 'fallingCube', (data) ->
      new FallingCube(data[0], data[1], data[2])
    @socket.on 'fallingBonus', (data) ->
      new Bonus(data[0], data[1], data[2], data[3])
    @socket.on 'fallingSpecial', (data) ->
      new SpecialCube(data[0], data[1], data[2], data[3])
    @socket.on 'resetLevel', ->
      levelManager.reset()
      player.reset()
    @socket.on 'clearLevel', ->
      levelManager.clearLevel()
    @socket.on 'moveLevel', (height) ->
      levelManager.moveLevel(height)
    @socket.on 'bonusTaken', (id) ->
      bonusManager.remove(id)
    @socket.on 'connection', (arr) ->
      self.players[arr[0]] = new VirtualPlayer(arr[1])
      self.playersId.push arr[0]
    @socket.on 'disconnect', (id) ->
      self.players[id].remove()
    @socket.on 'move', (arr) ->
      if self.players[arr[0]] isnt undefined
        self.players[arr[0]].move(arr[1], arr[2])
    @socket.on 'changeAnimation', (arr) ->
      self.players[arr[0]].changeAnimation(arr[1])
    @socket.on 'changeAnimationSide', (arr) ->
      self.players[arr[0]].changeSide(arr[1])
    @socket.on 'kill', (id) ->
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
            self.players[id].remove()
          self.playersId.splice(i, 1)
    @socket.on 'message', (arr) ->
      game.addMessage(self.players[arr[0]].name.getText(), arr[1])

  sendLaunch: ->
    @socket.emit 'launch'

  sendReset: ->
    @socket.emit 'reset'

  sendMove: (x, y) ->
    @socket.emit 'move', [parseInt(x), parseInt(y)]

  sendDie: ->
    @socket.emit 'die'

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