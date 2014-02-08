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
    bossManager.reset()
    clearTimeout(networkManager.timeout)
    @level = 0
    @speed = config.levelSpeed
    @bossRound = false

  moveStage: ->
    height = @lastHeight * 32
    networkManager.moveLevel(height)

  update: ->
    @level++
    @speed -= config.speedPerLevel
    @moveStage()

  randomizeHeight: ->
    min = Math.round(4+@level/2)
    max = Math.round(8+@level/2)
    return Math.floor((Math.random()*(max-min))+min)

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
      clearTimeout(networkManager.timeout)
      bossManager.launch()

  passNextLevel: ->
    cubeManager.waiting = false
    bossManager.launched = false
    levelManager.nextLevel()