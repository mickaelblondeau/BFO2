bonusTypesId = [
  {
    id: 1
    name: 'speedBonus'
  }, {
    id: 2
    name: 'jumpHeightBonus'
  }, {
    id: 3
    name: 'doubleJumpBonus'
  }, {
    id: 4
    name: 'grabbingBonus'
  }, {
    id: 5
    name: 'resurectionBonus'
  }, {
    id: 6
    name: 'autoRezBonus'
  }, {
    id: 7
    name: 'tpBonus'
  }
]

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
    @shape.setName({ type: 'bonus', name: animation, falling: true })
    @shape.setOffsetX(6)
    @shape.setOffsetY(12)
    @shape.draw()