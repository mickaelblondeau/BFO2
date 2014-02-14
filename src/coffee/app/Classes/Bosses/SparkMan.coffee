class SparkMan extends MultiPartBoss
  constructor: (pattern) ->
    x = stage.getWidth()/2 - 32
    y = stage.getY() * -1 - 64
    super('sparkman', x, y, 64, 64)

    @speed = pattern[0][0]
    @attackSpeed = pattern[0][1]
    @interval = pattern[0][2]
    @attacks = pattern[1]

    @position = arena.y - levelManager.levelHeight - 512
    @time = 0
    @attackCount = 0
    @attackFinished = 0
    @attackIndex = 0
    @inPosition = false
    @start()

  genAttacks: ->
    attacks = []
    for i in [0..7]
      ySpeed = (Math.round(Math.random()*25+10))/100
      xSide = Math.round(Math.random()*2-1)
      ySide = 1
      if xSide is 0
        xSide = 1
      attacks.push([xSide, ySide, ySpeed])
    return attacks

  start: ->
    self = @
    bossManager.update = (frameTime) ->
      if !self.inPosition
        self.moveToPosition(frameTime)
      else if self.time >= self.interval
        self.time = 0
        self.attack()
      else if self.attackCount < self.attacks.length
        self.time += frameTime

      self.updateParts(frameTime)

  moveToPosition: (frameTime) ->
    tmp = @shape.getY() + @speed * frameTime
    if tmp < @position
      @shape.setY(tmp)
    else
      @shape.setY(@position)
      @inPosition = true
      @time = @interval * 0.75

  attack: ->
    @parts.push(new SparkManPart(@shape.getX(), @shape.getY() + 64, @attacks[@attackIndex]))
    @parts.push(new SparkManPart(@shape.getX(), @shape.getY() + 64, @attacks[@attackIndex+1]))
    @attackCount += 2
    @attackIndex += 2

  updateParts: (frameTime) ->
    for part in @parts
      tmpY = part.shape.getY() + part.ySpeed * frameTime * part.sideY
      if tmpY > arena.y - levelManager.levelHeight - 64
        part.shape.setY(arena.y - levelManager.levelHeight - 64)
        if part.changeSide('y')
          @attackFinished++
      if tmpY < @position - 96
        part.shape.setY(@position - 96)
        if part.changeSide('y')
          @attackFinished++
      part.shape.setY(tmpY)

      tmpX = part.shape.getX() + @attackSpeed * frameTime * part.sideX
      if tmpX < 160
        part.shape.setX(160)
        if part.changeSide('x')
          @attackFinished++
      if tmpX > stage.getWidth() - 224
        part.shape.setX(stage.getWidth() - 224)
        if part.changeSide('x')
          @attackFinished++
      part.shape.setX(tmpX)

    if @attackFinished is @attacks.length
      @quitScreen(frameTime)

  quitScreen: (frameTime) ->
    tmp = @shape.getX() + @speed * frameTime
    if tmp < 800
      @shape.setX(tmp)
    else
      @finish()