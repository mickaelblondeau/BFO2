class FreezeMan
  constructor: (id, pattern) ->
    @count = 4
    @intervalTime = 700
    @parts = []
    for i in [0..@count - 1]
      @parts.push new Boss(id, 'freezeman', -544, 0, 544, 32)

    @freeWidth = 64
    @top = stage.getY() * -1 - 128

    # 0 - 10
    # 19 - 29
    @attacks = [[10, 10, 26, 10], [19, 19, 19, 10], [10, 10, 29, 10]]
    @index = 0
    @subIndex = 0

    @start()

  attack: (level, index) ->
    @parts[index].shape.setX(128 + level * 32 - 544 + 32)
    @parts[index].shape.setY(@top)

    bossManager.tweens.push tween = new Kinetic.Tween
      node: @parts[index].shape
      duration: 2
      y: stage.getY() * -1 + config.levelHeight
    tween.play()

  loop: ->
    if @attacks[@index] isnt undefined
      if @attacks[@index][@subIndex] isnt undefined
        @attack(@attacks[@index][@subIndex], @subIndex)
        @subIndex++
      else
        @index++
        @subIndex = 0
    else
      clearInterval(@interval)
      @finish()

  start: ->
    self = @
    thisLoop = () ->
      self.loop()
    @interval = setInterval(thisLoop, @intervalTime)

  reset: ->
    for part in @parts
      part.reset()

  finish: ->
    for part in @parts
      part.shape.destroy()
    dynamicEntities.draw()
    networkManager.sendBossBeaten()