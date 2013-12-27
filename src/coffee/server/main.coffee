networkManager = new NetworkManager()

game = new Game()

cubeManager = new CubeManager()
levelManager = new LevelManager()
bossManager = new BossManager()

setInterval(
  () ->
    game.loop()
  , 1000/config.FPS)

setInterval(
  () ->
    slowLoop()
, 1000/config.lowFPS)

game.update = (frameTime) ->
  cubeManager.update(frameTime)
  networkManager.sendPositions()

slowLoop = () ->
  networkManager.sendPlayerList()