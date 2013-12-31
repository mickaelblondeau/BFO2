class FallingCube extends Cube
  constructor: (col, size, destination, placed, placeX, placeY) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    anim = size.x + '-' + size.y
    super(x, y, size, @getSpriteSheet(), anim)
    dynamicEntities.add @shape
    @shape.setName('falling')
    @shape.draw()

    @destination = (arena.y - destination * 32 - size.y)
    @diffY = @destination - y
    @speed = 600

    if placed is undefined
      @fall()
    else
      @shape.setName(null)
      @shape.setX(placeX)
      @shape.setY(placeY)

  fall: ->
    self = @
    tween = new Kinetic.Tween
      node: @shape
      duration: @diffY/@speed
      y: @destination
      onFinish: ->
        self.shape.setName(null)
        tween.destroy()
    tween.play()

  getSpriteSheet: ->
    sheets = ["cubes_red", "cubes_green", "cubes_blue"]
    return sheets[Math.floor((Math.random()*sheets.length))]