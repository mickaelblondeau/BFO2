class NetworkManager
  constructor: ->
    @io = require('socket.io').listen(8080)
    @players = []
    @playersIds = []
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

      id = socket.id
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

      socket.on 'moveLevelOk', ->
        cubeManager.waiting = false
        levelManager.nextLevel()

      socket.on 'disconnect', ->
        socket.broadcast.emit 'disconnect', socket.id
        delete self.players[socket.id]

  sendCube: (col, size, dest) ->
    @io.sockets.emit('fallingCube', [col, size, dest])

  sendResetLevel: ->
    @io.sockets.emit 'resetLevel'

  sendClearLevel: ->
    @io.sockets.emit 'clearLevel'

  moveLevel: (height) ->
    @io.sockets.emit 'moveLevel', height

  sendPositions: ->
    for id in @playersIds
      if @players[id] isnt undefined
        @io.sockets.emit 'move', [id, @players[id].x, @players[id].y]