class Bonus
  constructor: (col, destination, type) ->
    @type = type
    @x = col * 32 + 160
    @y = stage.getY() * -1
    @draw()

    @destination = arena.y - destination * 32 - 32
    @diffY = @destination - @y
    @speed = 600
    @fall()

  fall: ->
    tween = new Kinetic.Tween
      node: @shape
      duration: @diffY/@speed
      y: @destination
    tween.play()

  draw: ->
    @shape = new Kinetic.Rect
      x: @x
      y: @y
      width: 32
      height: 32
      fill: 'gold'
      stroke: 'black'
      strokeWidth: 1
      name: 'bonus ' + @type
    fallingCubes.add @shape