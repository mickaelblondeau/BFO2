nconf = require 'nconf'

nconf.argv().env()

nconf.file {
    file: __dirname + '/../config.json'
}

nconf.defaults {
    port: 80
}

networkManager = new NetworkManager nconf.get 'port'

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
    slowLoop()
, 1000/config.lowFPS
)

game.update = (frameTime) ->
  cubeManager.update(frameTime)
  networkManager.sendPositions()

slowLoop = () ->
  networkManager.sendPlayerList()
  if (cubeManager.running or bossManager.launched) and Math.random() > config.randomEventProb
    new Event()