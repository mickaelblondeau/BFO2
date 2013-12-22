class NetworkManager
  constructor: ->
    @socket = io.connect('http://localhost:8080')
    @players = []
    @listener()

  listener: ->
    self = @
    @socket.on 'fallingCube', (data) ->
      new FallingCube(data[0], data[1], data[2])
    @socket.on 'fallingBonus', (data) ->
      new Bonus(data[0], data[1], data[2])
    @socket.on 'resetLevel', ->
      levelManager.reset()
      player.reset()
    @socket.on 'clearLevel', ->
      levelManager.clearLevel()
    @socket.on 'moveLevel', (height) ->
      levelManager.moveLevel(height)
    @socket.on 'connection', (arr) ->
      self.players[arr[0]] = new VirtualPlayer(arr[1])
    @socket.on 'disconnect', (id) ->
      self.players[id].remove()
    @socket.on 'move', (arr) ->
      if self.players[arr[0]] isnt undefined
        self.players[arr[0]].move(arr[1], arr[2])
    @socket.on 'kill', (id) ->
      self.players[id].kill()

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