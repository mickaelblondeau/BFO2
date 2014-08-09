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
    speed = config.levelSpeed - config.speedPerLevel * @level
    if speed < config.maxLevelSpeed
      @speed = config.levelSpeed - config.speedPerLevel * @level
    else
      @speed = config.maxLevelSpeed
    @moveStage()

  randomizeHeight: ->
    min = Math.round(config.minLevel+@level/2)
    max = Math.round(config.maxLevel+@level/2)
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
    if @level in config.checkpoints
      @savedLevel = @level
      bossManager.saveBosses()
      networkManager.sendMessage('Checkpoint !')
    cubeManager.waiting = false
    bossManager.launched = false
    levelManager.nextLevel()

  setDifficulty: (level) ->
    if level is 'hell'
      networkManager.sendMessage('Difficulty changed to hell.')
      networkManager.sendMessage('You shall not pass.')
      @difficultyHell()
      return false
    else if level is 'hard'
      networkManager.sendMessage('Difficulty changed to hard.')
      @difficultyHard()
      return false
    else if level is 'medium'
      networkManager.sendMessage('Difficulty changed to medium.')
      @difficultyMedium()
      return false
    else if level is 'easy'
      networkManager.sendMessage('Difficulty changed to easy.')
      @difficultyEasy()
      return false
    else
      'Difficulty not changed, invalid option.'

  difficultyHell: ->
    config.levelSpeed = 600
    config.fastLevelSpeed = 300
    config.speedPerLevel = 40
    config.randomEventProb = 0.8
    config.minLevel = 6
    config.maxLevel = 12
    config.bossDifficulty = 3
    @restart()

  difficultyHard: ->
    config.levelSpeed = 800
    config.fastLevelSpeed = 400
    config.speedPerLevel = 35
    config.randomEventProb = 0.7
    config.minLevel = 6
    config.maxLevel = 12
    config.bossDifficulty = 2
    @restart()

  difficultyMedium: ->
    config.levelSpeed = 1000
    config.fastLevelSpeed = 500
    config.speedPerLevel = 35
    config.randomEventProb = 0.6
    config.minLevel = 6
    config.maxLevel = 10
    config.bossDifficulty = 1
    @restart()

  difficultyEasy: ->
    config.levelSpeed = 1200
    config.fastLevelSpeed = 600
    config.speedPerLevel = 30
    config.randomEventProb = 0.5
    config.minLevel = 4
    config.maxLevel = 8
    config.bossDifficulty = 0
    @restart()

  restart: ->
    @savedLevel = 0
    bossManager.restart()
    @reset()