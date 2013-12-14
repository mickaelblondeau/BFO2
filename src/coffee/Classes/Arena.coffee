class Arena
  constructor: () ->
    @y = stage.getHeight() - 96
    @draw()

  draw: ->
    for i in [0..13]
      new Cube(i*32 + 128, @y, 32, 'static')
    for i in [0..80]
      new Cube(128, @y-i*32, 32, 'static')
      new Cube(13*32 + 128, @y-i*32, 32, 'static')

  reset: ->
    @clear()
    @draw()

  clear: ->
    shapes = staticCubes.find('Rect')
    shapes.each (shape) ->
      shape.remove()
    staticCubes.draw()