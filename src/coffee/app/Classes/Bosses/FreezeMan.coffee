class FreezeMan
  constructor: (id, pattern) ->
    @speed = 0.4
    @counter = 0
    @interval = 1500
    @attacks = pattern
    @attackIndex = 0
    @count = 0
    @parts = []
    @levelHeight = arena.y - levelManager.levelHeight
    @start()
    @next()

  start: ->
    for i in [5..16]
      new Effect(i * 32, @levelHeight - 4, SquareEnum.SMALL, 'ice')
    self = @
    bossManager.update = (frameTime) ->
      self.counter += frameTime
      if self.counter >= self.interval
        self.counter = 0
        self.next()
      speed = frameTime * self.speed
      for part, i in self.parts
        if part isnt undefined
          tmp = part.shape.getY() + speed
          if tmp < self.levelHeight
            part.shape.setY(tmp)
          else
            part.shape.destroy()
            self.parts[i] = null
            self.count++
            if self.count is self.attacks.length * 2
              self.finish()
      self.parts = self.parts.filter(
        (e)->
          e
      )

  next: ->
    tmp = @attacks[@attackIndex]
    if tmp isnt undefined
      @parts.push new FreezeManPart(tmp[0]*32+128)
      @parts.push new FreezeManPart(tmp[1]*32+128)
      @attackIndex++

  reset: ->
    for part in @parts
      part.reset()

  finish: ->
    bossManager.stopUpdate()
    networkManager.sendBossBeaten()