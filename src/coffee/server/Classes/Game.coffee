class Game
  constructor: ->
    @lastFrame = Date.now()

  loop: ->
    thisFrame = Date.now()
    frameTime = thisFrame - @lastFrame
    @lastFrame = thisFrame
    @update(frameTime)

  reset: ->
    levelManager.reset()
    networkManager.joinPlayer()

  launch: ->
    levelManager.launch()