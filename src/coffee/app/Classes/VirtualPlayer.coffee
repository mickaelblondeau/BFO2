class VirtualPlayer extends Player
  constructor: (name) ->
    super()
    @skin.setFill('white')
    @name = new Kinetic.Text
      text: name
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    players.add @name

  move: (x, y) ->
    @shape.setX(x)
    @shape.setY(y)
    @skin.setX(x)
    @skin.setY(y)
    @name.setX(x)
    @name.setY(y - 20)

  remove: ->
    @shape.destroy()
    @skin.destroy()
    @name.destroy()
    delete @