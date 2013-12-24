class FallingCube extends Cube
  constructor: (col, size, destination) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    super(x, y, size, @getColor())
    fallingCubes.add @shape
    @shape.setName('falling')
    @shape.draw()

    @destination = arena.y - destination * 32 - size.y
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

  getColor: ->
    colors = ["_red", "_green", "_blue"]
    return colors[Math.floor((Math.random()*colors.length))]