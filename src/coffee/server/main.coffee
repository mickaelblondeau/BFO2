networkManager = new NetworkManager()

game = new Game()

cubeManager = new CubeManager()
levelManager = new LevelManager()
bossManager = new BossManager()

setInterval(
  () ->
    game.loop()
, 1000/config.FPS
)

setInterval(
  () ->
    slowLoop()
, 1000/config.lowFPS
)

game.update = (frameTime) ->
  cubeManager.update(frameTime)
  networkManager.sendPositions()

slowLoop = () ->
  networkManager.sendPlayerList()
  if (cubeManager.running or bossManager.launched) and Math.random() > config.randomEventProb
    id = Math.floor((Math.random()*bonusEvents.length))
    new Event(id)