networkManager = new NetworkManager()

game = new Game()

cubeManager = new CubeManager()
levelManager = new LevelManager()
bossManager = new BossManager()

setInterval(
  () ->
    game.loop()
  , 1000/config.FPS)

game.update = (frameTime) ->
  cubeManager.update(frameTime)
  networkManager.sendPositions()