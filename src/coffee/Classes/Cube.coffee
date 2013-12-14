SquareEnum = {
  SMALL : 32
  MEDIUM : 64
  LARGE : 128
}

class Cube
  constructor: (x, y, size, type) ->
    @x = x
    @y = y
    @size = size
    @type = type
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

    if @type is 'static'
      staticCubes.add @shape
    else if @type is 'falling'
      @shape.setFill('lightgrey')
      @shape.setName('falling')
      fallingCubes.add @shape
    @shape.draw()