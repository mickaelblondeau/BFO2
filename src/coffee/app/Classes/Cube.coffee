SquareEnum = {
  BONUS : { x: 0, y: 0 }
  SMALL : { x: 32, y: 32 }
  MEDIUM : { x: 64, y: 64 }
  LARGE : { x: 128, y: 128 }
  MEDIUM_RECT : { x: 64, y: 32 }
  LARGE_RECT : { x: 128, y: 64 }
  LONG_RECT : { x: 32, y: 128 }
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
      width: @size.x
      height: @size.y
      fill: @color
      stroke: 'black'
      strokeWidth: 1