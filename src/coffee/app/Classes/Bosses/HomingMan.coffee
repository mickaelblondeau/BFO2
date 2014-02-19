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
      if part.target.skin.getAnimation() != 'dead'
        ratioX = 0.60
        ratioY = 0.40
        speedX = @attackSpeed * ratioX * frameTime + part.boostSpeed * frameTime
        speedY = @attackSpeed * ratioY * frameTime + part.boostSpeed * frameTime

        tmp = part.boostSpeed - 0.002
        if tmp <= 0
          part.boostSpeed = 0
        else
          part.boostSpeed = tmp

        tmp = part.shape.getX() + speedX
        if tmp > part.target.shape.getX()
          part.shape.setX(part.shape.getX() - speedX)
        else
          part.shape.setX(part.shape.getX() + speedX)

        tmp = part.shape.getY() + speedY
        if tmp < part.target.shape.getY() + part.target.shape.getHeight() / 2
          part.shape.setY(part.shape.getY() + speedY)
      else
        part.reset()

    if @attackFinished is @attacks
      @quitScreen(frameTime)

  quitScreen: (frameTime) ->
    tmp = @shape.getX() + @speed * frameTime
    if tmp < 800
      @shape.setX(tmp)
    else
      @finish()