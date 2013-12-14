class FallingCube extends Cube
  constructor: (col, size, destination) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    super(x, y, size, 'falling')
    @destination = 880 - destination * 32 - size
    @speed = 600
    @fall()

  fall: ->
    self = @
    tween = new Kinetic.Tween
      node: @shape
      duration: @destination/@speed
      y: @destination
      onFinish: ->
        self.shape.setName(null)
    tween.play()