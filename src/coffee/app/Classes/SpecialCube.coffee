SpecialCubes = [
  'iceExplosion',
  'slowblock',
  'stompblock',
  'swapblock',
  'tpblock',
  'randblock'
]

class SpecialCube extends Sprite
  constructor: (col, size, type, randType) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    @type = SpecialCubes[type]
    console.log type
    super(x, y, size, 'cubes_special', @type)
    dynamicEntities.add @shape
    if randType isnt undefined
      rType = SpecialCubes[randType]
      @shape.setName({ type: 'special', falling: true, randType: rType })
    else
      @shape.setName({ type: 'special', falling: true })
    @shape.setId(@type)
    @shape.draw()