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
    self = @
    bossManager.update = (frameTime) ->
      self.counter += frameTime
      if self.counter >= self.interval
        self.counter = 0
        self.next()
      for part, i in self.parts
        if part isnt undefined
          tmp = part.shape.getY() + frameTime * self.speed
          if tmp < self.levelHeight
            part.shape.setY(tmp)
          else
            part.shape.destroy()
            self.count++
            if self.count is self.attacks.length
              self.finish()
            self.parts.splice(i, 1)

  next: ->
    tmp = @attacks[@attackIndex]
    if tmp isnt undefined
      @parts.push new FreezeManPart(tmp*32+128)
      @attackIndex++

  reset: ->
    for part in @parts
      part.reset()

  finish: ->
    bossManager.stopUpdate()
    networkManager.sendBossBeaten()