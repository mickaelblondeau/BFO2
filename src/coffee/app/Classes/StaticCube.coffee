class StaticCube extends Cube
  constructor: (x, y, size) ->
    super(x, y, size, 'white')
    staticCubes.add @shape
    @shape.draw()