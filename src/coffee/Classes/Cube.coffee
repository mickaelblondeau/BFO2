SquareEnum = {
  SMALL : 32
  MEDIUM : 64
  LARGE : 128
}

class Cube
  constructor: (x, y, size) ->
    @x = x
    @y = y
    @size = size
    @draw()

  draw: ->
    @shape = new Kinetic.Rect
      x: @x
      y: @y
      width: @size
      height: @size
      fill: 'red'
      stroke: 'black'
      strokeWidth: 1