bonusTypesId = [{
  id: 1
  name: 'speed'
}, {
  id: 2
  name: 'jumpHeight'
}, {
  id: 3
  name: 'doubleJump'
}, {
  id: 4
  name: 'grabbing'
}, {
  id: 5
  name: 'resurection'
}]

class Bonus extends Sprite
  constructor: (col, typeId, id) ->
    animation = ''
    for type in bonusTypesId
      if typeId is type.id
        animation = type.name
    x = col * 32 + 160 + 6
    y = stage.getY() * -1

    super(x, y, SquareEnum.BONUS, 'bonus', animation)
    dynamicEntities.add @shape
    @shape.setId('bonus' + id)
    @shape.setName({ type: 'bonus', name: @type, falling: true })
    @shape.setOffsetX(6)
    @shape.setOffsetY(12)
    @shape.draw()