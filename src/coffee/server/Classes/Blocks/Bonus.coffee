class Bonus extends Block
  constructor: (col, line, type) ->
    super(col, line, type, false)

  send: ->
    if @type.bonus is 'deployedJumpBlockBonus'
      networkManager.sendJumpBlock(@col)
    else
      networkManager.sendBonus(@col, @type.id, cubeManager.bonusId)
      cubeManager.bonusId++