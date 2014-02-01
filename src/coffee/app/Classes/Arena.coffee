class Arena
  constructor: () ->
    @y = stage.getHeight() - 32
    @initHeight = 32
    @height = @initHeight
    @draw()

  draw: ->
    for i in [0..13]
      new StaticCube(i*32 + 128, @y, SquareEnum.SMALL)
    for i in [0..@height]
      new StaticCube(128, @y-i*32, SquareEnum.SMALL)
      new StaticCube(544, @y-i*32, SquareEnum.SMALL)

  reset: ->
    @height = @initHeight
    @clear()
    @draw()

  clear: ->
    shapes = staticCubes.find('Sprite')
    shapes.each (shape) ->
      shape.remove()
    staticCubes.draw()

  add: (level) ->
    for i in [@height..@height+level]
      new StaticCube(128, @y-i*32, SquareEnum.SMALL)
      new StaticCube(544, @y-i*32, SquareEnum.SMALL)
    @height += level

  clearOutOfScreen: ->
    cubes = staticCubes.find('Sprite')
    cubes.each (cube) ->
      if cube.getY() > stage.getY()*-1 + stage.getHeight()
        cube.destroy()

  createGround: ->
    if levelManager.level > 0
      for i in [1..12]
        new StaticCube(i*32 + 128, stage.getY()*-1 + stage.getHeight() - 32, SquareEnum.SMALL)