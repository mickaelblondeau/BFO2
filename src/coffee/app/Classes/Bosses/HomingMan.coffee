class HomingMan extends MultiPartBoss
  constructor: (pattern) ->
    x = stage.getWidth()/2 - 32
    y = stage.getY() * -1 - 64
    super('homingman', x, y, 64, 64)

    @speed = pattern[0][0]
    @attackSpeed = pattern[0][1]
    @attacks = pattern[1]
    @inPosition = 0
    @attackCount = 1

    @position = levelManager.ground - 384
    @start()

  start: ->
    self = @
    bossManager.update = (frameTime) ->
      if self.move(frameTime, self.shape.getX(), self.position)
        self.attack()
        self.speed = self.attackSpeed
        bossManager.update = (frameTime) ->
          self.updateParts(frameTime)

  attack: ->
    for attack in @attacks
      @parts.push(new HomingManPart(@shape.getX() + 16, @shape.getY() + 64, attack))

  updateParts: (frameTime) ->
    for part in @parts
      if part.pattern[part.index] isnt undefined
        pos = { x: parseInt(part.pattern[part.index][0]) * 352 + 160 }
        if part.index is 0
          pos.y = levelManager.ground - parseInt(part.pattern[0][1]) * 32
        else
          pos.y = part.shape.getY()
        if part.ready and !part.position and part.move(frameTime, pos.x, pos.y)
          @inPosition++
          part.position = true
          part.index++
    if @inPosition is 6
      if @attackCount is @attacks[0].length
        @quitScreen(frameTime)
      else
        @inPosition = 0
        @attackCount++
        for part in @parts
          part.position = false
          part.ready = false
          part.wait()

  quitScreen: (frameTime) ->
    for part in @parts
      part.move(frameTime, part.shape.getX(), part.shape.getY() + 100)
    if @move(frameTime, 800, @shape.getY())
      @finish()