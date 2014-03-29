class Special extends Block
  constructor: (col, line, type) ->
    solid = false
    if type is 'test'
      solid = true
    super(col, line, type, solid)
    @send()

  send: ->
    if @type.special is 'explosion'
      cubeManager.explodeMap(@col, @line)
    if @type.special is 'slowblock' or @type.special is 'iceExplosion'
      cubeManager.addCubeToMap(@col, @line, @type)
    if @type.special is 'randblock'
      id = Math.floor(Math.random()*(SpecialCubes.length - 1))
      randType = SpecialCubes[id]
      if randType is 'explosion'
        cubeManager.explodeMap(@col, @line)
      if randType is 'slowblock' or randType is 'iceExplosion'
        cubeManager.addCubeToMap(@col, @line, @type)
      networkManager.sendRanSpecial(@col, @type.size, id)
    else
      networkManager.sendSpecial(@col, @type.size, @type.id)