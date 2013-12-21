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
    @level = 0
    @speed = config.levelSpeed

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
      @clearLevel()
      @lastHeight = @randomizeHeight()
      cubeManager.start(@lastHeight, @speed)

  clearLevel: ->
    networkManager.sendClearLevel()