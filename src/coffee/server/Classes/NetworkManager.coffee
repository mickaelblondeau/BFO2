class NetworkManager
  constructor: ->
    @io = require('socket.io').listen(8080)
    @players = []
    @playersCached = []
    @playersIds = []
    @currentId = 0
    @waitingFor = 0
    @responseOk = 0
    @listener()

  listener: ->
    self = @
    @io.sockets.on 'connection', (socket) ->

      removeList = []
      for id in self.playersIds
        if self.players[id] isnt undefined
          socket.emit 'connection', [id, self.players[id].name]
          socket.emit 'move', [id, self.players[id].x, self.players[id].y]
        else
          removeList.push id

      for id in removeList
        delete self.playersIds[id]

      id = self.currentId.toString(32)
      self.currentId++
      self.playersIds.push id
      self.players[id] = { name: "Chy" }

      socket.broadcast.emit 'connection', [id, self.players[id].name]

      socket.on 'launch', ->
        game.launch()
      socket.on 'reset', ->
        game.reset()
        self.sendResetLevel()
      socket.on 'move', (arr) ->
        self.players[id].x = parseInt(arr[0])
        self.players[id].y = parseInt(arr[1])
      socket.on 'die', ->
        socket.broadcast.emit 'kill', id
      socket.on 'changeAnimation', (animation) ->
        socket.broadcast.emit 'changeAnimation', [id, animation]
      socket.on 'changeAnimationSide', (side) ->
        socket.broadcast.emit 'changeAnimationSide', [id, side]
      socket.on 'moveLevelOk', ->
        self.responseOk++
        if self.responseOk >= self.waitingFor
          cubeManager.waiting = false
          levelManager.nextLevel()
      socket.on 'bonusTaken', (bonusId) ->
        socket.broadcast.emit 'bonusTaken', bonusId
      socket.on 'bossBeaten', ->
        self.responseOk++
        if self.responseOk >= self.waitingFor
          cubeManager.waiting = false
          levelManager.nextLevel()
      socket.on 'disconnect', ->
        socket.broadcast.emit 'disconnect', id
        delete self.players[id]

  sendCube: (col, size, dest) ->
    @io.sockets.emit('fallingCube', [col, size, dest])

  sendBonus: (col, bonus, dest, id) ->
    @io.sockets.emit('fallingBonus', [col, dest, bonus, id])

  sendResetLevel: ->
    @io.sockets.emit 'resetLevel'

  sendClearLevel: ->
    @io.sockets.emit 'clearLevel'

  moveLevel: (height) ->
    callback = ->
      cubeManager.waiting = false
      levelManager.nextLevel()
    @waitForAll(callback, config.timeout)
    @io.sockets.emit 'moveLevel', height

  sendBoss: (boss, options, timeout) ->
    callback = ->
      cubeManager.waiting = false
      levelManager.nextLevel()
    @waitForAll(callback, config.timeout + timeout)
    @io.sockets.emit 'spawnBoss', [boss, options]

  sendPositions: ->
    for id in @playersIds
      if @players[id] isnt undefined and (@playersCached[id] is undefined or (@playersCached[id].x isnt @players[id].x or @playersCached[id].y isnt @players[id].y))
        @io.sockets.emit 'move', [id, @players[id].x, @players[id].y]
        @playersCached[id] = { x: @players[id].x, y: @players[id].y }

  waitForAll: (callback, time) ->
    @waitingFor = @players.length
    @responseOk = 0
    @timeout = setTimeout(callback, time)

  forceAllReady: (count) ->
    @responseOk = count
