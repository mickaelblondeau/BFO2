class LevelManager
  constructor: ->
    @level = 0
    @speed = config.levelSpeed
    @tweens = []
    @lastHeight = 0
    @savedLevel = 0

  launch: ->
    @nextLevel()

  reset: ->
    networkManager.sendResetLevel()
    cubeManager.reset()
    bossManager.reset()
    clearTimeout(networkManager.timeout)
    @level = @savedLevel
    @speed = config.levelSpeed

  moveStage: ->
    height = @lastHeight * 32
    networkManager.moveLevel(height)

  update: ->
    @level++
    @speed = config.levelSpeed - config.speedPerLevel * @level
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
    if @level in [4, 8, 12, 16, 20]
      @savedLevel = @level
      bossManager.saveBosses()
      networkManager.sendMessage('Checkpoint !')
    cubeManager.waiting = false
    bossManager.launched = false
    levelManager.nextLevel()