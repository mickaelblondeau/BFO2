class HomingMan extends MultiPartBoss
  constructor: (pattern) ->
    x = stage.getWidth()/2 - 32
    y = stage.getY() * -1 - 64
    super('homingman', x, y, 64, 64)

    @speed = pattern[0][0]
    @attackSpeed = pattern[0][1]
    @interval = pattern[0][2]
    @attacks = pattern[1]
    @partLife = pattern[0][2]

    @position = arena.y - levelManager.levelHeight - 384
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
        self.moveToPosition(frameTime)
      else if self.time >= self.interval
        self.time = 0
        self.attack()
      else if self.attackCount < self.attacks
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
    for id, i in networkManager.playersId
      if networkManager.players[id] isnt undefined
        @parts.push(new HomingManPart(@shape.getX(), @shape.getY() + 64, @partLife, networkManager.players[id]))
        @attackCount++
    @parts.push(new HomingManPart(@shape.getX(), @shape.getY() + 64, @partLife, player))
    @attackCount++

  updateParts: (frameTime) ->
    for part in @parts
      ratioX = part.ratioX
      ratioY = 1

      speedX = @attackSpeed * ratioX * frameTime
      speedY = @attackSpeed * ratioY * frameTime

      tmp = part.shape.getX() + speedX
      if tmp > part.target.shape.getX()
        part.shape.setX(part.shape.getX() - speedX)
      else
        part.shape.setX(part.shape.getX() + speedX)

      part.shape.setY(part.shape.getY() + speedY)

      if part.ratioX - 0.015 > 0.1
        part.ratioX -= 0.015
      else
        part.ratioX = 0.1

      if part.shape.getY() > arena.y - levelManager.levelHeight
        part.reset()

    if @attackFinished is @attacks
      @quitScreen(frameTime)

  quitScreen: (frameTime) ->
    tmp = @shape.getX() + @speed * frameTime
    if tmp < 800
      @shape.setX(tmp)
    else
      @finish()