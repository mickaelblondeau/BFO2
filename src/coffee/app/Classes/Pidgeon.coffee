class Pidgeon extends Sprite
  constructor: ->
    super(-32, @getY(), SquareEnum.SMALL, 'pidgeon', 'fly')
    staticBg.add @shape
    @shape.setFrameRate(8)
    @shape.start()
    @speed = 0.05
    @side = 1

  update: (frametime) ->
    moveSpeed = @speed * frametime
    tmp = @shape.getX() + moveSpeed * @side
    if tmp > 1000 or tmp < -256
      @side *= -1
      @shape.setScaleX(@side)
      @shape.setY(@getY())
    @shape.setX(tmp)

  getY: ->
    return arena.y - Math.floor((Math.random()*12)+12) * 32