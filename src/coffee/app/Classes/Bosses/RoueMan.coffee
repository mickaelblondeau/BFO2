class RoueMan extends Boss
  constructor: (pattern) ->
    x = stage.getWidth()/2 - 32
    y = levelManager.ground - 1024
    super('roueman', x, y, 64, 64)
    @attacks = pattern[1]
    @attackIndex = 0
    @speed = pattern[0]
    @start()

  start: ->
    @next()
    self = @
    bossManager.update = (frameTime) ->
      if self.move(frameTime, self.attack.x, self.attack.y)
        self.next()

  next: ->
    tmp = @attacks[@attackIndex]
    if tmp isnt undefined
      @attack = { x: @shape.getX() + tmp[0]*32, y: @shape.getY() + tmp[1]*32 }
      @attackIndex++
    else
      @finish()