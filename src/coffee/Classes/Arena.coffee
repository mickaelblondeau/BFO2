class Arena
  constructor: () ->
    @y = stage.getHeight()
    @draw()

  draw: ->
    for i in [0..13]
      new StaticCube(i*32 + 128, @y, SquareEnum.SMALL)
    for i in [0..32]
      new StaticCube(128, @y-i*32, SquareEnum.SMALL)
      new StaticCube(13*32 + 128, @y-i*32, SquareEnum.SMALL)

  reset: ->
    @clear()
    @draw()

  clear: ->
    shapes = staticCubes.find('Rect')
    shapes.each (shape) ->
      shape.remove()
    staticCubes.draw()