class SparkMan extends MultiPartBoss
  constructor: (pattern) ->
    x = stage.getWidth()/2 - 32
    y = stage.getY() * -1 - 64
    super('sparkman', x, y, 64, 64)

    @speed = pattern[0][0]
    @attackSpeed = pattern[0][1]
    @interval = pattern[0][2]
    @attacks = pattern[1]

    @position = levelManager.ground - 512
    @time = 0
    @attackCount = 0
    @attackFinished = 0
    @attackIndex = 0
    @inPosition = false
    @start()

  start: ->
    self = @
    bossManager.update = (frameTime) ->
      if !self.inPosition
        if self.move(frameTime, self.shape.getX(), self.position)
          self.inPosition = true
          self.time = self.interval * 0.75
      else if self.time >= self.interval
        self.time = 0
        self.attack()
      else if self.attackCount < self.attacks.length
        self.time += frameTime
      self.updateParts(frameTime)

  attack: ->
    @parts.push(new SparkManPart(@shape.getX() + 16, @shape.getY() + 64, @attacks[@attackIndex]))
    @parts.push(new SparkManPart(@shape.getX() + 16, @shape.getY() + 64, @attacks[@attackIndex+1]))
    @attackCount += 2
    @attackIndex += 2

  updateParts: (frameTime) ->
    for part in @parts
      vX = @attackSpeed * frameTime * part.sideX
      vY = part.ySpeed * frameTime * part.sideY
      collisions = part.vectorMove(frameTime, vX, vY, 160, stage.getWidth() - 192, @position - 96, levelManager.ground - 32)
      if collisions.mX
        part.sideX = 1
      if collisions.pX
        part.sideX = -1
      if collisions.mY
        part.sideY = 1
      if collisions.pY
        part.sideY = -1

      if part.alive
        part.life += frameTime
        if part.life > @interval * 2
          part.reset()

    if @attackFinished is @attacks.length
      @quitScreen(frameTime)

  quitScreen: (frameTime) ->
    if @move(frameTime, 800, @shape.getY())
      @finish()