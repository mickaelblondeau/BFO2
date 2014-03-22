class VirtualPlayer extends Player
  constructor: (id, name, skin) ->
    super(skin)
    @skin.setFill('white')
    @shape.setName('otherPlayer')
    @shape.setId(id)
    @skin.setId('skin-' + id)
    @skin.setOpacity(0.5)
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
    contentLoader.play('death')
    new Effect(@shape.getX() - 16, @shape.getY(), SquareEnum.SMALL, 'blood', true)