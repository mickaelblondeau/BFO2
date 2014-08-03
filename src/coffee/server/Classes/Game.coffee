class Game
  constructor: ->
    @lastFrame = Date.now()
    @running = false
    @players = 0
    @timer = 0
    @restartTimer = null

  loop: ->
    thisFrame = Date.now()
    frameTime = thisFrame - @lastFrame
    @lastFrame = thisFrame
    @update(frameTime)

  reset: ->
    levelManager.reset()
    networkManager.joinPlayer()
    @running = false

  launch: ->
    levelManager.launch()
    @running = true
    @timer = config.timeBeforeStart

  autoLaunch: (frameTime) ->
    if @players > 0
      if @timer > 0
        @timer -= frameTime
      else
        @launch()