networkManager = new NetworkManager process.env.PORT

game = new Game()

cubeManager = new CubeManager()
levelManager = new LevelManager()
bossManager = new BossManager()
commandManager = new CommandManager()

setInterval(
  () ->
    game.loop()
, 1000/config.FPS
)

setInterval(
  () ->
    networkManager.updatePlayerList()
, 500
)

setInterval(
  () ->
    slowLoop()
, 1000/config.lowFPS
)

game.update = (frameTime) ->
  networkManager.sendPositions()
  if game.running
    cubeManager.update(frameTime)
    if game.players is game.deadPlayers and game.restartTimer is null
      fn = ->
        game.reset()
      game.restartTimer = setTimeout(fn, config.timeBeforeReset)
  else
    game.autoLaunch(frameTime)

slowLoop = () ->
  networkManager.sendPlayerList()
  if (cubeManager.running or bossManager.launched) and Math.random() > config.randomEventProb
    new Event()