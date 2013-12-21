class VirtualPlayer extends Player
  constructor: (name) ->
    super()
    @name = name
    @skin.setFill('white')

  move: (x, y) ->
    @shape.setX(x)
    @shape.setY(y)
    @skin.setX(x)
    @skin.setY(y)

  remove: ->
    @shape.destroy()
    @skin.destroy()
    delete @