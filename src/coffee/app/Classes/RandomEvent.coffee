randomEvents = [
  'resurection',
  'bonuses',
  'tp'
]

class RandomEvent extends Sprite
  constructor: (type) ->
    x = stage.getWidth()/2 - 32
    y = stage.getY() * -1 - 64
    @type = randomEvents[type]
    super(x, y, SquareEnum.MEDIUM, 'cubes_special', 'randomEvent')
    dynamicEntities.add @shape
    @shape.setName({ type: 'event', randType: @type })
    @shape.draw()

    self = @

    tween = new Kinetic.Tween
      node: @shape
      duration: 1
      y: arena.y - levelManager.levelHeight - 640
      onFinish: ->
        self.doEvent()
    tween.play()
    cubeManager.tweens.push(tween)

  doEvent: ->
    contentLoader.play('explosion')
    event = @shape.getName().randType
    if event is 'resurection'
      player.resurection()
      new Effect(@shape.getX(), @shape.getY(), SquareEnum.SMALL, 'resurectionBonus', null, true)

    else if event is 'bonuses'
      new Effect(@shape.getX(), @shape.getY(), SquareEnum.SMALL, 'speedBonus', null, true)
      for i in [1..4]
        rand = Math.floor((Math.random()*12))
        randType = Math.floor((Math.random()*(bonusTypesId.length - 1))) + 1
        new Bonus(rand, randType, null)

    else if event is 'tp'
      player.shape.setX(@shape.getX()+16)
      player.shape.setY(@shape.getY()+64)
      new Effect(@shape.getX(), @shape.getY(), SquareEnum.SMALL, 'tp', null, true)

    @shape.destroy()