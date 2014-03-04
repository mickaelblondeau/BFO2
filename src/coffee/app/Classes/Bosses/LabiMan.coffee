class LabiMan extends MultiPartBoss
  constructor: (pattern) ->
    x = 256
    y = stage.getY() * -1
    @oldPos = { x: x, y: y }
    super('labiman', x, y, 64, 64)

    @attacks = pattern[1]
    @speed = pattern[0][0]
    @attackSpeed = pattern[0][1]
    @wait = pattern[0][2]
    @maxHeight = @getMaxHeight()

    @waiting = false
    @attacking = false
    @index = 0
    @waitTime = 0

    @start()

  getMaxHeight: ->
    max = 0
    for attack in @attacks
      if attack[1] > max
        max = attack[1]
    return max

  start: ->
    self = @
    @parts.push(new LabiManPart())
    bossManager.update = (frameTime) ->
      if !self.waiting
        if self.move(frameTime, self.attacks[self.index][0]*32 + 160, levelManager.ground - self.attacks[self.index][1]*32)
          self.index++
          self.placeBlock()
          if self.attacks[self.index] is undefined
            self.waiting = true
      else
        self.bossEscape(frameTime)
      if self.attacking
        self.attack(frameTime)
      self.waitTime += frameTime
      if !self.attacking and self.waitTime >= self.wait
        self.attacking = true

  attack: (frameTime) ->
    tmp = @parts[0].shape.getY() - @attackSpeed * frameTime
    maxH = levelManager.ground - @maxHeight*32 + 8
    if tmp > maxH
      @parts[0].shape.setY(tmp)
    else
      @parts[0].shape.setY(maxH)
      @finish()

  placeBlock: ->
    new CubeFragment(@shape.getX(), @shape.getY(), SquareEnum.SMALL)

  bossEscape: (frameTime) ->
    tmp = @shape.getX() + @speed * frameTime
    if tmp < 800
      @shape.setX(tmp)

  finish: ->
    super()
    dynamicEntities.find('Sprite').each (cube) ->
      cube.destroy()