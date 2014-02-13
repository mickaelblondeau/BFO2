class LabiMan extends MultiPartBoss
  constructor: (pattern) ->
    @levelHeight = arena.y - levelManager.levelHeight
    x = 256
    y = stage.getY() * -1
    @oldPos = { x: x, y: y }
    super('labiman', x, y, 64, 64)

    @attacks = pattern[1]
    @speed = pattern[0][0]
    @attackSpeed = pattern[0][1]
    @maxHeight = @getMaxHeight()

    @waiting = false
    @attacking = false
    @count = 0
    @index = 0

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
        self.moveToPosition(frameTime)
      else
        self.bossEscape(frameTime)
      if self.attacking
        self.attack(frameTime)

  moveToPosition: (frameTime) ->
    destX = @attacks[@index][0]*32 + 160
    if @shape.getX() > destX and @oldPos.x > destX
      tmp = @shape.getX() - @speed * frameTime
      if tmp < destX
        @shape.setX(destX)
        @oldPos.x = @shape.getX()
      else
        @shape.setX(tmp)
    else if @shape.getX() < destX and @oldPos.x < destX
      tmp = @shape.getX() + @speed * frameTime
      if tmp > destX
        @shape.setX(destX)
        @oldPos.x = @shape.getX()
      else
        @shape.setX(tmp)

    destY = @levelHeight - @attacks[@index][1]*32
    if @shape.getY() > destY and @oldPos.y > destY
      tmp = @shape.getY() - @speed * frameTime
      if tmp < destY
        @shape.setY(destY)
        @oldPos.y = @shape.getY()
      else
        @shape.setY(tmp)
    else if @shape.getY() < destY and @oldPos.y < destY
      tmp = @shape.getY() + @speed * frameTime
      if tmp > destY
        @shape.setY(destY)
        @oldPos.y = @shape.getY()
      else
        @shape.setY(tmp)

    if @shape.getY() is destY and @shape.getX() is destX
      @index++
      @count++
      @placeBlock()
      if @attacks[@index] is undefined
        @waiting = true
      if @count is 7
        @attacking = true

  attack: (frameTime) ->
    tmp = @parts[0].shape.getY() - @attackSpeed * frameTime
    maxH = @levelHeight - @maxHeight*32 + 8
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