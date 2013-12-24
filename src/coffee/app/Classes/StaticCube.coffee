class StaticCube extends Cube
  constructor: (x, y, size) ->
    super(x, y, size, '')
    staticCubes.add @shape
    @shape.draw()