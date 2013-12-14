class Arena
  constructor: () ->
    @y = stage.getHeight() - 96
    @draw()

  draw: ->
    for i in [0..13]
      new StaticCube(i*32 + 128, @y, 32)
    for i in [0..80]
      new StaticCube(128, @y-i*32, 32)
      new StaticCube(13*32 + 128, @y-i*32, 32)

  reset: ->
    @clear()
    @draw()

  clear: ->
    shapes = staticCubes.find('Rect')
    shapes.each (shape) ->
      shape.remove()
    staticCubes.draw()