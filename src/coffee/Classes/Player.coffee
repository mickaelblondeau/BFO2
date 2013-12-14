class Player
  constructor: (x, y) ->
    @x = x
    @y = y
    @draw()

  draw: ->
    @shape = new Kinetic.Rect
      x: @x
      y: @y
      width: 32
      height: 64
      stroke: 'black'
      strokeWidth: 1

    players.add @shape