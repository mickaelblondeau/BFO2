randomEvents = [
  'resurection',
  'speed',
  'grabbing',
  'doubleJump',
  'jumpHeight',
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

  playEffect: (effect) ->
    effect = new Sprite(@shape.getX() + 16, @shape.getY() + 16, SquareEnum.SMALL, 'bonus', effect)
    dynamicEntities.add effect.shape
    effect.shape.setName({ type: 'effect' })
    effect.shape.draw()

    tmpX = effect.shape.getX() - 16
    tmpY = effect.shape.getY() - 16

    tween = new Kinetic.Tween
      node: effect.shape
      duration: 0.3
      scaleX: 2
      scaleY: 2
      x: tmpX
      y: tmpY
      onFinish: ->
        effect.shape.destroy()
    tween.play()
    cubeManager.tweens.push(tween)

  doEvent: ->
    contentLoader.play('explosion')
    event = @shape.getName().randType
    if event is 'resurection'
      player.resurection()
      @playEffect('resurectionBonus')

    else if event is 'speed'
      bonusManager.getBonus('speedBonus', player)
      @playEffect('speedBonus')

    else if event is 'grabbing'
      bonusManager.getBonus('grabbingBonus', player)
      @playEffect('grabbingBonus')

    else if event is 'doubleJump'
      bonusManager.getBonus('doubleJumpBonus', player)
      @playEffect('doubleJumpBonus')

    else if event is 'jumpHeight'
      bonusManager.getBonus('jumpHeightBonus', player)
      @playEffect('jumpHeightBonus')

    else if event is 'tp'
      player.shape.setX(@shape.getX()+16)
      player.shape.setY(@shape.getY()+64)
      @playEffect('tp')

    @shape.destroy()