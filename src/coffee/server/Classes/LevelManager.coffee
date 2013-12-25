class LevelManager
  constructor: ->
    @level = 0
    @speed = config.levelSpeed
    @tweens = []
    @lastHeight = 0

  launch: ->
    @nextLevel()

  reset: ->
    networkManager.sendResetLevel()
    cubeManager.reset()
    clearTimeout(networkManager.timeout)
    @level = 0
    @speed = config.levelSpeed
    @bossRound = false

  moveStage: ->
    height = @lastHeight * 32
    networkManager.moveLevel(height)

  update: ->
    @level++
    @speed -= 50
    @moveStage()

  randomizeHeight: ->
    return Math.floor((Math.random()*3)+4)

  nextLevel: ->
    if !cubeManager.running
      clearTimeout(networkManager.timeout)
      @clearLevel()
      @lastHeight = @randomizeHeight()
      cubeManager.start(@lastHeight, @speed)

  clearLevel: ->
    networkManager.sendClearLevel()

  nextBoss: ->
    if !bossManager.launched
      bossManager.launch()

  passNextLevel: ->
    cubeManager.waiting = false
    bossManager.launched = false
    levelManager.nextLevel()