class Player
  constructor: (x, y) ->
    @x = x
    @y = y
    @draw()
    @heightCouched = 30
    @height = 62

  draw: ->
    @shape = new Kinetic.Rect
      x: @x
      y: @y
      width: 32
      height: 62
      stroke: 'black'
      strokeWidth: 1

    players.add @shape