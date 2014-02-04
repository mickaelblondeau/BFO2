class SpecialCube extends Cube
  constructor: (col, size, type) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    @type = type
    super(x, y, size, 'cubes_special', type)
    dynamicEntities.add @shape
    @shape.setName({ type: 'special', falling: true })
    @shape.setId(type)
    @shape.draw()