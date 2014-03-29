class NetworkManager
  constructor: ->
    @io = require('socket.io').listen(8080)
    @io.enable('browser client minification')
    @io.enable('browser client etag')
    @io.enable('browser client gzip')
    @io.set('log level', 1)
    @waitingFor = 0
    @responseOk = 0
    @listener()

  listener: ->
    self = @
    @io.sockets.on 'connection', (socket) ->

      socket.on 'login', (arr) ->
        socket.set('name', arr[0])
        socket.set('skin', arr[1])
        socket.set('inGame', false)
        if !cubeManager.running and !bossManager.launched
          self.joinGame(socket)
        else
          socket.broadcast.emit 'message', [null, arr[0] + ' is waiting to join !']

      socket.on 'launch', ->
        if socket.id is self.io.sockets.clients()[0].id
          game.launch()

      socket.on 'reset', ->
        if socket.id is self.io.sockets.clients()[0].id
          game.reset()
          self.sendResetLevel()

      socket.on 'die', ->
        socket.broadcast.emit 'kill', socket.id

      socket.on 'move', (arr) ->
        socket.set('position', {x: parseInt(arr[0]), y: parseInt(arr[1])})

      socket.on 'changeAnimation', (animation) ->
        socket.set('animation', animation)

      socket.on 'changeAnimationSide', (side) ->
        socket.set('animationSide', side)

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

      socket.on 'message', (message) ->
        socket.broadcast.emit 'message', [socket.id, message]

      socket.on 'disconnect', ->
        socket.broadcast.emit 'disconnect', socket.id
        socket.get 'name', (error, name) ->
          socket.broadcast.emit 'message', [null, name + ' has left the game !']

  sendCube: (col, size) ->
    @io.sockets.emit('fallingCube', [col, size])

  sendBonus: (col, bonus, id) ->
    @io.sockets.emit('fallingBonus', [col, bonus, id])

  sendSpecial: (col, size, type) ->
    @io.sockets.emit('fallingSpecial', [col, size, type])

  sendRanSpecial: (col, size, type) ->
    @io.sockets.emit('fallingRandSpecial', [col, size, type])

  sendRandomEvent: (type) ->
    @io.sockets.emit('randomEvent', type)

  sendResetLevel: ->
    @io.sockets.emit 'resetLevel'

  sendClearLevel: ->
    @io.sockets.emit 'clearLevel', levelManager.level

  moveLevel: (height) ->
    callback = ->
      levelManager.nextBoss()
    @waitForAll(callback, config.timeout)
    @io.sockets.emit 'moveLevel', height

  sendBoss: (boss, options, timeout) ->
    callback = ->
      levelManager.passNextLevel()
    @waitForAll(callback, config.timeout + timeout)
    @sendClearLevel()
    @io.sockets.emit 'spawnBoss', [boss, options]

  sendPositions: ->
    self = @
    players = @io.sockets.clients()
    for player in players
      player.get 'cachedData', (error, cachedData) ->
        player.get 'position', (error, position) ->
          if cachedData is null
            cachedData = { }
          if position isnt null and cachedData.position isnt position
            self.io.sockets.emit 'move', [player.id, position.x, position.y]
            cachedData.position = position

        player.get 'animation', (error, animation) ->
          if animation isnt null and cachedData.animation isnt animation
            self.io.sockets.emit 'changeAnimation', [player.id, animation]
            cachedData.animation = animation

        player.get 'animationSide', (error, animationSide) ->
          if animationSide isnt null and cachedData.animationSide isnt animationSide
            self.io.sockets.emit 'changeAnimationSide', [player.id, animationSide]
            cachedData.animationSide = animationSide

        player.set 'cachedData', cachedData

  waitForAll: (callback, time) ->
    @waitingFor = @io.sockets.clients().length
    @responseOk = 0
    @timeout = setTimeout(callback, time)

  sendPlayerList: ->
    list = []
    players = @io.sockets.clients()
    for player in players
      list.push player.id
    @io.sockets.emit 'playerList', list
    if list.length is 0
      game.reset()

  sendMap: (map) ->
    @io.sockets.emit 'debugMap', map

  sendMessage: (message) ->
    @io.sockets.emit 'message', [null, message]

  joinPlayer: ->
    players = @io.sockets.clients()
    for player in players
      @joinGame(player)

  joinGame: (socket) ->
    self = @
    socket.get 'inGame', (error, ig) ->
      if ig is false
        socket.set 'inGame', true
        socket.emit 'join'
        socket.get 'name', (error, name) ->
          socket.get 'skin', (error, skin) ->
            socket.broadcast.emit 'connection', [socket.id, name, skin]
            socket.broadcast.emit 'message', [null, name + ' has joined the game !']
        players = self.io.sockets.clients()
        for player in players
          if player.id != socket.id
            player.get 'name', (error, name) ->
              player.get 'skin', (error, skin) ->
                socket.emit 'connection', [player.id, name, skin]
            player.get 'position', (error, position) ->
              if position isnt null
                socket.emit 'move', [player.id, position.x, position.y]
            player.get 'animation', (error, animation) ->
              if animation isnt null
                socket.emit 'changeAnimation', [player.id, animation]
            player.get 'animationSide', (error, animationSide) ->
              if animationSide isnt null
                socket.emit 'changeAnimationSide', [player.id, animationSide]