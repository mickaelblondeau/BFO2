class SpecialCube extends Cube
  constructor: (col, size, type, randType) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    @type = type
    super(x, y, size, 'cubes_special', type)
    dynamicEntities.add @shape
    if randType isnt undefined
      @shape.setName({ type: 'special', falling: true, randType: randType })
    else
      @shape.setName({ type: 'special', falling: true })
    @shape.setId(type)
    @shape.draw()