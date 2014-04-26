class Special extends Block
  constructor: (col, line, type) ->
    solid = true
    super(col, line, type, solid)

  send: ->
    if @type.special is 'randblock'
      id = Math.floor(Math.random()*(SpecialCubes.length - 1))
      cubeManager.addCubeToMap(@col, @line, @type)
      networkManager.sendRanSpecial(@col, @type.size, id)
    else
      cubeManager.addCubeToMap(@col, @line, @type)
      networkManager.sendSpecial(@col, @type.size, @type.id)