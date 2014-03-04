class Boss extends Sprite
  constructor: (type, x, y, w, h) ->
    @origin = { x: x, y: y }
    @speed = 0.2
    super(x, y, { x: w, y: h }, 'boss', type)
    dynamicEntities.add @shape
    @shape.setName({ type: 'boss', name: type })
    @shape.setFrameRate(10)
    @shape.start()

  finish: ->
    bossManager.stopUpdate()
    @shape.destroy()
    networkManager.sendBossBeaten()

  reset: ->
    @shape.destroy()

  move: (frameTime, x, y) ->
    speed = @speed * frameTime

    if @origin.x > x
      tmp = @shape.getX() - speed
      if tmp > x
        @shape.setX(tmp)
      else
        @shape.setX(x)
        @origin.x = x
    else if @origin.x < x
      tmp = @shape.getX() + speed
      if tmp < x
        @shape.setX(tmp)
      else
        @shape.setX(x)
        @origin.x = x

    if @origin.y > y
      tmp = @shape.getY() - speed
      if tmp > y
        @shape.setY(tmp)
      else
        @shape.setY(y)
        @origin.y = y
    else if @origin.y < y
      tmp = @shape.getY() + speed
      if tmp < y
        @shape.setY(tmp)
      else
        @shape.setY(y)
        @origin.y = y

    if @shape.getX() is x and @shape.getY() is y
      return true
    else
      return false