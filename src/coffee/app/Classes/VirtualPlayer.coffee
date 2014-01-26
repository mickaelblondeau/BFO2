class VirtualPlayer extends Player
  constructor: (id, name) ->
    super()
    @skin.setFill('white')
    @shape.setName('otherPlayer')
    @shape.setId(id)
    @skin.setId('skin-' + id)
    @name = new Kinetic.Text
      text: name
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    players.add @name

  move: (x, y) ->
    @shape.setX(x)
    @shape.setY(y)
    @name.setX(x)
    @name.setY(y - 20)
    @fixSkinPos()

  remove: ->
    @shape.destroy()
    @skin.destroy()
    @name.destroy()
    delete @

  kill: ->
    contentLoader.sounds['death'].play()