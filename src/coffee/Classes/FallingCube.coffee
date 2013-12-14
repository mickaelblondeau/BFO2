class FallingCube extends Cube
  constructor: (col, size, destination) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    super(x, y, size)
    fallingCubes.add @shape
    @shape.setFill('lightgrey')
    @shape.setName('falling')
    @shape.draw()

    @destination = 880 - destination * 32 - size
    @diffY = @destination - y
    @speed = 600
    @fall()

  fall: ->
    self = @
    tween = new Kinetic.Tween
      node: @shape
      duration: @diffY/@speed
      y: @destination
      onFinish: ->
        self.shape.setName(null)
    tween.play()