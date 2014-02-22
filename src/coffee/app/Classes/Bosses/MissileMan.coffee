class MissileMan extends MultiPartBoss
  constructor: (pattern) ->
    super('missileman', -512, 0, 0, 0)

    @speed = pattern[0][0]
    @interval = pattern[0][1]
    @attacks = pattern[1]

    @time = 0
    @attackCount = 0
    @attackFinished = 0
    @attackIndex = 0

    @ground = arena.y - levelManager.levelHeight

    @start()

  start: ->
    self = @
    bossManager.update = (frameTime) ->
      if self.time >= self.interval
        self.time = 0
        self.attack()
      else if self.attackCount < self.attacks.length
        self.time += frameTime
      self.updateParts(frameTime)

  attack: ->
    @parts.push(new MissileManPart(@attacks[@attackIndex][0], @ground, @attacks[@attackIndex][1]))
    @attackCount++
    @attackIndex++

  updateParts: (frameTime) ->
    for part in @parts
      speed = frameTime * @speed
      if part.launching
        part.shape.setY(part.shape.getY() - speed)
        part.effect.shape.setY(part.effect.shape.getY() - speed)

        sky = @ground - 1024
        if part.shape.getY() < sky
          part.launching = false
          part.shape.setY(sky)
          part.changeSide(-1)
          part.shape.setX(part.destination)
          part.effect.shape.setX(part.destination)
      else
        part.shape.setY(part.shape.getY() + speed)
        part.effect.shape.setY(part.effect.shape.getY() + speed)

        if part.shape.getY() >= @ground
          part.reset()

    if @attackFinished is @attacks.length
      @finish()