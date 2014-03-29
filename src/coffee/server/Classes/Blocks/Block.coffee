class Block
  constructor: (col, line, type, solid) ->
    @col = col
    @line = line
    @type = type
    @solid = solid
    if @solid
      cubeManager.cubes.push(@)
    @send()

  intersect: (col, line) ->
    return col >= @col and col < @col + @type.width and line >= @line and line < @line + @type.height

  send: ->
    networkManager.sendCube(@col, @type.size)
    cubeManager.addCubeToMap(@col, @line, @type)