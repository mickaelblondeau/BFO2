SquareEnum = {
  SMALL : 32
  MEDIUM : 64
  LARGE : 128
}

class Cube
  constructor: (x, y, size, color) ->
    @x = x
    @y = y
    @size = size
    @color = color
    @draw()

  draw: ->
    @shape = new Kinetic.Rect
      x: @x
      y: @y
      width: @size
      height: @size
      fill: @color
      stroke: 'black'
      strokeWidth: 1