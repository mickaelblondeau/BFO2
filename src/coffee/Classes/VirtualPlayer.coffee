class VirtualPlayer extends Player
  constructor: (name) ->
    super()
    @name = name

  move: (x, y) ->
    @shape.setX(x)
    @shape.setY(y)

  remove: ->
    @shape.destroy()
    delete @