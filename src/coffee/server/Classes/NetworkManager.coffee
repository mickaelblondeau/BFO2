class NetworkManager
  constructor: ->
    @io = require('socket.io').listen(8080)
    @waitingFor = 0
    @responseOk = 0
    @listener()

  listener: ->
    self = @
    @io.sockets.on 'connection', (socket) ->

      players = self.io.sockets.clients()
      for player in players
        if player.id != socket.id
          player.get 'name', (error, name) ->
            socket.emit 'connection', [player.id, name]
          player.get 'position', (error, position) ->
            if position isnt null
              socket.emit 'move', [player.id, position.x, position.y]

      name = 'Chy'
      socket.set('name', name)

      socket.broadcast.emit 'connection', [socket.id, name]

      socket.on 'launch', ->
        game.launch()
      socket.on 'reset', ->
        game.reset()
        self.sendResetLevel()
      socket.on 'move', (arr) ->
        socket.set('position', {x: parseInt(arr[0]), y: parseInt(arr[1])})
      socket.on 'die', ->
        socket.broadcast.emit 'kill', socket.id
      socket.on 'changeAnimation', (animation) ->
        socket.broadcast.emit 'changeAnimation', [socket.id, animation]
      socket.on 'changeAnimationSide', (side) ->
        socket.broadcast.emit 'changeAnimationSide', [socket.id, side]
      socket.on 'moveLevelOk', ->
        self.responseOk++
        if self.responseOk >= self.waitingFor
          levelManager.nextBoss()
      socket.on 'bonusTaken', (bonusId) ->
        socket.broadcast.emit 'bonusTaken', bonusId
      socket.on 'bossBeaten', ->
        self.responseOk++
        if self.responseOk >= self.waitingFor
          levelManager.passNextLevel()
      socket.on 'resurection', ->
        socket.broadcast.emit 'resurection'
      socket.on 'disconnect', ->
        socket.broadcast.emit 'disconnect', socket.id

  sendCube: (col, size, dest) ->
    @io.sockets.emit('fallingCube', [col, size, dest])

  sendBonus: (col, bonus, dest, id) ->
    @io.sockets.emit('fallingBonus', [col, dest, bonus, id])

  sendResetLevel: ->
    @io.sockets.emit 'resetLevel'

  sendClearLevel: ->
    @io.sockets.emit 'clearLevel'

  moveLevel: (height) ->
    @waitForAll(levelManager.nextBoss, config.timeout)
    @io.sockets.emit 'moveLevel', height

  sendBoss: (boss, options, timeout) ->
    @waitForAll(levelManager.passNextLevel, config.timeout + timeout)
    @io.sockets.emit 'spawnBoss', [boss, options]

  sendPositions: ->
    self = @
    players = @io.sockets.clients()
    for player in players
      player.get 'position', (error, position) ->
        if position isnt null
          player.get 'oldPosition', (error, oldPosition) ->
            if oldPosition is null or oldPosition isnt position
              self.io.sockets.emit 'move', [player.id, position.x, position.y]
              player.set 'oldPosition', position

  waitForAll: (callback, time) ->
    @waitingFor = @io.sockets.clients().length
    @responseOk = 0
    @timeout = setTimeout(callback, time)