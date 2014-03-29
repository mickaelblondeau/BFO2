class Bonus extends Block
  constructor: (col, line, type) ->
    super(col, line, type, false)
    @send()

  send: ->
    networkManager.sendBonus(@col, @type.id, cubeManager.bonusId)
    cubeManager.bonusId++